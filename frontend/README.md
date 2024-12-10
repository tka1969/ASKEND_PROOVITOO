## Frontend lahendus

Frontend lahendus on kirjutatud Angular raamistikus. 
Kujunduses kasutatakse Angular-Material komponente.
Frontend komponent kuvab andmeid kasutajatele ja võimaldab neid lisada ja muuta.

## Konteineri info

Frontend lahendusega on kaasas Dockerfile, mis loob konteineri,
milles lahenduse kasutajaliidest serveeritakse. Konteiner põhineb nginx tõmmisel,
mis on konfigureeritud serveerima frontend lahendust kasutades porti 80. Webiserveri konfiguratsiooni
fail asub frontent juurkataloogis ja kannab nime nginx.conf. See fail kopeeritakse loodud konteinerisse ja 
webiserveri konfiguratsiooni muutmiseks tuleb antud faili muuta ja konteiner uuesti luua.

Dockerfile sees on ka täiendavad kommentarid selle sisu kohta
