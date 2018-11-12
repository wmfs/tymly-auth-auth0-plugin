class RemoveAuth0Mapping {
  init (resourceConfig, env, callback) {
    this.auth0GroupMapping = env.bootedServices.auth0GroupMapping
    callback(null)
  } // init

  async run (event, context) {
    const auth0 = event.auth0
    const rbac = event.roleId

    if (!auth0 || !rbac) {
      return context.sendTaskFailure({
        error: 'RemoveAuth0Mapping',
        cause: new Error('RemoveAuth0Mapping needs an auth0 group name, an RBAC roleId, and optionally a description')
      })
    }

    await this.auth0GroupMapping.removeAuth0Mapping(auth0, rbac)

    context.sendTaskSuccess()
  } // run
} // class AddAuth0Mapping

module.exports = RemoveAuth0Mapping
