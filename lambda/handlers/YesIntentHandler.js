const utils = require('../lib/utils')
const Uuid = require('uuid/v4')

const YesIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.intent &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent'
  },
  handle (handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()
    sessionAttributes.token = Uuid()

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes)

    return handlerInput.responseBuilder.addDirective(utils.buildStartEventHandlerDirective(
      sessionAttributes.token,
      10000,
      'Custom.gonzalo123', 'sensor', 'SEND_AND_TERMINATE',
      { 'data': 'Good bye!' })).
      getResponse()
  }
}

module.exports = YesIntentHandler

