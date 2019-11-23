const utils = require('../lib/utils')

const GadgetInterceptor = {
  async process (handlerInput) {
    const endpointId = await utils.getEndpointIdFromConnectedEndpoints(handlerInput)
    if (endpointId) {
      utils.appendToSession(handlerInput, 'endpointId', endpointId)
    }
  }
}

module.exports = GadgetInterceptor
