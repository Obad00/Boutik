# Boutik — PWA de gestion pour boutiques de quartier

MVP React + Vite + TypeScript + Tailwind CSS, multi-tenant, prêt à être branché sur Supabase.

## Démarrage

```bash
npm install
npm run dev
```

Puis ouvrez `http://localhost:5173`.

## Connexion (démo)

L'app a deux niveaux d'accès distincts :

1. **Superadmin (opérateur de la plateforme)** — `/superadmin`, code PIN **9999** par
   défaut. C'est lui qui crée les boutiques : nom, adresse, téléphone → génère
   automatiquement un **code boutique** unique (ex: `SANDAGA`), qu'il communique
   ensuite au boutiquier. Un lien discret "Espace superadmin" est présent en bas de
   l'écran de connexion.
2. **Boutiquier** — écran de connexion principal, code boutique reçu du superadmin.
   Une fois connecté, il ne voit et ne manipule que les données de sa boutique.

Deux boutiques de démonstration sont pré-créées pour tester l'isolation multi-tenant
sans passer par le superadmin :

- Code **SANDAGA** → Boutik Sandaga (Dakar) — catalogue complet, clients à crédit, etc.
- Code **THIES** → Boutik Thiès Centre — catalogue réduit, données distinctes

Le code PIN admin (gestion produits/catégories/clients/paramètres, différent du PIN
superadmin) est **1234** par défaut pour chaque boutique — modifiable dans
Admin → Paramètres, une fois connecté à la boutique.

## Build de production

```bash
npm run build
npm run preview
```

Le build inclut un service worker (via `vite-plugin-pwa`) : l'app est installable
sur téléphone/tablette (bouton "Ajouter à l'écran d'accueil" ou "Installer").

## Structure du projet

Points clés :

- `src/types/` — interfaces TypeScript miroir du futur schéma Supabase
- `src/services/interfaces/` — contrats abstraits (implémentés par mock aujourd'hui, Supabase demain)
- `src/services/mock/` — implémentation en mémoire, avec `shop_id` strictement filtré partout
- `src/services/client.ts` — point d'entrée unique de la couche data (à modifier pour brancher Supabase)
- `src/services/supabase/README.md` — notes détaillées pour le branchement futur
- `src/store/` — état global Zustand (session, panier, produits, clients, caisse, ventes, paramètres)
- `src/components/` — organisés par domaine (sale, stock, cash, credit, admin) + `ui/` (design system)
- `src/lib/printer/` — génération ESC/POS + connexion Web Bluetooth pour impression 58mm

## Impression Bluetooth ESC/POS

Le module `src/lib/printer/bluetooth.ts` utilise le service générique BLE `0x18F0` /
caractéristique `0x2AF1`, courant sur les imprimantes thermiques génériques vendues au
Sénégal. Si votre imprimante utilise un autre UUID de service, ajustez les constantes
`PRINTER_SERVICE_UUID` / `PRINTER_CHARACTERISTIC_UUID` en haut du fichier. Le Web
Bluetooth nécessite HTTPS (ou localhost) et n'est supporté que sur Chrome/Edge Android
et desktop (pas Safari iOS).

## Prochaines étapes suggérées

1. Brancher Supabase (voir `src/services/supabase/README.md`)
2. Remplacer l'auth par code boutique par un vrai flux Supabase Auth
3. Ajouter la gestion multi-caissiers avec rôles si besoin
4. Ajuster les UUID Bluetooth selon le modèle d'imprimante réel utilisé
