# EasyHealth — Revue de l'interface (maquette de démonstration)

Cette application est une **copie fidèle de l'interface EasyHealth** alimentée par des **données fictives** (aucun backend, aucun compte réel, aucune donnée de santé réelle). Elle sert à **revue l'interface** avant validation.

## Consignes pour le revueur (natif)

1. Ouvrez l'URL de la maquette : **https://bolouvipf.github.io/easyhealth-ui-review/** (l'URL sera active après le premier déploiement automatique).
2. Commencez par la page **Sommaire** : elle liste les 16 écrans à parcourir (landing, connexion, inscription, tableau de bord médecin, fiche patient, espace patient, partage sécurisé, journal d'audit, administration, FAQ, confidentialité, guides, page 404...).
3. Cliquez sur chaque carte pour ouvrir l'écran. Un bandeau vert « MODE DÉMO » rappelle en permanence que les données sont fictives.
4. Pour changer de profil (médecin, infirmier, agent communautaire, patient, administrateur) :
   - cliquez sur **Quitter** (bouton de déconnexion en haut),
   - puis sur **Connexion** : une carte « Comptes de démonstration » liste les comptes ; cliquez sur un compte pour remplir le formulaire automatiquement, puis connectez-vous (mot de passe affiché).
   - L'**espace patient** et la **connexion admin** s'explorent de la même façon.
5. Vérifiez les points suivants en priorité :
   - **Boutons et actions** : cliquables, libellés compréhensibles, retour visuel.
   - **Formulaires** : champs clairs, messages d'erreur utiles, validation cohérente.
   - **Responsive** : redimensionnez la fenêtre ou ouvrez sur mobile (menu hamburger, cartes, tableaux).
   - **Langues** : le sélecteur FR/EN est disponible sur tous les écrans ; basculez les deux langues pour vérifier les traductions.
   - **Accessibilité** : contrastes, libellés des boutons, navigation clavier (tabulation).
6. Consignez vos observations par écran (n° d'écran, constat, suggestion). Remettez le rapport au responsable du projet.

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Médecin | medecin@demo.tg | demo1234 |
| Infirmier | infirmier@demo.tg | demo1234 |
| Agent communautaire | agent@demo.tg | demo1234 |
| Patient | patient@demo.tg | demo1234 |
| Administrateur | admin@demo.tg | admin1234 |

## Développement local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production dans dist/
```

## Déploiement

Le déploiement sur GitHub Pages est automatique à chaque push sur `main` (workflow `.github/workflows/deploy-pages.yml`). URL : **https://bolouvipf.github.io/easyhealth-ui-review/**

## Architecture de la maquette

- `src/pages/` — les écrans (copies de l'application réelle, traduites FR/EN).
- `src/services/api.ts` — API **mockée** (mêmes signatures que l'API réelle, latence simulée, aucune requête réseau).
- `src/mock/data.ts` — données fictives (patients, entrées cliniques, audit, statistiques).
- `src/hooks/useAuth.tsx` — authentification démo (session locale, aucun compte réel).
- `src/i18n/` — dictionnaires FR/EN (identiques à l'application réelle).

> ⚠️ Aucune donnée de santé réelle n'est stockée ni transmise. Cette maquette ne doit jamais être connectée à l'API de production.
