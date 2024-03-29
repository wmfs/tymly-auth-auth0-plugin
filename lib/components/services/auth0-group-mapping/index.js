class Auth0GroupMapping {
  async boot (options) {
    this.mappings = new Map()

    this.mappingTable = options.bootedServices.storage.models.auth0_groupMapping

    const existingMappings = await this.mappingTable.find({})
    existingMappings.forEach(row =>
      this._addMapping(row.grouping, row.roleId)
    )
  } // boot

  listAuth0Mappings () {
    const map = []
    for (const [group, roles] of this.mappings.entries()) {
      map.push({
        auth0: group,
        roles
      })
    }
    return map
  } // listAuth0Mapping

  async addAuth0Mapping (auth0, rbac, desc = '') {
    await this.mappingTable.upsert(
      {
        grouping: auth0,
        roleId: rbac,
        description: desc
      },
      {}
    )

    this._addMapping(auth0, rbac)
  } // addAuth0Mapping

  async removeAuth0Mapping (auth0, rbac) {
    if (!this.mappings.has(auth0)) return

    await this.mappingTable.destroyById([auth0, rbac])

    const updated = this.mappings.get(auth0).filter(r => r !== rbac)
    if (updated.length) {
      this.mappings.set(auth0, updated)
    } else {
      this.mappings.delete(auth0)
    }
  } // removeAuth0Mapping

  groupsToRoles (auth0Groups) {
    return auth0Groups
      .map(auth0Group => this._translateAuth0(auth0Group))
      .filter(grouping => !!grouping)
      .reduce((allGroups, groups) => {
        allGroups.push(...groups)
        return allGroups
      },
      []
      )
  } // translateGroups

  _translateAuth0 (auth0Group) {
    return this.mappings.get(auth0Group)
  } // _translateAuth0

  _addMapping (group, roleId) {
    if (!this.mappings.has(group)) {
      this.mappings.set(group, [])
    }
    this.mappings.get(group).push(roleId)
  } // _addMapping
} // class Auth0GroupMapping

module.exports = {
  serviceClass: Auth0GroupMapping,
  bootAfter: ['storage']
}
