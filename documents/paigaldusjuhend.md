•	Rakendus lokaalse (arendamise) keskonna jaoks
Eeldused:
1.	installitud on postgresql, mille leiab https://www.postgresql.org/
2.	installitud on git
3.	installitud on npm, mille leiab https://www.npmjs.com/package/npm
postgresql: Loo andmebaas askendapi (script asub backend/src/main/resources/db/db-create/create-database.sql). Tabelid ja algandmed luuakse liquibase-i poolt rakenduse käivitamisel.
rakendus Lae alla GitHubis olev rakenduse lähtekood: git clone https://github.com/DigiVikings/ASKEND_PROOVITOO.git
backend
backendi kasutamiseks terminalis gradlew bootRun
frontend
Mine kataloogi frontend
installi vajalikud moodulid: npm install --legacy-peer-deps (--legacy-peer-deps vajalik, kuna material kasutab moment js librarit)
stardi angulari klient: ng serve
Veebilehitsejas ava http://localhost:4200 (NB! Rakendus töötab http-ga, sobilik on Chrome Incognito)
Rakendus on valmis kasutamiseks.

