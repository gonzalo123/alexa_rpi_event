const NoIntentHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.intent &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent'
  },
  handle (handlerInput) {
    const attributesManager = handlerInput.attributesManager

    return handlerInput.responseBuilder.
      speak('Alright. Good bye!').
      withShouldEndSession(true).
      getResponse()
  }
}

module.exports = NoIntentHandler

