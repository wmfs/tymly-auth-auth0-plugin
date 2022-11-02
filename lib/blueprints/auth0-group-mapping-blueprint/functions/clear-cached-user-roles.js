module.exports = function () {
  return async function (event, env) {
    const { userId } = event
    const { caches } = env.bootedServices
    caches.userMemberships.delete(userId)
    caches.rolesFromUserId.delete(userId)

    return event
  }
}
