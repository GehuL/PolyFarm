// =======================
// === CONFIG MOTEUR ====
// =======================
const int IN1  = 12;
const int IN2  = 13;
const int PWM1 = 3;
const int PWM2 = 11;

int delay_motor = 1;

// =======================
// === FINS DE COURSE ====
// =======================
#define FC_GAUCHE_PIN 2
#define FC_DROITE_PIN 4

bool fcGaucheState = false;
bool fcDroiteState = false;
bool fcGauchePrev  = false;
bool fcDroitePrev  = false;

unsigned long lastGaucheTime = 0;
unsigned long lastDroiteTime = 0;
const unsigned long DEBOUNCE_MS = 20;

// =======================
// === ETAT MOTEUR =======
// =======================
bool direction = true; // true = droite, false = gauche

long current_step = 0;
long max_step     = 0;

// =======================
// === CALIBRATION =======
// =======================
enum CalibState {
  CALIB_GO_RIGHT,
  CALIB_GO_LEFT_COUNT,
  CALIB_DONE
};

CalibState calibState = CALIB_GO_RIGHT;

// =======================
// === SETUP =============
// =======================
void setup() {
  Serial.begin(9600);

  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(PWM1, OUTPUT);
  pinMode(PWM2, OUTPUT);

  pinMode(FC_GAUCHE_PIN, INPUT_PULLUP);
  pinMode(FC_DROITE_PIN, INPUT_PULLUP);

  Serial.println("Starting calibration...");
}

// =======================
// === STOP MOTEUR =======
// =======================
void stopMotor() {
  // Frein actif
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, HIGH);
  analogWrite(PWM1, 255);
  analogWrite(PWM2, 255);
  delay(50);

  // Coupure
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  analogWrite(PWM1, 0);
  analogWrite(PWM2, 0);
}

// =======================
// === POLLING FC ========
// =======================
void pollEndStops() {
  unsigned long now = millis();

  fcGaucheState = (digitalRead(FC_GAUCHE_PIN) == HIGH);
  fcDroiteState = (digitalRead(FC_DROITE_PIN) == HIGH);

  // Fin de course droite
  if (fcDroiteState && !fcDroitePrev && (now - lastDroiteTime > DEBOUNCE_MS)) {
    lastDroiteTime = now;

    if (calibState == CALIB_GO_RIGHT) {
      stopMotor();
      direction = false;
      calibState = CALIB_GO_LEFT_COUNT;
      current_step = 0;
      Serial.println("Right endstop reached, counting steps...");
    }
  }

  // Fin de course gauche
  if (fcGaucheState && !fcGauchePrev && (now - lastGaucheTime > DEBOUNCE_MS)) {
    lastGaucheTime = now;

    if (calibState == CALIB_GO_LEFT_COUNT) {
      stopMotor();
      max_step = current_step;
      current_step = 0;
      calibState = CALIB_DONE;

      Serial.print("Calibration done, max_step = ");
      Serial.println(max_step);
    }
  }

  fcGauchePrev = fcGaucheState;
  fcDroitePrev = fcDroiteState;
}

// =======================
// === STEP MOTEUR =======
// =======================
void stepMotor() {

  if (direction) {
    digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
    analogWrite(PWM1, 0); analogWrite(PWM2, 255);
    delay(delay_motor);

    digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
    analogWrite(PWM1, 255); analogWrite(PWM2, 0);
    delay(delay_motor);

    digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
    analogWrite(PWM1, 0); analogWrite(PWM2, 255);
    delay(delay_motor);

    digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
    analogWrite(PWM1, 255); analogWrite(PWM2, 0);
    delay(delay_motor);

    current_step++;

  } else {
    digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
    analogWrite(PWM1, 255); analogWrite(PWM2, 0);
    delay(delay_motor);

    digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
    analogWrite(PWM1, 0); analogWrite(PWM2, 255);
    delay(delay_motor);

    digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
    analogWrite(PWM1, 255); analogWrite(PWM2, 0);
    delay(delay_motor);

    digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
    analogWrite(PWM1, 0); analogWrite(PWM2, 255);
    delay(delay_motor);

    current_step--;
  }
}

// =======================
// === MOVE TO % =========
// =======================
void moveToPercentage(int percent) {
  long target_step = (max_step * percent) / 100;

  Serial.print("Moving to ");
  Serial.print(percent);
  Serial.print("% -> step ");
  Serial.println(target_step);

  if (target_step > current_step) {
    direction = true;
    while (current_step < target_step) {
      pollEndStops();
      stepMotor();
    }
  } else if (target_step < current_step) {
    direction = false;
    while (current_step > target_step) {
      pollEndStops();
      stepMotor();
    }
  }

  stopMotor();
  Serial.println("Target reached");
}

// =======================
// === SERIAL CMD ========
// =======================
void handleSerialCommand() {
  if (!Serial.available()) return;

  String input = Serial.readStringUntil('\n');
  input.trim();
  if (input.length() == 0) return;

  int value = input.toInt();

  if (value < 0 || value > 100) {
    Serial.print("Invalid value: ");
    Serial.println(input);
    return;
  }

  if (calibState != CALIB_DONE) {
    Serial.println("Calibration not finished, command ignored");
    return;
  }

  moveToPercentage(value);
}

// =======================
// === LOOP ==============
// =======================
void loop() {
  pollEndStops();

  if (calibState == CALIB_DONE) {
    handleSerialCommand();
    moveToPercentage(25);
    delay(5000);
    moveToPercentage(50);
    delay(5000);
    moveToPercentage(75);
    delay(5000);
  } else {
    stepMotor(); // calibration en cours
  }
}
