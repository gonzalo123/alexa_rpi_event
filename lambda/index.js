'use strict'

const Alexa = require('ask-sdk-core')

const RequestInterceptor = require('./interceptors/RequestInterceptor')
const ResponseInterceptor = require('./interceptors/ResponseInterceptor')
const LocalizationInterceptor = require('./interceptors/LocalizationInterceptor')
const GadgetInterceptor = require('./interceptors/GadgetInterceptor')

const YesIntentHandler = require('./handlers/YesIntentHandler')
const NoIntentHandler = require('./handlers/NoIntentHandler')
const LaunchRequestHandler = require('./handlers/LaunchRequestHandler')
const CancelAndStopIntentHandler = require('./handlers/CancelAndStopIntentHandler')
const SessionEndedRequestHandler = require('./handlers/SessionEndedRequestHandler')
const CustomInterfaceEventHandler = require('./handlers/CustomInterfaceEventHandler')
const CustomInterfaceExpirationHandler = require('./handlers/CustomInterfaceExpirationHandler')

const FallbackHandler = require('./handlers/FallbackHandler')
const ErrorHandler = require('./handlers/ErrorHandler')

let skill
exports.handler = function (event, context) {
  if (!skill) {
    skill = Alexa.SkillBuilders.custom().
      addRequestHandlers(
        LaunchRequestHandler,
        YesIntentHandler,
        NoIntentHandler,
        CustomInterfaceEventHandler,
        CustomInterfaceExpirationHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        FallbackHandler).
      addRequestInterceptors(
        RequestInterceptor,
        ResponseInterceptor,
        LocalizationInterceptor,
        GadgetInterceptor).
      addErrorHandlers(ErrorHandler).create()
  }
  return skill.invoke(event, context)
}
