module.exports = function () {
  return async function (env, event) {
    const { offset, limit, query } = event

    event.searchResults = {
      results: [],
      totalHits: 0
    }

    try {
      const res = await env.bootedServices.userInfo.searchUsers({ query, offset: offset / limit, limit })

      if (res) {
        res.users = res.users.map(user => {
          user.launches = [{
            title: 'View user',
            stateMachineName: 'auth0_viewUser_1_0',
            input: { userId: user.user_id }
          }]
          return user
        })

        event.searchResults.results = res.users
        event.searchResults.totalHits = res.total
      }
    } catch (err) {
      console.log('Error searching users:', err)
    }

    return event
  }
}
