class UserIdFromEmail {
  init (resourceConfig, env) {
    this.userInfo = env.bootedServices.userInfo
  }

  async run (event, context) {
    const userId = await this.userInfo.userIdFromEmail(event)
    context.sendTaskSuccess(userId)
  }
}

module.exports = UserIdFromEmail
