# Network Address Translation (NAT)

**Network Address Translation (NAT)** è un metodo utilizzato dai router per tradurre un insieme di indirizzi IP in un altro. È usato più comunemente per consentire ai dispositivi di una rete locale privata (come un Wi-Fi domestico) di comunicare con Internet pubblico utilizzando un unico indirizzo IP pubblico.

## Perché si usa il NAT?

La ragione principale dell'esistenza del NAT è la **carenza di indirizzi IPv4**.

Gli indirizzi IPv4 sono numeri a 32 bit, che forniscono circa 4,3 miliardi di indirizzi univoci. Con la crescita di Internet, questi indirizzi si sono esauriti. Il NAT risolve questo problema consentendo a un'intera rete privata (che può avere migliaia di dispositivi) di condividere **un solo** indirizzo IPv4 pubblico.

## Come funziona (Le basi)

Quando un dispositivo su una rete locale (come un laptop) vuole accedere a un sito web:

1. **Richiesta in uscita:** Il laptop invia una richiesta al router. La richiesta ha un **IP di origine privato** (ad es. `192.168.1.10`) e una **porta di origine** (ad es. `54321`).
2. **Traduzione:** Il router intercetta questo pacchetto. Sostituisce l'IP di origine privato con il proprio **IP pubblico** (ad es. `203.0.113.5`). Assegna inoltre una nuova porta di origine univoca (ad es. `60001`) e registra questa mappatura in una tabella.
3. **Richiesta su Internet:** Il pacchetto ora attraversa Internet come se provenisse da `203.0.113.5:60001`.
4. **Risposta in entrata:** Il server web risponde a `203.0.113.5:60001`.
5. **Traduzione inversa:** Il router riceve la risposta, consulta la sua tabella di mappatura, vede che la porta `60001` appartiene al laptop e inoltra il pacchetto a `192.168.1.10:54321`.

## Tipi di NAT

Esistono diversi modi in cui il NAT viene implementato:

### 1. NAT statico (SNAT)

Una mappatura uno-a-uno tra un indirizzo IP privato e un indirizzo IP pubblico. È spesso usato per server web che necessitano di un IP pubblico coerente.

- `192.168.1.10` ⇄ `203.0.113.5`

### 2. NAT dinamico

Un pool di indirizzi IP pubblici è condiviso tra un gruppo più ampio di dispositivi privati. Il router assegna un IP pubblico a un dispositivo privato in base all'ordine di arrivo.

### 3. PAT (Port Address Translation) / NAT Overload

Questo è il tipo più comune di NAT utilizzato nelle case e nelle piccole imprese. È quello descritto nella sezione "Come funziona" qui sopra. Consente a **molti** dispositivi privati di condividere un **unico** indirizzo IP pubblico utilizzando numeri di porta diversi per tenere traccia delle connessioni.

- Tecnicamente è un sottoinsieme del NAT dinamico, ma è così comune che di solito lo si chiama semplicemente "NAT".

## Vantaggi e svantaggi

| Vantaggi | Svantaggi |
| :--- | :--- |
| **Conserva gli indirizzi IPv4:** Rallenta l'esaurimento degli IP pubblici. | **Rompe la connettività end-to-end:** I dispositivi dietro il NAT non possono essere raggiunti direttamente da Internet senza il port forwarding. |
| **Sicurezza:** Nasconde la struttura della rete interna dal mondo esterno. | **Sovraccarico di prestazioni:** I router devono svolgere lavoro extra per modificare le intestazioni dei pacchetti. |
| **Flessibilità:** È possibile modificare lo schema IP interno senza avvisare il proprio ISP. | **Complica i protocolli:** Alcuni protocolli (come VoIP o certi giochi) incorporano gli indirizzi IP nel payload dei dati, che il NAT non può tradurre facilmente. |

## NAT e IPv6

Con l'introduzione di **IPv6**, lo spazio degli indirizzi è così enorme (340 undecillion di indirizzi) che ogni dispositivo può avere il proprio indirizzo IP pubblico univoco.

Per questo motivo, **il NAT generalmente non è necessario per IPv6**. Tuttavia, alcuni amministratori di rete ne usano ancora una variante (NAT66) per motivi di sicurezza o di gestione della rete, sebbene ciò sia meno comune.