class ListAuth0Mappings {
  init (resourceConfig, env, callback) {
    this.auth0GroupMapping = env.bootedServices.auth0GroupMapping
    callback(null)
  } // init

  run (event, context) {
    const mappings = this.auth0GroupMapping.listAuth0Mappings()

    context.sendTaskSuccess(mappings)
  } // run
} // class ListAuth0Mappings

module.exports = ListAuth0Mappings
