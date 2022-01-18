class GetAllAuth0UserById {
  init (resourceConfig, env) {
    this.logger = env.bootedServices.logger.child('stateResource:getAllAuth0UserById')
    this.userInfo = env.bootedServices.userInfo
  } // init

  async run (userId, context) {
    let user = {}

    if (userId) {
      try {
        user = await this.userInfo.allFromUserId(userId)

        if (!user.groups) {
          user.groups = []
        }
      } catch (err) {
        this.logger.warn(`Error getting user: ${err}`)
      }
    } else {
      this.logger.warn('Error getting user: No User ID provided')
    }

    context.sendTaskSuccess(user)
  } // run
} // class GetAllAuth0UserById

module.exports = GetAllAuth0UserById
