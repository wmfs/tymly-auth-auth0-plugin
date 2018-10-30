/* eslint-env mocha */


const expect = require('chai').expect
const tymly = require('@wmfs/tymly')
const path = require('path')

const userData = {
  name: 'Jim Heednam',
  family_name: 'Heednam',
  given_name: 'Jim',
  nickname: 'Jim.Heednam',
  groups: [
    'Analysts',
    '_ICT',
    '_Management Briefings',
    'C&C Project Team',
    '_HQ Staff',
    'WEBADMIN',
    '_ICT Applications Development and Support',
    'Wireless Users',
    '_ICT GIS Project Team',
    'Internet Access Level 3',
    'Mailer Mailbox Access',
    'EncryptedLaptopUsers',
    'Melio Support Mailbox Access',
    'DL_Academy_Mod',
    'DL_All_Users',
    'External_Exchange_OWA',
    'DL_Corporate_Risk_Assurance_Mod',
    '_Software Services Mailbox Access Group',
    'MobiControl ICT Developers',
    'DL_Academy_Fire_Risk_Assesment_Folder_Modify',
    'DL_Academy_Shared_Modify',
    '_Greenbook Employees',
    'ILAP Mailbox Access',
    'SSRI Mailbox Access',
    'Remote Assistance Providers',
    'GG ICU Project Team',
    'ICT_SVN_REPO_RENAME',
    'ICT_SVN_REPO_DELETE',
    '_Middle Managers',
    'ICT Test - Smoothwall Proxy',
    '_DOD',
    '_Ops Contacts Access',
    '_ICT Team Leaders',
    'DL_Exchange_Online_Office365_MDM_Apply',
    '_Tymly Grunt'
  ],
  emails: [
    'jim.neednam@wmfs.net'
  ],
  dn: 'CN=Jim Heednam,OU=Sys Dev Users,OU=User Accounts,OU=WMFS,DC=wmfs,DC=net',
  description: 'Software Architect',
  telephoneNumber: '0121 380 6558',
  distinguishedName: 'CN=Jim Heednam,OU=Sys Dev Users,OU=User Accounts,OU=WMFS,DC=wmfs,DC=net',
  department: 'ICT Systems Development',
  company: 'West Midlands Fire Service',
  mailNickname: 'Jim.Heednam',
  sAMAccountName: 'Jim.Heednam',
  sAMAccountType: '805306368',
  userPrincipalName: 'Jim.Heednam@wmfs.net',
  organizationUnits: 'CN=Jim Heednam,OU=Sys Dev Users,OU=User Accounts,OU=WMFS,DC=wmfs,DC=net',
  email: 'jim.neednam@wmfs.net',
  updated_at: '2018-10-24T12:32:54.680Z',
  picture: 'https://s.gravatar.com/avatar/0c2d99293ed4a5b1144df820799e8663?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Ftn.png',
  user_id: 'ad|WMFS|2c970731-68f1-44e6-99bb-00d5f8e60cf5',
  identities: [
    {
      user_id: 'WMFS|2c970731-68f1-44e6-99bb-00d5f8e60cf5',
      provider: 'ad',
      connection: 'WMFS',
      isSocial: false
    }
  ],
  created_at: '2018-03-29T15:52:56.430Z',
  issuer: 'urn:wmfs.net',
  last_ip: '83.244.223.82',
  last_login: '2018-10-24T12:32:54.680Z',
  logins_count: 493
}

describe('group mapping tests', () => {
  let tymlyService
  let userInfoService
  let auth0GroupMappingService

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
        auth0GroupMappingService = tymlyServices.auth0GroupMapping
        done()
      }
    )
  })

  describe('mapping Auth0 groups to RBAC groups', () => {
    it('no mapping provided', () => {
      const rbacGroups = auth0GroupMappingService.translateGroups(userData.groups)
      expect(rbacGroups).to.eql([])
    })

    it('add a couple of groups', () => {
      auth0GroupMappingService.addAuth0Mapping('_ICT Team Leaders', 'testTymly_TeamLeader')

      const rbacGroups = auth0GroupMappingService.translateGroups(userData.groups)
      expect(rbacGroups).to.eql(['testTymly_TeamLeader'])
    })
  })

  after('shutdown Tymly', async () => {
    await tymlyService.shutdown()
  })
})