module.exports = function searchUsers () {
  return async function (env, event) {
    const logger = env.bootedServices.logger.child('function:auth0_searchUsers')

    const { userInfo } = env.bootedServices
    const { name, connection } = event

    const limit = 10
    const page = event.page || 1
    const offset = (page - 1) * limit

    let results = []
    let totalHits = 0

    try {
      const query = []

      if (typeof name === 'string' && name.trim().length > 0) {
        query.push(`name:*${name}*`)
      }

      if (typeof connection === 'string' && connection.trim().length > 0) {
        query.push(`identities.connection:${connection}`)
      }

      const res = await userInfo.searchUsers({
        query: query.join(' AND '),
        offset: offset / limit,
        limit
      })

      if (res) {
        results = res.users.map(user => {
          user.launches = [{
            title: 'View user',
            stateMachineName: 'auth0_viewUser_1_0',
            input: { userId: user.user_id }
          }]
          return user
        })
        totalHits = res.total
      }
    } catch (err) {
      logger.warn('Error searching users:', err)
    }

    const totalPages = Math.ceil(totalHits / limit)

    return {
      page,
      totalPages,
      results,
      totalHits
    }
  }
}
