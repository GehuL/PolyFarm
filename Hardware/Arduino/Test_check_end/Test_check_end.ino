const int INPUT_PIN = 4;

void setup() {
  Serial.begin(9600);
  pinMode(INPUT_PIN, INPUT); // ou INPUT_PULLUP selon le câblage
}

void loop() {
  int state = digitalRead(INPUT_PIN);

  Serial.print("Pin 2 = ");
  if (state == HIGH) {
    Serial.println("HIGH (3.3V detecte)");
  } else {
    Serial.println("LOW (GND detecte)");
  }

  delay(100);
}
