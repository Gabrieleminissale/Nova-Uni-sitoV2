# CLAUDE.md — Contesto progetto Nova Uni

Questo file dà a Claude Code tutto il contesto necessario per lavorare su questo progetto. Leggilo prima di modificare qualcosa.

## Chi è l'utente

- **Gabriele Minissale** — gestisce il Polo Nova Uni. Ha un master in AI, quindi comprende concetti tecnici e di programmazione, ma ha **esperienza limitata di sviluppo web** (HTML/CSS/JS, deploy, DNS). Rispondere **sempre in italiano**.
- **Come comunicare**: per scelte tecniche aperte, presentare 2-3 opzioni con tradeoff **concreti** (numeri, scenari pratici, costi reali), poi dare una raccomandazione. Non essere astratto. Guidare step-by-step nelle operazioni su sistemi esterni (GitHub, DNS, dashboard).
- La titolare legale dell'attività è **Laura Baldari (Ditta Individuale)**, P.IVA 18219621002, sede operativa Via Barnaba Oriani 1, Milano.

## Cos'è il progetto

Sito vetrina + lead generation del **Polo Nova Uni**, centro di orientamento universitario che indirizza studenti verso le università telematiche del **Gruppo Multiversity**: Pegaso, Mercatorum, San Raffaele. Nova Uni guadagna sulle iscrizioni intermediate e sulla vendita di certificazioni.

**Il sito è uno strumento commerciale, non un prodotto tech.** Ogni decisione (SEO, performance, conversione) va letta in ottica "lead in entrata". Le CTA verso Calendly, form e WhatsApp devono restare sempre evidenti.

**Stato: il sito è LIVE in produzione su https://novauni.it**

## Stack e architettura

- **HTML / CSS / JavaScript vanilla** — nessun framework, nessuna build, nessun Node. Scelta deliberata per SEO, performance e manutenibilità da parte di un non-sviluppatore. NON introdurre React/build step/backend senza un motivo forte e concordato.
- **Hosting**: GitHub Pages, repo `Gabrieleminissale/Nova-Uni-sitoV2` (pubblico), branch `main`, deploy da root. ATTENZIONE: esiste anche un vecchio repo `Nova-Uni-sito` (contiene un esperimento di migrazione ad Astro, feb 2026) che NON è quello live — il repo live è riconoscibile dal file `CNAME` con `novauni.it`.
- **Deploy manuale**: Gabriele non usa git in locale; carica i file modificati a mano via GitHub web (Add file → Upload files dentro la cartella giusta). Quando si preparano modifiche, elencare sempre i file toccati e il percorso esatto dove caricarli.
- **DNS**: Aruba → record A del dominio root verso gli IP di GitHub Pages, CNAME `www` → `gabrieleminissale.github.io.`. Il file `CNAME` nella root contiene `novauni.it` (non cancellare).
- **Deploy**: ogni push/upload su `main` aggiorna il sito live in ~1-2 minuti.

## Struttura file

```
index.html            Homepage (hero, atenei, come funziona, testimonianze, partner, contatti, footer)
corsi.html            Catalogo 51 corsi di laurea con filtri (ateneo/livello/ambito) + ricerca
certificazioni.html   Inglese B2/C1 + EIPASS, FAQ, form dedicato
privacy.html          Informativa GDPR
cookie.html           Cookie policy
css/style.css         TUTTI gli stili del sito (un unico file)
js/main.js            JS homepage: navbar scroll, slider testimonianze, form, dropdown, pre-fill da ?corso=
js/corsi.js           JS catalogo: filtri, ricerca, deep-link via URL, dropdown, hamburger
js/certificazioni.js  JS certificazioni: form, pre-fill da ?cert=, dropdown, hamburger
js/cookie-consent.js  Banner cookie + Google Consent Mode v2
assets/               Logo, loghi atenei, immagini. assets/corsi/ = 51 immagini corsi
CNAME                 Dominio custom GitHub Pages
sitemap.xml           Mappa sito per Google
robots.txt            Direttive crawler
```

## Integrazioni esterne (endpoint reali, già configurati)

- **Form contatti**: Web3Forms. Access key `ffd75ed9-3d93-484d-8637-f103afc93074` (embeddata negli HTML, non è un secret). Le submission arrivano a **novauni.formazione@gmail.com** (nota: `formazione` singolare).
- **Booking**: Calendly `https://calendly.com/novauni-formazione/30min` — è la CTA di tutti i bottoni "Prenota/Consulenza".
- **WhatsApp**: `https://wa.me/393793332878` — FAB floating su tutte le pagine + link contestuali su certificazioni.
- **Email pubblica** mostrata sul sito: **info@novauni.it**.
- **Google Analytics 4**: ID `G-ZYQ7B6HPRJ`, configurato con **Consent Mode v2** — NON traccia nulla finché l'utente non accetta i cookie dal banner. Lo snippet va replicato nel `<head>` di ogni nuova pagina.

## Convenzioni da rispettare

- **Ogni nuova pagina** deve includere: lo snippet GA4 nel `<head>`, la navbar completa (con dropdown "Corsi di laurea"), il footer, il banner cookie, il FAB WhatsApp, e caricare `js/cookie-consent.js`.
- **Colori brand** (in `:root` di style.css): navy `#1d3461`, navy-dark `#111e3a`, oro `#f0a500`, cream `#faf9f6`. Font: DM Serif Display (titoli), DM Sans (testo).
- **Immagini corsi**: `assets/corsi/<slug>.jpg`, 800×500px. Se manca, fallback gradient automatico (onerror sull'img).
- Le pagine `privacy.html` e `cookie.html` hanno `noindex, follow`.

## Decisioni di contenuto CONFERMATE dall'utente — NON riproporre

Queste sono scelte deliberate, non dimenticanze:

- **Testimonianze** (in `js/main.js`): sono recensioni **REALI** dal profilo Google Business di Nova Uni. Mai metterne in dubbio l'autenticità. Miglioramento accettabile: linkare il profilo Google per verificabilità.
- **Certificazione Inglese**: NON è riconosciuta MUR e NON vale per concorsi/GPS — vale **solo per l'esonero** dell'esame di Inglese in Pegaso e Mercatorum (non San Raffaele). Erogata da AG Formazione. Il test è a risposta multipla, senza webcam, tentativi illimitati, nessun voto.
- **EIPASS**: esonera l'esame di Informatica (non "tutti i CDL", genericamente). Riconosciuta dai 3 atenei + vale per GPS/concorsi. EIPASS HA la webcam (a differenza dell'inglese).
- **Esami in presenza**: NON si spiegano sul sito, si spiegano in call. Niente FAQ su questo.
- **Prezzo corsi**: "a partire da €116/mese" (aggiornato lug 2026), indicato nelle 51 card di corsi.html. Varia con le promo, l'utente lo aggiorna a mano — la stringa da sostituire in blocco è `<strong>€116<small>/mese</small></strong>`.
- **Conteggio offerta**: il dato "+200 corsi di laurea" in homepage è corretto perché considera anche Master e percorsi ALFO. `corsi.html` mostra deliberatamente solo 51 corsi di laurea per mantenere il catalogo consultabile.
- **Chi siamo / pagina team**: scartata deliberatamente (attività di 2 persone).
- **Pagina Atenei separata**: scartata (ridondante con la sezione in home).
- **News/blog**: scartato (troppo da mantenere).
- **Stripe per certificazioni**: scartato (prezzi variabili con promo, meglio gestire via form).

## Possibili sviluppi futuri discussi

- **Pixel Meta**: da aggiungere nella stagione iscrizioni (ago-set) se partono ads su Meta. Richiederà di evolvere il banner cookie a 3 categorie (tecnici/analitici/marketing).
- **Quiz di orientamento**: valutato come buon lead magnet, non ancora realizzato.
- **Bot AI interno al sito**: valutato e accantonato in favore del bottone WhatsApp. È distinto dal **Tutor AI** attivo su `https://ai.novauni.it`, che è un sito separato e un servizio riservato agli studenti Nova Uni.
