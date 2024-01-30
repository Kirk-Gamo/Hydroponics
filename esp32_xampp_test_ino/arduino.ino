#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>

#define READY D2

const char* ssid = "Hydroponics";
const char* password = "SmartFarming@2024";

WebSocketsServer webSocket = WebSocketsServer(81);

void setup() {
  pinMode(READY, OUTPUT);

  Serial.begin(115200);
  delay(10);


  WiFi.softAP(ssid, password);

  Serial.print("WiFi started. IP Address: ");
  Serial.println(WiFi.softAPIP());

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();

  if (Serial.available() > 0) {
    String message = Serial.readStringUntil('\n');

    webSocket.broadcastTXT(message.c_str(), message.length());
  }
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      {
        Serial.printf("[%u] Disconnected!\n", num);
        digitalWrite(READY, LOW);

      }

      break;


    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connected from %d.%d.%d.%d\n", num, ip[0], ip[1], ip[2], ip[3]);

        digitalWrite(READY, HIGH);

      }
      break;

    case WStype_TEXT:
      {
        Serial.printf("[%u] Received text: %s\n", num, payload);

        // Send the received message to all connected clients
        webSocket.broadcastTXT(payload, length);
      }
      break;
  }
}