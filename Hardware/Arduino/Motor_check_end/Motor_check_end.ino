// =====================
// === DECLARATIONS ===
// =====================

// --- Moteur ---
const int IN1  = 12;
const int IN2  = 13;
const int PWM1 = 5;   // PWM libre (corrigé)
const int PWM2 = 6;   // PWM libre (corrigé)

int stepIndex = 0;
int delayMotor = 1;

bool direction = true;   // true = vers gauche, false = vers droite

// --- Fins de course ---
// Pull-up interne : relâché = HIGH, appuyé = LOW
#define FC_GAUCHE_PIN 2   // INT0
#define FC_DROITE_PIN 3   // INT1

volatile bool fcGaucheActive = false;
volatile bool fcDroiteActive = false;

// --- Anti-rebond ISR ---
volatile unsigned long lastGaucheTime = 0;
volatile unsigned long lastDroiteTime = 0;
const unsigned long DEBOUNCE_US = 20000; // 20 ms

// =====================
// === INTERRUPTIONS ===
// =====================

void ISR_fcGauche() {
  unsigned long now = micros();
  if (now - lastGaucheTime > DEBOUNCE_US) {
    fcGaucheActive = true;
    lastGaucheTime = now;
  }
}

void ISR_fcDroite() {
  unsigned long now = micros();
  if (now - lastDroiteTime > DEBOUNCE_US) {
    fcDroiteActive = true;
    lastDroiteTime = now;
  }
}

// =====================
// === SETUP ===
// =====================

void setup() {
  Serial.begin(9600);

  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(PWM1, OUTPUT);
  pinMode(PWM2, OUTPUT);

  // Pull-up internes activés
  pinMode(FC_GAUCHE_PIN, INPUT_PULLUP);
  pinMode(FC_DROITE_PIN, INPUT_PULLUP);

  // Interruptions sur appui (front descendant)
  attachInterrupt(digitalPinToInterrupt(FC_GAUCHE_PIN), ISR_fcGauche, FALLING);
  attachInterrupt(digitalPinToInterrupt(FC_DROITE_PIN), ISR_fcDroite, FALLING);
}

// =====================
// === MOTEUR ===
// =====================

void stepMotor(bool forward) {
  if (forward) {
    switch (stepIndex) {
      case 0:
        digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
        analogWrite(PWM1, 0);    analogWrite(PWM2, 255);
        break;
      case 1:
        digitalWrite(IN1, LOW);  digitalWrite(IN2, HIGH);
        analogWrite(PWM1, 255);  analogWrite(PWM2, 0);
        break;
      case 2:
        digitalWrite(IN1, LOW);  digitalWrite(IN2, HIGH);
        analogWrite(PWM1, 0);    analogWrite(PWM2, 255);
        break;
      case 3:
        digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
        analogWrite(PWM1, 255);  analogWrite(PWM2, 0);
        break;
    }
  } else {
    switch (stepIndex) {
      case 0:
        digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
        analogWrite(PWM1, 255);  analogWrite(PWM2, 0);
        break;
      case 1:
        digitalWrite(IN1, LOW);  digitalWrite(IN2, HIGH);
        analogWrite(PWM1, 0);    analogWrite(PWM2, 255);
        break;
      case 2:
        digitalWrite(IN1, LOW);  digitalWrite(IN2, HIGH);
        analogWrite(PWM1, 255);  analogWrite(PWM2, 0);
        break;
      case 3:
        digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
        analogWrite(PWM1, 0);    analogWrite(PWM2, 255);
        break;
    }
  }

  stepIndex = (stepIndex + 1) % 4;
  delay(delayMotor);
}

// =====================
// === LOOP ===
// =====================

void loop() {

  // --- Butée gauche ---
  if (fcGaucheActive) {
    Serial.println("Butée gauche atteinte");           // temporisation sécurité
    fcGaucheActive = false;
    direction = false;
  }

  // --- Butée droite ---
  if (fcDroiteActive) {
    Serial.println("Butée droite atteinte");
    fcDroiteActive = false;
    direction = true;
  }

  // Avancer le moteur
  stepMotor(direction);
}
