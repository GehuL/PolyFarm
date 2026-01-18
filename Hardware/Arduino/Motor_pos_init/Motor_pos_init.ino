void setup() {
  pinMode(3, OUTPUT); // Déclaration de la broche n°3 en sortie Digitale PWM
  pinMode(11, OUTPUT); // Déclaration de la broche n°11 en sortie Digitale PWM
  pinMode(12, OUTPUT); // Déclaration de la broche n°12 en sortie Digitale
  pinMode(13, OUTPUT); // Déclaration de la broche n°13 en sortie Digitale


  //serial.begin(9600);
}
 int delay_motor = 1;
  int count = 0;
  bool end_left = false;
  bool end_right = false;




void go_limit_right()
{
  while (end_right ==false){
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

void go_limit_left()
{
  while (end_left ==false){
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
}
void loop(){
  /*if (end ==0){
    delay(200);
  }
    end = end + 1;
  //serial.println(end);
  }
  end = 0;
  //Serial.println(end);*/
  go_limit_right();

}