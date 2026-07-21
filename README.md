# Eventize

Eventize è un MVP per la gestione di eventi community gratuiti con registrazione utenti, domande standard/custom e link contestuali a collette PayPal mostrate solo a scopo informativo.

## Stack tecnico

- Next.js 14 + TypeScript
- Tailwind CSS
- Auth.js / NextAuth v5 beta
- PostgreSQL
- Prisma ORM

## Funzionalità MVP incluse

- homepage moderna con eventi pubblicati
- pagina elenco eventi
- pagina dettaglio evento con box registrazione
- login con provider OAuth configurabili via environment
- area utente con elenco registrazioni
- dashboard admin base
- lista eventi admin
- pagina evento admin con visualizzazione domande, opzioni e helper PayPal
- schema database Prisma per utenti, eventi, domande, opzioni, helper e registrazioni
- seed demo con evento pubblicato e helper PayPal contestuale
- file di supporto per deploy Ubuntu con Nginx e systemd

## Limiti attuali del MVP

Questa prima base include un frontend completo e una struttura dati pronta, ma alcune parti sono volutamente minimali:

- il form di registrazione è attualmente una demo UI e non salva ancora le risposte nel database
- le pagine admin di creazione/modifica evento sono predisposte visivamente ma non hanno ancora CRUD completo lato server
- non sono presenti export CSV, upload immagini o editor rich text
- i provider OAuth dipendono dalla corretta configurazione delle variabili ambiente

Questa base è pensata per darti un bootstrap ordinato e facile da estendere.

---

# Guida passo-passo per Ubuntu

Questa sezione è pensata per un sistemista che vuole portare l'applicazione sul proprio server Linux Ubuntu.

## 1. Prerequisiti consigliati

Server consigliato:

- Ubuntu 24.04 LTS
- 2 vCPU
- 4 GB RAM
- 30+ GB disco
- accesso sudo
- dominio già puntato al server

## 2. Aggiornamento pacchetti

```bash
sudo apt update && sudo apt upgrade -y
```

## 3. Installazione pacchetti base

```bash
sudo apt install -y git curl unzip build-essential nginx certbot python3-certbot-nginx postgresql postgresql-contrib
```

## 4. Installazione Node.js LTS

Consiglio Node.js 22 LTS.

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## 5. Creazione directory applicazione

```bash
sudo mkdir -p /var/www/eventize
sudo chown -R $USER:$USER /var/www/eventize
cd /var/www/eventize
```

## 6. Clonazione repository

```bash
git clone https://github.com/lupan77/eventize.git /var/www/eventize
cd /var/www/eventize
```

Se vuoi eseguire direttamente il branch di lavoro:

```bash
git checkout copilot/bootstrap-mvp
```

## 7. Creazione database PostgreSQL

Accedi a PostgreSQL:

```bash
sudo -u postgres psql
```

Poi esegui manualmente:

```sql
CREATE USER eventize WITH PASSWORD 'eventize_password';
CREATE DATABASE eventize OWNER eventize;
GRANT ALL PRIVILEGES ON DATABASE eventize TO eventize;
```

Oppure usa il file già incluso:

```bash
sudo -u postgres psql -f scripts/create-database.sql
```

## 8. Variabili ambiente

Copia il file di esempio:

```bash
cp .env.example .env
```

Apri `.env` e modifica almeno:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXTAUTH_URL`
- `ADMIN_EMAILS`
- `SEED_ADMIN_EMAIL`
- eventuali credenziali OAuth

Per generare `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

Esempio `DATABASE_URL`:

```env
DATABASE_URL="postgresql://eventize:eventize_password@localhost:5432/eventize?schema=public"
```

## 9. Installazione dipendenze progetto

```bash
npm install
```

## 10. Generazione client Prisma

```bash
npx prisma generate
```

## 11. Migrazione database

Per ambiente locale/sviluppo:

```bash
npx prisma migrate dev --name init
```

Per produzione, dopo che le migrazioni sono state versionate:

```bash
npx prisma migrate deploy
```

Nota: in questo bootstrap il file di migrazione iniziale non è ancora stato generato automaticamente. Se sei il primo a deployare, esegui inizialmente `prisma migrate dev --name init` in ambiente di preparazione, poi committa la cartella `prisma/migrations`.

## 12. Seed iniziale

```bash
npm run db:seed
```

Questo crea:

- utente admin se `SEED_ADMIN_EMAIL` è definita
- evento demo pubblicato
- domanda radio sulla cena post-evento
- opzione con helper PayPal contestuale

## 13. Avvio in sviluppo

```bash
npm run dev
```

App disponibile su:

```text
http://localhost:3000
```

## 14. Build per produzione

```bash
npm run build
```

## 15. Avvio applicazione in produzione

```bash
npm run start
```

## 16. Esecuzione con systemd

Copia il file service:

```bash
sudo cp deploy/eventize.service /etc/systemd/system/eventize.service
```

Ricarica systemd:

```bash
sudo systemctl daemon-reload
sudo systemctl enable eventize
sudo systemctl start eventize
sudo systemctl status eventize
```

### Nota importante sul service

Il file `deploy/eventize.service` assume:

- app in `/var/www/eventize`
- utente `www-data`
- file `.env` in `/var/www/eventize/.env`

Verifica i permessi:

```bash
sudo chown -R www-data:www-data /var/www/eventize
```

Se vuoi mantenere ownership diversa, modifica il service di conseguenza.

## 17. Configurazione Nginx

Copia il file esempio:

```bash
sudo cp deploy/nginx-eventize.conf /etc/nginx/sites-available/eventize
```

Modifica `server_name` con il tuo dominio.

Poi abilita il virtual host:

```bash
sudo ln -s /etc/nginx/sites-available/eventize /etc/nginx/sites-enabled/eventize
sudo nginx -t
sudo systemctl reload nginx
```

## 18. HTTPS con Let's Encrypt

Dopo che il dominio punta al server:

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

Segui la procedura guidata.

## 19. Backup database

Crea una directory backup:

```bash
sudo mkdir -p /var/backups/eventize
```

Backup manuale:

```bash
pg_dump -U eventize -h localhost eventize > /var/backups/eventize/eventize-$(date +%F).sql
```

Per automazione usa cron, ad esempio con retention separata.

## 20. Aggiornamento applicazione

Se vuoi aggiornare da repository:

```bash
cd /var/www/eventize
git pull
npm install
npx prisma migrate deploy
npm run build
sudo systemctl restart eventize
```

Oppure usa lo script incluso:

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## 21. Configurazione provider OAuth

### Callback URL base

Per Auth.js / NextAuth, il callback principale usa il dominio dell’app.

In locale:

```text
http://localhost:3000/api/auth/callback/google
```

In produzione:

```text
https://tuodominio.it/api/auth/callback/google
```

### Variabili da impostare

#### Google

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

#### GitHub

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

#### Microsoft Entra ID

- `MICROSOFT_ENTRA_ID_CLIENT_ID`
- `MICROSOFT_ENTRA_ID_CLIENT_SECRET`
- `MICROSOFT_ENTRA_ID_TENANT_ID`

### Attenzione

Se un provider non è configurato, il relativo pulsante potrebbe comparire nella UI ma non completare correttamente il login. Per produzione conviene mostrare solo i provider realmente configurati in una fase successiva.

## 22. Admin dell'applicazione

L’accesso admin è basato su email.

Imposta in `.env`:

```env
ADMIN_EMAILS="tuamail@example.com,seconda@example.com"
```

Se vuoi creare automaticamente un admin al seed:

```env
SEED_ADMIN_EMAIL="tuamail@example.com"
```

## 23. Collette PayPal contestuali

Nel modello dati, una colletta non è un pagamento integrato. È composta da:

- titolo helper
- descrizione helper
- etichetta dello scopo
- URL esterno
- testo del pulsante

Questo permette casi come:

- evento gratuito
- opzione “Parteciperai alla cena?”
- se risposta “Sì”, viene mostrato un box con link PayPal alla colletta

## 24. Prossimi sviluppi consigliati

Per rendere il progetto realmente pronto all’uso, i prossimi step sono:

1. completare il salvataggio reale delle registrazioni
2. aggiungere CRUD admin con server actions
3. aggiungere esportazione CSV
4. mostrare solo provider OAuth realmente configurati
5. aggiungere validazione zod end-to-end
6. aggiungere upload immagine evento
7. aggiungere email transazionali

---

## Comandi rapidi utili

Installazione:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Produzione:

```bash
npm install
npx prisma migrate deploy
npm run build
npm run start
```

---

## Struttura progetto

```text
app/
components/
deploy/
lib/
prisma/
scripts/
```

---

## Stato bootstrap

Questo branch contiene il bootstrap iniziale del progetto ed è una base concreta per proseguire con lo sviluppo.
