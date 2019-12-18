class GetAllAuth0UserById {
  init (resourceConfig, env, callback) {
    this.userInfo = env.bootedServices.userInfo
    callback(null)
  } // init

  async run (event, context) {
    let user = {}

    if (event) {
      try {
        user = await this.userInfo.allFromUserId(event)
      } catch (err) {
        console.log(`Error getting user: ${err}`)
      }
    } else {
      console.log(`Error getting user: No User ID provided`)
    }

    context.sendTaskSuccess(user)
  } // run
} // class GetAllAuth0UserById

module.exports = GetAllAuth0UserById
