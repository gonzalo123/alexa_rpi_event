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
