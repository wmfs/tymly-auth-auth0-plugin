class AddAuth0Mapping {
  init (resourceConfig, env) {
    this.auth0GroupMapping = env.bootedServices.auth0GroupMapping
    this.cacheService = env.bootedServices.caches
  } // init

  async run (event, context) {
    const auth0 = event.auth0
    const rbac = event.roleId
    const desc = event.description

    if (!auth0 || !rbac) {
      return context.sendTaskFailure({
        error: 'AddAuth0Mapping',
        cause: new Error('AddAuth0Mapping needs an auth0 group name, an RBAC roleId, and optionally a description')
      })
    }

    await this.auth0GroupMapping.addAuth0Mapping(auth0, rbac, desc)

    this.cacheService.reset('rolesFromUserId')
    this.cacheService.reset('userMemberships')

    context.sendTaskSuccess()
  } // run
} // class AddAuth0Mapping

module.exports = AddAuth0Mapping
