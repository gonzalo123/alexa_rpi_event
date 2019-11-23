const CustomInterfaceEventHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'CustomInterfaceController.Expired'
  },
  handle (handlerInput) {
    let { request } = handlerInput.requestEnvelope

    return handlerInput.responseBuilder.
      withShouldEndSession(true).
      speak(request.expirationPayload.data).
      getResponse()
  }
}

module.exports = CustomInterfaceEventHandler
