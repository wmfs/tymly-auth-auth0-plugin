class UserIdFromEmail {
  init (resourceConfig, env) {
    this.userInfo = env.bootedServices.userInfo
  }

  async run (event, context) {
    const userId = typeof event === 'string'
      ? await this.userInfo.userIdFromEmail(event)
      : null
    context.sendTaskSuccess(userId)
  }
}

module.exports = UserIdFromEmail
