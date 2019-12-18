module.exports = function () {
  return async function (event, env) {
    const { userId } = event
    const { caches, userInfo } = env.bootedServices

    event.rolesFromCache = caches.userMemberships.get(userId) || []

    const userRoles = await userInfo.rolesFromUserId(userId)
    event.rolesFromAuth0 = userRoles || []

    return event
  }
}
