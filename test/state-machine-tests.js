/* eslint-env mocha */

const expect = require('chai').expect
const tymly = require('@wmfs/tymly')
const path = require('path')

describe('Auth0 Groups Mapping State Machine', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let tymlyService
  let statebox
  let auth0GroupMapping

  const adminUser = 'administrator'

  before('boot Tymly', done => {
    tymly.boot(
      {
        pluginPaths: [
          path.resolve(__dirname, '../'),
          require.resolve('@wmfs/tymly-rbac-plugin'),
          require.resolve('@wmfs/tymly-cardscript-plugin'),
          require.resolve('@wmfs/tymly-solr-plugin')
        ],
        blueprintPaths: [
          require.resolve('@wmfs/tymly-test-helpers/blueprints/mock-blueprint')
        ]
      },
      async (err, services) => {
        if (err) return done(err)

        tymlyService = services.tymly
        statebox = services.statebox
        auth0GroupMapping = services.auth0GroupMapping

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

  describe('remove mappings', () => {
    it('remove a mapping', async () => {
      await statebox.startExecution(
        {
          auth0: '_ICT Boss',
          roleId: 'admin'
        },
        'auth0_removeMapping_1_0',
        {
          sendResponse: 'COMPLETE',
          userId: adminUser
        }
      )

      const mappings = auth0GroupMapping.listAuth0Mappings()
      expect(mappings).to.eql([
        { auth0: '_ICT Boss', roles: ['tymly_TeamLeader'] },
        { auth0: '_FireSafety', roles: ['safeAndWell'] }
      ])
    })

    it('remove a mapping, bad role', async () => {
      await statebox.startExecution(
        {
          auth0: '_FireSafety',
          roleId: 'a load of nonsense'
        },
        'auth0_removeMapping_1_0',
        {
          sendResponse: 'COMPLETE',
          userId: adminUser
        }
      )

      const mappings = auth0GroupMapping.listAuth0Mappings()
      expect(mappings).to.eql([
        { auth0: '_ICT Boss', roles: ['tymly_TeamLeader'] },
        { auth0: '_FireSafety', roles: ['safeAndWell'] }
      ])
    })

    it('remove a mapping, bad group', async () => {
      await statebox.startExecution(
        {
          auth0: 'made up name',
          roleId: 'not important'
        },
        'auth0_removeMapping_1_0',
        {
          sendResponse: 'COMPLETE',
          userId: adminUser
        }
      )

      const mappings = auth0GroupMapping.listAuth0Mappings()
      expect(mappings).to.eql([
        { auth0: '_ICT Boss', roles: ['tymly_TeamLeader'] },
        { auth0: '_FireSafety', roles: ['safeAndWell'] }
      ])
    })
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})
