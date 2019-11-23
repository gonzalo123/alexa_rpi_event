const FallbackHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
  },
  handle (handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    const speechOutput = requestAttributes.t('FALLBACK')

    return handlerInput.responseBuilder.
      speak(speechOutput).
      withSimpleCard(requestAttributes.t('SKILL_NAME'), speechOutput).
      getResponse()
  }
}

module.exports = FallbackHandler
