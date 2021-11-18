module.exports = function () {
  return async function (event, env) {
    const { userId } = event
    const { caches } = env.bootedServices
    caches.userMemberships.del(userId)
    caches.rolesFromUserId.del(userId)

    return event
  }
}
