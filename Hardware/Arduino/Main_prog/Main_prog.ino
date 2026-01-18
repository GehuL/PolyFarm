// --- Déclarations Moteur ---
const int IN1 = 12;
const int IN2 = 13;
const int PWM1 = 3;
const int PWM2 = 11;

int delay_motor = 1;

// --- Sens moteur ---
bool direction = true;   // true = droite, false = gauche

// --- Capteurs de fin de course (actifs à HIGH = 3V3) ---
#define FC_GAUCHE_PIN 2
#define FC_DROITE_PIN 4

// --- Polling / debounce ---
bool fcGaucheState = false;
bool fcDroiteState = false;
bool fcGauchePrev  = false;
bool fcDroitePrev  = false;

unsigned long lastGaucheTime = 0;
unsigned long lastDroiteTime = 0;
const unsigned long DEBOUNCE_MS = 20;

// --- Position / calibration ---
long currentStep = 0;
long maxStep = 0;

// --- États de calibration ---
enum CalibState {
  CALIB_IDLE,
  CALIB_TO_RIGHT,
  CALIB_COUNT_TO_LEFT,
  CALIB_DONE
};

CalibState calibState = CALIB_IDLE;

// ----------------------------------------------------
// SETUP
// ----------------------------------------------------
void setup() {
  Serial.begin(9600);

  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(PWM1, OUTPUT);
  pinMode(PWM2, OUTPUT);

  pinMode(FC_GAUCHE_PIN, INPUT_PULLUP);
  pinMode(FC_DROITE_PIN, INPUT_PULLUP);

  // Démarrage calibration automatique
  startCalibration();
}

// ----------------------------------------------------
// CALIBRATION
// ----------------------------------------------------
void startCalibration() {
  Serial.println("Calibration start");
  calibState = CALIB_TO_RIGHT;
  direction = true; // aller vers la droite
  currentStep = 0;
}

// ----------------------------------------------------
// POLLING DES FINS DE COURSE
// ----------------------------------------------------
void pollEndStops() {
  unsigned long now = millis();

  fcGaucheState = (digitalRead(FC_GAUCHE_PIN) == HIGH);
  fcDroiteState = (digitalRead(FC_DROITE_PIN) == HIGH);

  // Détection front gauche
  if (fcGaucheState && !fcGauchePrev && (now - lastGaucheTime > DEBOUNCE_MS)) {
    lastGaucheTime = now;

    if (calibState == CALIB_COUNT_TO_LEFT) {
      stopMotor();
      maxStep = currentStep;
      calibState = CALIB_DONE;
      Serial.print("Calibration done. maxStep = ");
      Serial.println(maxStep);
    }

    if (calibState != CALIB_COUNT_TO_LEFT) {
      direction = true;
    }
  }

  // Détection front droite
  if (fcDroiteState && !fcDroitePrev && (now - lastDroiteTime > DEBOUNCE_MS)) {
    lastDroiteTime = now;

    if (calibState == CALIB_TO_RIGHT) {
      stopMotor();
      currentStep = 0;
      calibState = CALIB_COUNT_TO_LEFT;
      direction = false;
      Serial.println("Reached right limit, start counting to left");
    }

    if (calibState != CALIB_TO_RIGHT) {
      direction = false;
    }
  }

  fcGauchePrev = fcGaucheState;
  fcDroitePrev = fcDroiteState;
}

// ----------------------------------------------------
// STOP MOTEUR : frein actif puis coupure
// ----------------------------------------------------
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

// ----------------------------------------------------
// STEP MOTEUR
// ----------------------------------------------------
void stepMotor() {

  if (direction) {
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    analogWrite(PWM1, 0);
    analogWrite(PWM2, 255);
    delay(delay_motor);

    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    analogWrite(PWM1, 255);
    analogWrite(PWM2, 0);
    delay(delay_motor);

    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    analogWrite(PWM1, 0);
    analogWrite(PWM2, 255);
    delay(delay_motor);

    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    analogWrite(PWM1, 255);
    analogWrite(PWM2, 0);
    delay(delay_motor);

  } else {

    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    analogWrite(PWM1, 255);
    analogWrite(PWM2, 0);
    delay(delay_motor);

    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    analogWrite(PWM1, 0);
    analogWrite(PWM2, 255);
    delay(delay_motor);

    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    analogWrite(PWM1, 255);
    analogWrite(PWM2, 0);
    delay(delay_motor);

    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    analogWrite(PWM1, 0);
    analogWrite(PWM2, 255);
    delay(delay_motor);
  }

  // Comptage UNIQUEMENT pendant la phase 2 de calibration
  if (calibState == CALIB_COUNT_TO_LEFT) {
    currentStep++;
  }
}

// ----------------------------------------------------
// DEPLACEMENT PAR POURCENTAGE
// ----------------------------------------------------
void moveToPercentage(int percentage) {
  // Ne rien faire si calibration en cours
  if (calibState != CALIB_DONE) {
    Serial.println("Cannot move, calibration not finished");
    return;
  }

  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;

  long targetStep = (percentage * maxStep) / 100;

  // Déterminer direction
  if (targetStep > currentStep) {
    direction = true;  // vers la droite
  } else if (targetStep < currentStep) {
    direction = false; // vers la gauche
  } else {
    // Déjà à la position
    stopMotor();
    return;
  }

  // Boucle jusqu'à atteindre targetStep
  while (currentStep != targetStep) {
    stepMotor();
  }

  // Stop moteur à l'arrivée
  stopMotor();
  Serial.print("Moved to ");
  Serial.print(percentage);
  Serial.println("%");
}

// ----------------------------------------------------
// LOOP PRINCIPALE
// ----------------------------------------------------
void loop() {
  pollEndStops();

  if (calibState == CALIB_DONE) {
    // Exemple de test : déplacer à 25%, 50%, 75% toutes les 5 secondes
    moveToPercentage(25);
    delay(5000);
    moveToPercentage(50);
    delay(5000);
    moveToPercentage(75);
    delay(5000);
  } else {
    // Pendant la calibration, avancer le moteur
    stepMotor();
  }
}
