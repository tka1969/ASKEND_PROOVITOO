# Proovitöö

Proovitöö koosneb kahest peamisest komponendist - backend ja frontend.

Backend rakendus on kirjutatud Java keeles kasutades Spring Boot raamistikku.
Backend rakendus pärib andmed andmebaasist, töötleb neid ja teeb need vajalikul kujul kättesaadavakse REST APIna.
 
[Backend detailid](backend/README.md)

Frontend rakendus on kirjutatud Angular raamistikus.
Frontend komponent kuvab andmeid kasutajatele ja võimaldab neid lisada või värskendada.

[Frontend detailid](frontend/README.md)


## Proovitöö lahenduse kävitamine


## Muu info

Juhul kui pordid (4200, 8080) on juba kasutuses, siis saab neid muuta docker-compose.yaml failis.
Muudatuste tegemiseks tuleb fail avada tekstiredaktoris ja muuta vastava teenuse ports kirjeid.
Näiteks frontend teenuse pordi muutmiseks 4201'ks muuta:

```
 ports:     
      - 4200:80
      
 muuta --->
 
  ports:     
      - 4201:80
```

Lahendus on testidud Windows 11

