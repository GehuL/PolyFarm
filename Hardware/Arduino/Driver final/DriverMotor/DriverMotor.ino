
// --- Déclarations Moteur ---
const int IN1 = 12;
const int IN2 = 13;
const int PWM1 = 3;
const int PWM2 = 11;
int delay_motor = 1;//1
bool end_bool = false;

int stepIndex = 0;
int maxIndex = 0;

bool direction = true;   // true = avant, false = arrière
typedef enum  {
  Idle,
  Right,
  Left,
  End 
}calibration;
calibration cal = Idle;

// --- Capteurs de fin de course ---
// Capteurs actifs à l'état BAS (0 V)
#define FC_GAUCHE_PIN 2     // Interruption INT0
#define FC_DROITE_PIN 4     // Interruption INT1

volatile bool fcGaucheActive = false;
volatile bool fcDroiteActive = false;

volatile unsigned long lastGaucheTime = 0;
volatile unsigned long lastDroiteTime = 0;
const unsigned long DEBOUNCE_US = 1000000;

// --- Routines d'interruptions ---
void ISR_fcGauche() {
  unsigned long now = micros();
  if (now - lastGaucheTime > DEBOUNCE_US) {
    fcGaucheActive = true;
    direction ^= 1;
    lastGaucheTime = now;
    cal = Right;
  }
  
}

void ISR_fcDroite() {
  unsigned long now = micros();
  if (now - lastDroiteTime > DEBOUNCE_US) {
    fcDroiteActive = true;
    direction ^= 1;
    lastDroiteTime = now;
    cal = Left;
  }
  
}

void setup() {
  Serial.begin(9600);
  
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(PWM1, OUTPUT);
  pinMode(PWM2, OUTPUT);

  // Capteurs : actifs BA S → repos HAUT → INPUT_PULLUP parfait
  pinMode(FC_GAUCHE_PIN, INPUT_PULLUP);
  pinMode(FC_DROITE_PIN, INPUT_PULLUP);

  // Interruptions PROPREMENT configurées
  attachInterrupt(digitalPinToInterrupt(FC_GAUCHE_PIN), ISR_fcGauche, RISING);
  attachInterrupt(digitalPinToInterrupt(FC_DROITE_PIN), ISR_fcDroite, RISING);
}
void checkDirection()
{
  if(fcGaucheActive)
  {
    direction = false;
    fcGaucheActive = false;
  }
  if(fcDroiteActive)
  {
    direction = true;
    fcDroiteActive = false;
  }
}

void Calibration() {
  Serial.println(cal);
   switch(cal){
    Idle: break;
    Right: maxIndex++; Serial.println(maxIndex); break;
    Left: cal = End; break;
    End : break;
    
  }
  
}

// --- Fonction pour un pas dans un sens ---
void stepMotor() {
  
  if (direction) {
    // Commande moteur pas à pas Bipolaire 4 fils en Mode Wave | Sens Normal
    // Pas n°1 | Sortie B- du Shield Moteur -> Bobine A du moteur pas à pas
    digitalWrite(12, HIGH);
    digitalWrite(13, LOW);  
    analogWrite(3, 0);
    analogWrite(11, 255);
    delay(delay_motor);
      
    // Pas n°2 | Sortie A- du Shield Moteur -> Bobine C du moteur pas à pas
    digitalWrite(12, LOW);
    digitalWrite(13, HIGH);   
    analogWrite(3, 255);
    analogWrite(11, 0);
    delay(delay_motor); 

    // Pas n°3 | Sortie B+ du Shield Moteur -> Bobine B du moteur pas à pas
    digitalWrite(12, LOW);
    digitalWrite(13, HIGH);  
    analogWrite(3, 0);
    analogWrite(11, 255);
    delay(delay_motor); 

    // Pas n°4 | Sortie A+ du Shield Moteur -> Bobine D du moteur pas à pas
    digitalWrite(12, HIGH);
    digitalWrite(13, LOW);   
    analogWrite(3, 255);
    analogWrite(11, 0);
    delay(delay_motor); 

  }
  else{
    digitalWrite(12, HIGH);
    digitalWrite(13, LOW);   
    analogWrite(3, 255);
    analogWrite(11, 0);
    delay(delay_motor); 

    // Pas n°2 | Sortie B+ du Shield Moteur -> Bobine B du moteur pas à pas
    digitalWrite(12, LOW);
    digitalWrite(13, HIGH);  
    analogWrite(3, 0);
    analogWrite(11, 255);
    delay(delay_motor); 
      
    // Pas n°3 | Sortie A- du Shield Moteur -> Bobine C du moteur pas à pas
    digitalWrite(12, LOW);
    digitalWrite(13, HIGH);   
    analogWrite(3, 255);
    analogWrite(11, 0);
    delay(delay_motor); 

    // Pas n°4 | Sortie B- du Shield Moteur -> Bobine A du moteur pas à pas
    digitalWrite(12, HIGH);
    digitalWrite(13, LOW);  
    analogWrite(3, 0);
    analogWrite(11, 255);
    delay(delay_motor);

  }
}

void loop() {
  //checkDirection();
  Calibration();
  // Avancer le moteur dans la direction active
  stepMotor();
}
