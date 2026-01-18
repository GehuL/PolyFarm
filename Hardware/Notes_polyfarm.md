### Taille maquette :



Ext : 53.5 x 50.5



Int : 38 x 32







### Capteur d'humidité x4 :

 ┌--┐

 |  |

 |  |\_ 3.3V

 |  |\_ Signal \[ Analog ]

 |  |\_GND

 |  |

 └--┘



Vers carte / CAN



### Capteur de fin de courses x4 :



 ┌--┐

 |  |

 |  |\_ Signal \[ Digital ]

 |  |\_ 3.3V

 |  |\_GND

 |  |

 └--┘



Vers carte



### Moteur x2 :



 ┌--┐

 |  |

 |  |\_A+ (Noir)

 |  |\_A- (Vert)

 |  |\_B+ (Bleu)

 |  |\_B- (Rouge)

 |  |

 └--┘



 







IN1-4 = Signaux de contrôles PWM



### 

### Alim de pc :



Jaune : +12 V

Rouge : +5 V

Orange : +3,3 V

Blanc : -5 V

Bleu : -12 V











#### Câblage à partir d'alim



Motor shield :



Jaune x2 ==> Motor shield Vin x2 }}}| Connectique Carré 2x jaune + 2x masse

Masse x2 ==> Motor shield GND x2 }}}|



Carte Arduino uno :



Jaune x2 }}}| Alim carte uno x2 }}}| Vin et GND ou adaptation alim jack

Masse x2 }}}| Alim carte uno x2 }}}|



Pompe eau :





Sinon : 12V avec diviseur de tension pour 9V



Main Programme moteur : 

Besoins : 
    - Moteur qui bouge gauche & droite
    - détection fin de courses
    - Déplacement distance x, y 
    - Interpréter les trames UART

Actuellement : 

    - Moteur bouges OK 
    - Détection fin de courses OK 
    - Déplacement x,y en cours 
    - Interpréter UART en cours 


Variables : 
    - distance max count (step) 
    - fin de courses 
    - distances actuels (step)


Fonction initialisation : 

    - 