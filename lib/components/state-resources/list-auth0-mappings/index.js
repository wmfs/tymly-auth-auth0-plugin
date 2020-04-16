class ListAuth0Mappings {
  init (resourceConfig, env) {
    this.auth0GroupMapping = env.bootedServices.auth0GroupMapping
  } // init

  run (event, context) {
    const mappings = this.auth0GroupMapping.listAuth0Mappings()

    context.sendTaskSuccess(mappings)
  } // run
} // class ListAuth0Mappings

module.exports = ListAuth0Mappings
