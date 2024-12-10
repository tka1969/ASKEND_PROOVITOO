## Backend lahendus

Backend lahendus on lahendus, mis teostab erinevaid päringuid andmebaasi ning töötleb saadud andmeid ja saadab need API otspunktile päringu teinud rakendusele.


### Lahenduse seadistused

Lahenduse peamised seadistused on konfigureeritud application.properties failis. Seal on võimalik muuta andmebaasi seadistusi.
Fail asub src/main/resources kaustas.


### Konteineri info

Backend lahendusega on kaasas Dockerfile, mis loob konteineri, kus lahendus esmalt valmis kompileeritakse ning 
ning peale seda see käivitatakse. Lahenduse kompileerimiseks kasutatakse gradle lahendust.
Konteiner põhineb eclipse-temurin tõmmisel, mis sisaldab java versiooni 21 ja gradle't lahenduse kompileerimiseks.

Dockerfile sees on ka täiendavad kommentarid selle sisu kohta
