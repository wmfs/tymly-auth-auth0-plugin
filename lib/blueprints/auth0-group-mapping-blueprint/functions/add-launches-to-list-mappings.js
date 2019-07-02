module.exports = function () {
  return async function (event) {
    event.mappings = event.mappings.map(x => {
      const launches = [{
        stateMachineName: 'auth0_removeMappingForm_1_0',
        title: 'Remove Mapping',
        input: {
          auth0: x.auth0,
          roleId: x.roles[0]
        }
      }]
      return { ...x, launches }
    })

    return event
  }
}
