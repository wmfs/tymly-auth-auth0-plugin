class Auth0GroupMapping {
  boot (options, callback) {
    this.mappings = new Map()

    this.mappingTable = options.bootedServices.storage.models.auth0_groupMapping

    callback(null)
  } // boot

  async addAuth0Mapping (auth0, rbac, desc = '') {
    await this.mappingTable.upsert(
      {
        group: auth0,
        roleId: rbac,
        description: desc
      },
      {}
    )

    this.mappings.set(auth0, rbac)
  } // addAuth0Mapping

  groupsToRoles (auth0Groups) {
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
