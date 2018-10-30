class Auth0GroupMapping {
  boot (options, callback) {
    callback(null)
  } // boot

  addAuth0Mapping () {

  } // addAuth0Mapping

  translateGroups () {
    return null
  }
} // class Auth0GroupMapping

module.exports = {
  serviceClass: Auth0GroupMapping,
  bootAfter: ['rbac', 'storage']
}