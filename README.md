# Game Night

Web aplikacija za društvo koje organizira večeri društvenih igara: katalog igara, posudba,
prijave na termine i ocjene.

Prototip sučelja: [Figma](https://www.figma.com/design/n17L3fteAtwLBAdslUfIL1/Game-Night?node-id=6-848&t=qZoNvgIr6s1ICWaL-1)

## O projektu

- Autor: Zvonimir Mance
- Ustanova: Fakultet informatike u Puli
- Kolegij: Programsko inženjerstvo
- Mentor: doc. dr. sc. Nikola Tanković

## Funkcionalnosti

**Posjetitelj**
- katalog igara s filtrima (naziv, žanr, broj igrača, trajanje)
- detalji igre, dostupnost i ocjene
- nadolazeći termini i njihove igre
- registracija i prijava

**Prijavljeni korisnik**
- posudba igre na 14 dana
- profil: posudbe, obavijesti o prekoračenom roku i termini na koje je prijavljen
- ocjena igre (1-5 uz komentar, jedna po igri)
- prijava i odjava s termina uz provjeru kapaciteta

**Administrator**
- dodavanje, uređivanje i brisanje igara (posuđena igra se ne može obrisati)
- zakazivanje termina i odabir igara
- prijavljeni po terminu, aktivne posudbe i označavanje povrata
- statistika: održani termini, broj korisnika, najaktivniji posjetitelji

## Tehnologije

- Vue 3 (Composition API)
- Vue Router - rute stranica
- Pinia - stanje prijavljenog korisnika
- Firebase - Authentication i Firestore
- Bootstrap 4.5 - izgled sučelja
- Vite - razvojni poslužitelj i build

## Struktura projekta

```
firestore.rules  sigurnosna pravila baze
src/
  assets/        stilovi
  components/    navbar, kartica igre, forme za igre i termine
  composables/   poruke o uspjehu i pogreškama
  router/        rute
  services/      upiti prema Firestoreu, po kolekcijama
  stores/        stanje prijavljenog korisnika
  utils/         funkcije za datume
  views/         stranice aplikacije
  firebase.js    inicijalizacija Firebasea
```

## Pokretanje

Potreban je Node.js 20.19+ ili 22.12+.

```sh
npm install
npm run dev
```

## Upute za korištenje

1. Registriraj se preko **Register** i prijavi preko **Login**.
2. U **Catalog** odaberi igru i klikni **Borrow**. Rok povrata vidi se na stranici igre i na profilu.
3. Na stranici igre ostavi ocjenu u dijelu **Ratings**.
4. U **Events** otvori termin i klikni **Register**. Termin se pojavljuje na profilu pod **My events**.
5. Administrator upravlja igrama, terminima i posudbama na stranici **Admin**.

Administratorski račun dobiva se ručnom izmjenom polja `role` u `admin` na dokumentu korisnika u kolekciji `users`.

## Model podataka

| Kolekcija | Polja |
| --- | --- |
| `users/{uid}` | name, email, role, createdAt |
| `games/{id}` | title, description, genre, difficulty, minPlayers, maxPlayers, durationMinutes, available, returnBy, averageRating, ratingCount |
| `games/{id}/ratings/{uid}` | userId, userName, score, comment, createdAt |
| `events/{id}` | title, date, time, capacity, games (`{ id, title }`), registered, attendees |
| `borrowings/{id}` | gameId, gameTitle, userId, userName, borrowedAt, returnBy, returnedAt |
| `notifications/{borrowingId}` | userId, message, createdAt, read |
