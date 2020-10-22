module.exports = function () {
  return async function (event) {
    event.mappings = event.mappings.map(x => {
      const launches = x.roles.length > 0
        ? x.roles.map(roleId => {
            return {
              stateMachineName: 'auth0_removeMappingForm_1_0',
              title: `Remove ${roleId} mapping`,
              input: {
                auth0: x.auth0,
                roleId: roleId
              }
            }
          })
        : []
      return { ...x, launches }
    })

    return event
  }
}
