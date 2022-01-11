module.exports = function searchUsers () {
  return async function (env, event) {
    const { userInfo } = env.bootedServices
    const { filter, searchBy } = event

    const limit = 10
    const page = event.page || 1
    const offset = (page - 1) * limit

    let results = []
    let totalHits = 0

    try {
      if (typeof filter === 'string' && filter.length > 0) {
        if (searchBy === 'NAME') {
          const res = await userInfo.searchUsers({ query: filter, offset: offset / limit, limit })
          if (res) {
            results = res.users
            totalHits = res.total
          }
        } else if (searchBy === 'USER_ID') {
          const user = await userInfo.allFromUserId(filter)
          if (user) {
            results = [user]
            totalHits = 1
          }
        } else if (searchBy === 'EMAIL') {
          const userId = await userInfo.userIdFromEmail(filter)
          const user = await userInfo.allFromUserId(userId)
          if (user) {
            results = [user]
            totalHits = 1
          }
        }
      }
    } catch (err) {
      console.log('Error searching users:', err)
    }

    const totalPages = Math.ceil(totalHits / limit)

    return {
      page,
      totalPages,
      results: results.map(user => {
        user.launches = [{
          title: 'View user',
          stateMachineName: 'auth0_viewUser_1_0',
          input: { userId: user.user_id }
        }]
        return user
      }),
      totalHits
    }
  }
}
