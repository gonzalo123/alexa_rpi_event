## Alexa and Raspberry Pi demo (Part 2). Listening to external events

Today I want to keep on with the previous example. This time I want to create one Alexa skill that listen to external events. The example that I've build is the following one: 

I've got one ESP32 with a proximity sensor (one HC-SR04) that is sending the distance captured each 500ms to a MQTT broker (a mosquitto server).

I say "Alexa, use event demo" then Alexa tell me to put my hand close to the sensor and it will tell me the distance.

That's the ESP32 code
```c
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "MY_SSID";
const char* password = "MY_PASSWORD";
const char* server = "mqtt.server.ip";
const char* topic = "/alert";
const char* clientName = "com.gonzalo123.esp32";

WiFiClient wifiClient;
PubSubClient client(wifiClient);

int trigPin = 13;
int echoPin = 12;
int alert = 0;
int alertThreshold = 100;
long duration, distance_cm;

void wifiConnect() {
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print("*");
  }

  Serial.print("WiFi connected: ");
  Serial.println(WiFi.localIP());
}

void mqttReConnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(clientName)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void mqttEmit(String topic, String value)
{
  client.publish((char*) topic.c_str(), (char*) value.c_str());
}

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  wifiConnect();
  client.setServer(server, 1883);

  delay(1500);
}

void loop() {
  if (!client.connected()) {
    mqttReConnect();
  }

  client.loop();

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH) / 2;
  distance_cm = duration / 29;

  if (distance_cm <= alertThreshold && alert == 0) {
      alert = 1;
      Serial.println("Alert!");
      mqttEmit("/alert", (String) distance_cm);
  } else if(distance_cm > alertThreshold && alert == 1) {
    alert = 0;
    Serial.println("No alert");
  }

  Serial.print("Distance: ");
  Serial.print(distance_cm);
  Serial.println(" cm ");

  delay(500);
}
```

And this is my alexa skill:

```javascript
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
```
The process is similar to the previous example. There's a GadgetInterceptor to find the endpointId of my Raspberry Pi. But now the Raspberry Pi must emmit to the event to the skill, not the skill to the event. 



[![Alexa device demo](https://img.youtube.com/vi/5DPtZTILHR8/0.jpg)](https://www.youtube.com/watch?v=5DPtZTILHR8)

