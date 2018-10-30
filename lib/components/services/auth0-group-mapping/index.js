class Auth0GroupMapping {
  boot (options, callback) {
    this.mappings = new Map()

    callback(null)
  } // boot

  addAuth0Mapping (auth0, rbac) {
    this.mappings.set(auth0, rbac)
  } // addAuth0Mapping

  translateGroups (auth0Groups) {
    return auth0Groups
      .map(auth0Group => this._translateAuth0(auth0Group))
      .filter(group => !!group)
  } // translateGroups

  _translateAuth0 (auth0Group) {
    return this.mappings.get(auth0Group)
  } // _translateAuth0
} // class Auth0GroupMapping

module.exports = {
  serviceClass: Auth0GroupMapping,
  bootAfter: ['rbac', 'storage']
}
