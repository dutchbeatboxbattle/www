# Dutch Beatbox Battle — tweetalige website

Deze versie is gebaseerd op `Archive 2.zip`. De bestaande vormgeving en aangeleverde inhoud zijn behouden. Projectlinks zijn bewerkbaar, projectafbeeldingen kunnen worden geüpload en de gehele publieke pagina wisselt tussen Nederlands en Engels.

## Laatste visuele wijzigingen

- Onder de video bij Previous Editions staan alleen de titel en beschrijving; het editielabel en beide videotellers zijn verwijderd. De navigatiepijlen en stippen blijven beschikbaar.
- Het Finished-stempel gebruikt dezelfde omlijnde, gekantelde stijl als Geannuleerd, met gele tekst en rand. Het voorbeeld in het beheermenu sluit daarop aan.

## Analyse van de bijlage

- De bewerkmodus had al een projectlinkveld. Dit is behouden, expliciet benoemd en voorzien van validatie tegen ongeldige of uitvoerbare URL’s.
- Het upload-endpoint schreef naar Netlify Blobs en gaf een `/api/images/…`-adres terug, maar die afbeeldingsroute ontbrak. Het beheer bood nog geen werkende uploadknop.
- Engelse velden en een taalcontext waren deels aanwezig, maar de provider, vlagknop, publieke teksten en beheerinvoer waren niet met elkaar verbonden.
- De serverroutes en dynamische pagina’s konden niet rechtstreeks op GitHub Pages draaien. Deze oplevering gebruikt daarom statische pagina’s met GitHub als blijvende opslag voor inhoud en afbeeldingen. Dat betekent ook de overstap van het oude wachtwoord naar een GitHub-token in het beheermenu.

## Lokaal bekijken

Gebruik Node.js 22 of nieuwer:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Het beheer staat op `/admin/`; de oude route `/admin/esh/` werkt ook. Voor een productievoorbeeld: `npm run build` en `npm run preview`.

De lokale website toont `src/data/cms-store.json`. Aanpassingen via het beheermenu worden naar de geselecteerde GitHub-repository geschreven, **ook wanneer je het beheermenu lokaal opent**. Ze wijzigen niet automatisch de bestanden op je computer. Gebruik een testrepository of testbranch tijdens ontwikkeling. Haal daarna de gewijzigde bestanden met Git binnen om ze lokaal te zien, of bewerk het JSON-bestand rechtstreeks voor uitsluitend lokale wijzigingen.

## Beheer instellen

1. Zet de inhoud van dit project in de hoofdmap van de bedoelde GitHub-repository. Behoud bestaande Git-instellingen, domeinconfiguratie en andere benodigde bestanden. Verwijder de vervangen routes `src/app/api/`, `src/app/admin/[slug]/`, `src/lib/auth.ts` en `src/lib/cms-storage.ts`; deze serverroutes zijn niet geschikt voor GitHub Pages. De experimentele Netlify-opslag wordt in deze versie niet gebruikt.
2. Maak in GitHub een **fine-grained personal access token** met uitsluitend deze repository geselecteerd en repository permission **Contents: Read and write**. Kies een passende vervaldatum. Een beschermde branch kan directe commits weigeren; gebruik dan een toegestane branch en je gebruikelijke reviewproces.
3. Open `/admin/`, vul `eigenaar/repository`, de branch en het token in. Het beheer haalt de actuele inhoud uit GitHub op. Het oude gedeelde wachtwoord wordt niet meer gebruikt.
4. Het token wordt alleen in het geheugen van het geopvaende tabblad gehouden. Het wordt niet opgeslagen in cookies, localStorage, bronbestanden of omgevingsvariabelen. Na herladen of uitloggen log je opnieuw in.
5. Optioneel: kopieer `.env.example` naar `.env.local` en vul de publieke repositorynaam en branch in om die velden vooraf in te vullen. Plaats hier **geen token**.

Het adminscherm zelf is openbaar te openen; alleen een GitHub-token met schrijfrechten kan wijzigingen publiceren. Een verborgen URL geldt niet als toegangsbeveiliging.

## Projecten, afbeeldingen en talen

- Klik bij een project op **Bewerken**. Het veld **Project link / URL** accepteert `https://…`, `http://…`, `/pad` of `#anker`; leegmaken verwijdert de link. Geannuleerde projecten tonen, zoals voorheen, geen doorklikknop.
- Bij nieuwe en bestaande projecten kun je een JPG, PNG, WebP of AVIF uploaden, maximaal 10 MB. De browser verkleint het beeld tot maximaal 1600 pixels en maakt er WebP van. Het voorbeeld verschijnt direct. Klik vervolgens op **Opslaan** of voeg het project toe.
- Afbeeldingen komen in `public/uploads/`. Tekst en bijbehorende afbeeldingen worden samen in één Git-commit gepubliceerd. Oude afbeeldingen worden niet automatisch verwijderd, zodat andere verwijzingen niet kapot gaan.
- De Engelse vlag bovenaan schakelt naar Engels; daarna verschijnt de Nederlandse vlag. De keuze wordt onthouden en het HTML-taalattribuut verandert mee. Het werkt ook op mobiel en met het toetsenbord.
- Projecten, eerdere edities en Road to DBB hebben aparte Engelse velden voor titel, beschrijving en categorie/editie/periode. De bestaande inhoud is vertaald. Bij een leeg Engels veld verschijnt de Nederlandse tekst; vertalingen worden niet automatisch gegenereerd bij toekomstige wijzigingen.
- Vaste paginacopy zoals Over Ons en Contact heeft Nederlandse en Engelse tekst in de componenten. Deze teksten waren niet via het CMS bewerkbaar en blijven in de broncode beheerd.
- Als publiceren mislukt, blijven ingevoerde wijzigingen staan. Is de branch ondertussen gewijzigd, dan wordt opslaan geweigerd om wijzigingen van iemand anders te beschermen. Bewaar je invoer en log opnieuw in om de actuele versie te laden.

## Publiceren op GitHub Pages

Deze versie gebruikt een statische Next.js-export: `npm run build` maakt de map `out/`. GitHub Pages voert geen Node.js-API's uit; daarom gebeurt beheer via GitHub zelf.

1. Kies in de repository **Settings → Pages → Source → GitHub Actions**.
2. De meegeleverde workflow `.github/workflows/pages.yml` bouwt en publiceert pushes naar `main`. Pas de branchnaam aan als je een andere publicatiebranch gebruikt.
3. De workflow bepaalt automatisch het juiste basispad voor een projectsite zoals `naam.github.io/repository/` en voor een eigen domein.
4. Na opslaan in het beheermenu duurt het opnieuw bouwen en publiceren doorgaans even. De melding bevestigt de Git-commit, niet dat de live-publicatie al voltooid is. Controleer de workflow onder Actions.

## Publiceren op Vercel

GitHub bevat de broncode; Vercel en GitHub Pages zijn afzonderlijke hostingdiensten. Dezelfde broncode kan op beide worden gepubliceerd.

Koppel op Vercel de bedoelde repository en productiebranch, gebruik de Next.js-projectinstelling, Node.js 22 en `npm run build`. Next.js heeft `output: "export"` ingesteld. Laat `NEXT_PUBLIC_BASE_PATH` leeg op Vercel. Stel eventueel `NEXT_PUBLIC_GITHUB_REPOSITORY` en `NEXT_PUBLIC_GITHUB_BRANCH` in voor het beheerscherm. De Vercel Git-koppeling kan na elke beheercommit opnieuw publiceren. De Pages-workflow is alleen nodig als je óók GitHub Pages gebruikt.

Er zijn geen Netlify Blobs, uploadserver of betaalde opslagdienst nodig voor deze implementatie. Bestaande afbeeldingen uit de bijlage blijven onderdeel van het project.

## Controle

```sh
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm test
```

Browsertests controleren de taalwissel, taalbehoud na herladen, mobiele navigatie, projectlinks, Engelse CMS-inhoud, uploadconversie en atomaire publicatie, het niet opslaan van het token, geweigerde onveilige links en conflicten met gelijktijdige edits. De GitHub-responses zijn tijdens de tests gesimuleerd: de tests wijzigen geen echte repository.

De externe GitHub/Vercel-omgeving en een echte beheercommit zijn niet getest of aangepast als onderdeel van deze lokale oplevering.

Referenties: [GitHub Pages-workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Next.js static export](https://nextjs.org/docs/app/guides/static-exports), [GitHub Git Trees API](https://docs.github.com/en/rest/git/trees).
