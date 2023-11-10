# Descrizione del Progetto
Questo progetto è un'applicazione web che consente la creazione e la condivisione di album di immagini. L'applicazione è stata implementata utilizzando i principi dello stack MERN (Mongo, Express, React, Node), con utilizzo di routing per gli endpoint sul server. Inoltre ho utilizzato Typescript e SASS per lo styling
# Funzionalità Principali
## Registrazione e Login
Gli utenti possono registrarsi e accedere al sistema attraverso una pagina pubblica con form di registrazione e login. La registrazione verifica la validità sintattica dell'indirizzo email e l'uguaglianza tra i campi "password" e "ripeti password". I controlli di validità sono effettuati anche lato client tramite regex. Per l'autenticazione ho utilizzato JWT unito al session storage e cookies.<br>

![Home](/client/src/assets/login.png)

## Accesso all'homePage
In seguito all'accesso l'utente si ritroverà nella home page. Questa pagina è divisa in due sezioni, la prima mostra gli album creati dagli altri utenti. Di ogni album viene mostrata la copertina, il titolo dell'album e il nome del creatore. La seconda sezione comprende gli album creati dall'utente che ha effettuato il login, anch'essi mostrano gli stessi dati<br>

![Home](/client/src/assets/home.png)
## Dettagli di un album creato da altri
 Schiacciando sulla copertina di un album creato da altri utenti apparirà una nuova sezione. In questa verranno mostrate le immagini contenute all'interno dell'alum<br>

 ![Details](/client/src/assets/details.png)

 ## Pubblicazione di Commenti
 Aprendo un'immagine dell'album appare l'immagine ingrandita, con titolo e descrizione dell'immagine. In questo form è possibile vedere la sezione commenti, e crearne uno nuovo relativo all'immagine<br>

 ![Comments](/client/src/assets/miles.png)
 ## Creazione di un album
 Interagendo con la sezione dei propri album è possibile crearne uno nuovo, dopo aver inserito titolo e immagine di copertina, l'album appena creato verrà visualizzato fin da subito nella sezione dei propri album<br>

 ![Thumbnail](/client/src/assets/compo.png)
 ![Thumbnail2](/client/src/assets/comp2.png)

## Logout
L'applicazione consente il logout dell'utente.<br>

### Strumenti e linguaggi utilizzati 

- `Client` : React, Javascript, Html , SASS, CSS, Typescript
- `Server` : Mongoose, Mongodb (DATABASE), Express