# Action Creation Config Endpoint

## Endpoint

```
GET v3/journeys/{journeyId}/action-creation-config
```

Retourne toutes les données nécessaires à l'ouverture du modal de création d'action pour un journey donné.

---

## Réponse attendue

```json
{
  "data": {
    "programId": 789,
    "defaultActionPlan": {
      "id": 123,
      "embedContent": {
        "fields": {
          "default": 0,
          "preFilledStrategies": [45, 67],
          "preFilledImpactMapStrategies": [45, 67, 89, 12],
          "isStrategiesReadonly": false,
          "preFilledDescription": "<p>Texte pré-rempli</p>",
          "isDescriptionReadonly": false,
          "preFilledDueDate": 14,
          "isDueDateReadonly": false,
          "preFilledTasklist": [
            { "name": "Tâche 1", "done": false },
            { "name": "Tâche 2", "done": false }
          ],
          "isTasklistReadonly": false,
          "section1Label": "Label section 1",
          "section2Label": "Label section 2",
          "section3Label": "Label section 3",
          "section4Label": "Label section 4"
        }
      },
      "actionPlan": {
        "id": 456,
        "impactMapActive": true
      },
      "activityUser": {
        "dates": {
          "creation": "2026-01-15T10:00:00Z"
        }
      }
    },
    "strategies": [
      {
        "id": 45,
        "display": "Nom de la stratégie",
        "section": { "value": 4, "displayName": "Objectif" }
      },
      {
        "id": 67,
        "display": "Autre stratégie",
        "section": { "value": 3, "displayName": "Impact" }
      }
    ],
    "templates": [
      { "id": 1, "displayName": "Template A" },
      { "id": 2, "displayName": "Template B" }
    ]
  }
}
```

---

## Détail des champs

### `programId`

ID du program lié au journey. Utilisé côté front pour identifier le programme (utile si d'autres calls nécessitent ce contexte).

**Source :** `journey.program.id`

### `defaultActionPlan`

Le plan d'action par défaut du journey. C'est un **content** lié au program via la relation `program.defaultChangr`.

| Champ | Description |
|---|---|
| `id` | ID du content |
| `embedContent.fields.default` | Si `=== 0`, le mode prefill est activé |
| `embedContent.fields.preFilledStrategies` | IDs des stratégies pré-sélectionnées (mode standard) |
| `embedContent.fields.preFilledImpactMapStrategies` | IDs des stratégies pré-sélectionnées (mode impact map) |
| `embedContent.fields.isStrategiesReadonly` | Verrouille le champ stratégies |
| `embedContent.fields.preFilledDescription` | Description HTML pré-remplie |
| `embedContent.fields.isDescriptionReadonly` | Verrouille le champ description |
| `embedContent.fields.preFilledDueDate` | Nombre de jours à ajouter à la date de création pour calculer la date d'échéance |
| `embedContent.fields.isDueDateReadonly` | Verrouille le champ date d'échéance |
| `embedContent.fields.preFilledTasklist` | Tableau de tâches pré-remplies (`{ name, done }`) |
| `embedContent.fields.isTasklistReadonly` | Verrouille le champ tasklist |
| `embedContent.fields.section{1-4}Label` | Labels personnalisés pour chaque section de l'impact map |
| `actionPlan.id` | **ID du changr** — envoyé dans `relationships.changr` lors du `POST v1/actions` |
| `actionPlan.impactMapActive` | `true` = 4 sections de stratégies (1-4), `false` = section 4 uniquement |
| `activityUser.dates.creation` | Date de référence pour le calcul de la date d'échéance pré-remplie |

### `strategies`

Liste des stratégies disponibles pour le plan d'action par défaut.

| Champ | Description |
|---|---|
| `id` | ID de la stratégie |
| `display` | Nom d'affichage |
| `section.value` | Numéro de la section (1, 2, 3 ou 4) |
| `section.displayName` | Nom d'affichage de la section |

**Logique de filtrage :**
- Stratégies liées au `defaultActionPlan.id` (content) ET au `journeyId`
- Si `actionPlan.impactMapActive === false` : sections `[4]` uniquement
- Si `actionPlan.impactMapActive === true` : sections `[1, 2, 3, 4]`
- Triées par `order`

### `templates`

Liste complète (non paginée) des templates d'action disponibles pour ce journey.

| Champ | Description |
|---|---|
| `id` | ID du template (content) |
| `displayName` | Nom d'affichage du template |

**Logique de filtrage :**
- Contents avec `actionPlanTemplate = 1`
- Liés au journey et à son program
- Triés par `name`

---

## Contexte d'utilisation

Cet endpoint est appelé à l'ouverture du modal de création d'action, que ce soit depuis la page Actions ou depuis un contenu. Il remplace les 4 calls suivants :

| Ancien call | Remplacé par |
|---|---|
| `GET v1/users/me` avec include `activeJourneys.program.defaultChangr` | `defaultActionPlan` dans la réponse |
| `GET v1/contents/{contentId}` avec include `embedContent,activityUsers` | `defaultActionPlan` dans la réponse |
| `GET v1/strategies` filtré par content/journey/sections | `strategies` dans la réponse |
| `GET v1/contents` avec `actionPlanTemplate=1` (paginé) | `templates` dans la réponse |

---

## Endpoint de création (rappel)

Une fois le formulaire rempli, l'action est créée via :

```
POST v1/actions
```

```json
{
  "data": {
    "type": "actions",
    "attributes": {
      "description": "<html string>",
      "dates": {
        "endAction": "YYYY-MM-DD"
      },
      "tasklist": [
        { "name": "...", "done": false }
      ]
    },
    "relationships": {
      "journey": {
        "data": { "type": "journeys", "id": "{journeyId}" }
      },
      "changr": {
        "data": { "type": "changrs", "id": "{defaultActionPlan.actionPlan.id}" }
      },
      "impactMapCategory4": {
        "data": { "type": "strategies", "id": "{strategyId}" }
      },
      "topic": {
        "data": {
          "type": "topics",
          "attributes": { "isPublic": true }
        }
      }
    }
  }
}
```

- `relationships.changr.id` = `defaultActionPlan.actionPlan.id` de la réponse du GET
- `impactMapCategory{N}` = une relationship par section de stratégie sélectionnée
