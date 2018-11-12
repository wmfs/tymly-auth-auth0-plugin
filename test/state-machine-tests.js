/* eslint-env mocha */

const expect = require('chai').expect
const tymly = require('@wmfs/tymly')
const path = require('path')

describe('Auth0 Groups Mapping State Machine', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService
  let statebox

  const adminUser = 'administrator'

  before('boot Tymly', done => {
    tymly.boot(
      {
        pluginPaths: [
          path.resolve(__dirname, '../'),
          require.resolve('@wmfs/tymly-rbac-plugin')
        ]
      },
      async (err, services) => {
        if (err) return done(err)

        tymlyService = services.tymly
        statebox = services.statebox

        await services.rbacAdmin.ensureUserRoles(adminUser, ['tymly_rbacAdmin'])
        services.rbac.debug()

        done()
      }
    )
  })

  describe('no mappings', () => {
    it('list mappings', async () => {
      const mappings = await statebox.startExecution(
        {},
        'auth0_listMappings_1_0',
        {
          sendResponse: 'COMPLETE',
          userId: adminUser
        }
      )

      expect(mappings.status).to.eql('SUCCEEDED')
      expect(mappings.ctx.mappings).to.eql([])
    })
  })

  describe('add group mappings', () => {
    const mappings = [
      ['_ICT Boss', 'tymly_TeamLeader'],
      ['_FireSafety', 'safeAndWell'],
      ['_ICT Boss', 'admin']
    ]

    for (const [auth0, rbac] of mappings) {
      it(`map ${auth0} to ${rbac}`, async () => {
        await statebox.startExecution(
          {
            auth0: auth0,
            roleId: rbac
          },
          'auth0_addMapping_1_0',
          {
            sendResponse: 'COMPLETE',
            userId: adminUser
          }
        )
      })
    }
  })

  describe('mappings added', () => {
    it('list mappings again', async () => {
      const mappings = await statebox.startExecution(
        {},
        'auth0_listMappings_1_0',
        {
          sendResponse: 'COMPLETE',
          userId: adminUser
        }
      )

      expect(mappings.status).to.eql('SUCCEEDED')
      expect(mappings.ctx.mappings).to.eql([
        { auth0: '_ICT Boss', roles: ['tymly_TeamLeader', 'admin'] },
        { auth0: '_FireSafety', roles: ['safeAndWell'] }
      ])
    })
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
