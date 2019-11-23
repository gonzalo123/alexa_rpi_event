const CustomInterfaceEventHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'CustomInterfaceController.EventsReceived'
  },
  async handle (handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    const cardTitle = requestAttributes.t('SKILL_NAME')
    console.log('CustomInterfaceEventHandler:handle 2');
    let { request } = handlerInput.requestEnvelope

    const attributesManager = handlerInput.attributesManager
    let sessionAttributes = attributesManager.getSessionAttributes()

    if (sessionAttributes.token !== request.token) {
      return handlerInput.responseBuilder.speak('EventHandler token doesn\'t match. Ignoring this event.').getResponse()
    }

    let customEvent = request.events[0]
    let payload = customEvent.payload
    let namespace = customEvent.header.namespace
    let name = customEvent.header.name

    let response = handlerInput.responseBuilder

    if (namespace === 'Custom.gonzalo123' && name === 'sensor') {
      return response.
        speak('The distance to the sensor is' + payload.cm + ' centimeters. Good bye!').
        withShouldEndSession(true).
        withSimpleCard(cardTitle, requestAttributes.t(payload.cm + ' centimeters')).
        getResponse()
    }
    return response
  }
}

module.exports = CustomInterfaceEventHandler
