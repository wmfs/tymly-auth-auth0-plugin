/* eslint-env mocha */

'use strict'

const expect = require('chai').expect
const tymly = require('@wmfs/tymly')
const path = require('path')

// these tests actually hit the Auth0 end point, which doesn't
// hit the accepted definition of 'unit test', but
// here we are
describe('tymly-auth-auth0-plugin tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService
  let userInfoService

  const envVars = [
    'TYMLY_NIC_AUTH0_CLIENT_ID',
    'TYMLY_NIC_AUTH0_CLIENT_SECRET',
    'TYMLY_NIC_AUTH0_DOMAIN'
  ]

  const err = envVars.map(v => !process.env[v] ? v : null).filter(v => !!v)
  const varsFound = err.length === 0
  if (!varsFound) {
    xit('Skipping Auth0 plugin because AUTH0 env vars not set')
    return
  }

  before('fire up Tymly', function (done) {
    tymly.boot(
      {
        pluginPaths: [
          path.resolve(__dirname, './../lib'),
          require.resolve('@wmfs/tymly-test-helpers/plugins/allow-everything-rbac-plugin')
        ],
        blueprintPaths: [],
        config: {}
      },
      function (err, tymlyServices) {
        expect(err).to.eql(null)
        tymlyService = tymlyServices.tymly
        userInfoService = tymlyServices.userInfo
        done()
      }
    )
  })

  describe('userId to email', () => {
    it('convert a user id into an email address', async () => {
      const userId = 'auth0|5a157ade1932044615a1c502'
      const email = await userInfoService.emailFromUserId(userId)
      expect(email).to.eql('tymly@xyz.com')

      const cachedEmail = userInfoService.userIdToEmailCache(userId)
      expect(cachedEmail).to.equal(email)
    })

    it('fail on a non existent user id ', async () => {
      try {
        await userInfoService.emailFromUserId('auth0|ffffffffffffffffffffffff')
      } catch (err) {
        expect(err.statusCode).to.equal(404)
      }
    })
  })

  describe('email to userId', () => {
    it('convert an email address into a user id', async () => {
      const email = 'tymly@xyz.com'
      const userId = await userInfoService.userIdFromEmail(email)
      expect(userId).to.eql('auth0|5a157ade1932044615a1c502')

      const cachedUserId = userInfoService.emailToUserIdCache(email)
      expect(cachedUserId).to.eql(userId)
    })

    it('fail on non-existent email address', async () => {
      try {
        await userInfoService.userIdFromEmail('doesNotExist@xyz.com')
      } catch (err) {
        expect(err.output.statusCode).to.equal(404)
      }
    })
  })

  describe('user groups', () => {
    it('should get user groups via user ID (should return empty array due to no groups)', async () => {
      const groups = await userInfoService.groupsFromUserId('auth0|5a157ade1932044615a1c502')
      expect(groups).to.eql([])
    })
  })

  after('should shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
