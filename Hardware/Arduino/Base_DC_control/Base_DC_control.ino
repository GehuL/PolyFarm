void setup() {
  pinMode(3, OUTPUT); // Déclaration de la broche n°3 en sortie Digitale PWM
  pinMode(11, OUTPUT); // Déclaration de la broche n°11 en sortie Digitale PWM
  pinMode(12, OUTPUT); // Déclaration de la broche n°12 en sortie Digitale
  pinMode(13, OUTPUT); // Déclaration de la broche n°13 en sortie Digitale


  Serial.begin(9600);
}
 int delay_motor = 1;
  int end = 0;
  bool end_bool = false;

void loop(){
  if (end ==0){
    delay(200);
  }
  while (end < 100) {

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

    end = end+1;
    Serial.println(end);
  }
  if (end ==100){
    delay(200);
  }
  while (end >= 100 && end <200) {
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

    end = end + 1;
    Serial.println(end);
  }
  end = 0;
  Serial.println(end);

}