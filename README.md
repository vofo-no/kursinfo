Dette prosjektet lager og viser statistikkrapporter for studieforbundenes kursvirksomhet.

## Kom i gang

Programmet kan kjøres lokalt på maskinen din.

```bash
$ git clone https://github.com/vofo-no/reg-stat
$ yarn install
$ yarn dev
```

Gå til [http://localhost:3000](http://localhost:3000) i nettleseren for å se resultatet.

## Oppdatere eller legge til nye data

Legg inn ny eller manglende datafil fra SSB. Bruk filnavnet `data/raw/g2020.csv` (med riktig årstall).

Deretter analyserer du datafilen og genererer data til aktuelle rapporter ved å kjøre:
```bash
$ yarn run chewie [år]
```

Endringer lagres i git og publiseres. Rådatafiler skal ikke lagres i git.

## Struktur

Prosjektet har følgende deler:

- `chewie` inneholder programmet som analyserer datafiler og henter relevant data fra andre kilder.
- `components` inneholder felles React-komponenter som brukes i statistikkrapportene.
- `data` inneholder strukturerte data til statistikkrapportene.
  - `config.json` definerer endringer i fylkesstruktur og studieforbund over tid (det er ikke nødvendig å definere årstall uten endringer).
  - `raw` inneholder rådatafiler.
- `pages` inneholder nettsidene som skal genereres og publiseres.
- `public` inneholder statiske ressurser til nettsidene.

Du kan lære mer om rammeverket i [dokumentasjonen til Next.js](https://nextjs.org/docs).

## Takk til

[![Powered by Vercel][vercel]][vercel-url]

[vercel]: ./public/powered-by-vercel.svg
[vercel-url]: https://vercel.com/?utm_source=vofo-kursinfo
