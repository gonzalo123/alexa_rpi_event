const log = require('../lib/log')
const utils = require('../lib/utils')

const LaunchRequestHandler = {
  canHandle (handlerInput) {
    console.log('canHandle YesIntentHandler?')
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },

  async handle (handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    const endpointId = utils.getEndpointIdFromSession(handlerInput)
    const error = requestAttributes.t('NO_GADGETS_FOUND')
    const cardTitle = requestAttributes.t('SKILL_NAME')

    if (!endpointId) {
      log.error('endpoint', error)
      return handlerInput.responseBuilder.
        speak(error).
        getResponse()
    }

    return handlerInput.responseBuilder.
      speak(requestAttributes.t('GREETING_MESSAGE')).
      withShouldEndSession(false).
      withSimpleCard(cardTitle, requestAttributes.t('GREETING_MESSAGE_SCREEN')).
      getResponse()
  }
}

module.exports = LaunchRequestHandler

