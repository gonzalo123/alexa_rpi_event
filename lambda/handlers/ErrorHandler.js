const log = require('../lib/log')

const ErrorHandler = {
  canHandle () {
    return true
  },
  handle (handlerInput, error) {
    log.error('ERROR HANDLED', {error: error})
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()

    return handlerInput.responseBuilder.
      speak(requestAttributes.t('ERROR')).
      getResponse()
  }
}

module.exports = ErrorHandler
