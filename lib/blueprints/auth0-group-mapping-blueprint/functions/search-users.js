module.exports = function searchUsers () {
  return async function (env, event) {
    const { userInfo } = env.bootedServices
    const { query } = event

    const limit = 10
    const page = event.page || 1
    const offset = (page - 1) * limit

    let results = []
    let totalHits = 0

    try {
      const res = await userInfo.searchUsers({ query, offset: offset / limit, limit })

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
      console.log('Error searching users:', err)
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
