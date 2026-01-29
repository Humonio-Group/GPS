# SCORM - Guide de démarrage rapide

## Configuration minimale backend

### 1. Endpoint API requis

Créez l'endpoint pour recevoir les statements xAPI :

```
POST /api/xapi/statements
```

**Payload attendu:**
```json
{
  "statement": {
    "actor": {
      "objectType": "Agent",
      "account": {
        "homePage": "https://your-domain.com",
        "name": "789"
      }
    },
    "verb": {
      "id": "http://adlnet.gov/expapi/verbs/completed",
      "display": {
        "en-US": "completed",
        "fr-FR": "complété"
      }
    },
    "object": {
      "objectType": "Activity",
      "id": "https://scorm-content-url.com/launch.html",
      "definition": {
        "type": "http://adlnet.gov/expapi/activities/lesson",
        "name": {
          "en-US": "SCORM Content 123"
        }
      }
    },
    "result": {
      "score": {
        "raw": 85,
        "scaled": 0.85
      },
      "completion": true,
      "success": true
    },
    "context": {
      "contextActivities": {
        "parent": [{
          "objectType": "Activity",
          "id": "https://your-domain.com/journey/456"
        }]
      }
    },
    "timestamp": "2026-01-28T10:30:00.000Z"
  },
  "journey_id": 456,
  "content_id": 123,
  "learner_id": 789
}
```

### 2. Format réponse API pour contenu SCORM

Votre endpoint `GET /activity_users` doit retourner :

#### SCORM Local (type 12)
```json
{
  "data": [{
    "id": "123",
    "type": "activity_user",
    "attributes": {
      "title": "Formation SCORM",
      "description": "Module de formation interactif",
      "specific": {
        "type": 12,
        "scorm": {
          "url": "https://your-cdn.com/scorm/package-123/index.html",
          "version": "2004",
          "isExternal": false,
          "journeyId": 456,
          "learnerId": 789,
          "metadata": {
            "completionStatus": "incomplete",
            "successStatus": "unknown",
            "score": 0,
            "progress": 0,
            "suspendData": "",
            "location": ""
          }
        }
      }
    }
  }]
}
```

#### SCORM Externe - ECHO (type 13)
```json
{
  "data": [{
    "id": "124",
    "attributes": {
      "specific": {
        "type": 13,
        "scorm": {
          "url": "https://echo.platform.com/launch/abc123",
          "version": "2004",
          "isExternal": true,
          "isEcho": true,
          "useDirectLoad": false,
          "journeyId": 456,
          "learnerId": 789
        }
      }
    }
  }]
}
```

## Tester avec un SCORM de démonstration

### Option 1 : SCORM Cloud (gratuit pour tests)

1. Créez un compte sur [SCORM Cloud](https://cloud.scorm.com/)
2. Uploadez un package SCORM de test
3. Copiez l'URL de lancement
4. Utilisez dans votre API :

```json
{
  "scorm": {
    "url": "https://cloud.scorm.com/ScormEngineInterface/defaultui/player/modern.html?configuration=...",
    "version": "2004",
    "isExternal": true,
    "isEcho": false
  }
}
```

### Option 2 : Package SCORM local

1. **Téléchargez un package SCORM de test:**
   - [ADL Sample Courses](https://adlnet.gov/projects/scorm/scorm-sample-courses/)
   - Exemple : "SCORM 2004 4th Edition Sample Run-time Environment"

2. **Décompressez et hébergez:**
   ```bash
   # Placez dans public/scorm-samples/
   mkdir -p public/scorm-samples/golf-example
   unzip SCORM_2004_4thEdition_Golf.zip -d public/scorm-samples/golf-example/
   ```

3. **Utilisez dans votre API:**
   ```json
   {
     "scorm": {
       "url": "http://localhost:3000/scorm-samples/golf-example/Playing/Playing.html",
       "version": "2004",
       "isExternal": false
     }
   }
   ```

## Vérification rapide

### 1. Vérifier que le composant SCORM est chargé

Dans la page reader, ouvrez la console :

```javascript
// Doit afficher le composant ContentScorm
console.log(document.querySelector('[data-scorm-player]'));
```

### 2. Vérifier les événements SCORM

Cherchez dans la console :
```
[SCORM Wrapper] Configuration: { scormUrl: "...", version: "2004", ... }
[SCORM 2004 API] Initialize called
[SCORM Player] Event received: Initialize
[SCORM Player] Sending xAPI statement
```

### 3. Vérifier l'appel API xAPI

Dans l'onglet Network, filtrez `/xapi/statements` :
- Doit voir des requêtes POST
- Status 200/201
- Payload contenant le statement

## Démo API Mock (pour tests rapides)

Créez un endpoint mock dans votre backend :

```typescript
// routes/api/demo-scorm.ts
export default defineEventHandler(() => {
  return {
    data: [{
      id: "999",
      type: "activity_user",
      attributes: {
        title: "SCORM Demo - Golf Course",
        description: "Formation interactive sur le golf",
        specific: {
          type: 12,
          order: 1,
          duration: 600,
          progression: {
            isViewed: false,
            progression: 0
          },
          scorm: {
            url: "https://cloud.scorm.com/ScormEngineInterface/defaultui/player/modern.html?...",
            version: "2004",
            isExternal: false,
            journeyId: 1,
            contentId: 999,
            learnerId: 1
          },
          links: {
            results: []
          }
        },
        dates: {
          start: null,
          end: null
        },
        permissions: {
          isLocked: false,
          isRateable: false,
          isCommentable: false
        },
        design: {
          picture: {
            thumbnail: "https://placehold.co/400x300/png"
          }
        }
      },
      relationships: {
        previousActivityUser: { data: [] },
        nextActivityUser: { data: [] }
      }
    }],
    included: []
  };
});
```

Ensuite testez :
```
GET http://localhost:3000/api/demo-scorm
```

## Troubleshooting

### ❌ "Configuration SCORM manquante"
**Cause:** `content.activity.scorm` est undefined
**Solution:** Vérifier que le store construit correctement l'activité SCORM

### ❌ "Erreur lors du chargement du contenu SCORM"
**Cause:** URL SCORM invalide ou CORS bloqué
**Solution:**
- Vérifier l'URL dans la console
- Pour contenu externe, mettre `isExternal: true`

### ❌ Pas de statements xAPI envoyés
**Cause:** Endpoint `/xapi/statements` n'existe pas
**Solution:** Créer l'endpoint ou vérifier les logs d'erreur

### ⚠️ SCORM se charge mais ne communique pas
**Cause:** Bridge non injecté ou problème cross-origin
**Solution:**
- Vérifier les logs `[SCORM Bridge]` dans la console
- Pour contenu externe strict (ECHO), c'est normal - utiliser `isExternal: true`

## Prochaines étapes

1. ✅ Tester avec un SCORM simple (local)
2. ✅ Vérifier les logs et statements xAPI
3. ✅ Tester la progression et completion
4. ✅ Tester avec SCORM externe (ECHO)
5. ✅ Implémenter la persistence côté backend
6. ✅ Ajouter des tests unitaires

## Ressources

- [Documentation complète](./SCORM_IMPLEMENTATION.md)
- [SCORM 2004 4th Edition Spec](https://adlnet.gov/projects/scorm/)
- [xAPI Specification](https://github.com/adlnet/xAPI-Spec)
- [SCORM Cloud](https://cloud.scorm.com/)

---

Besoin d'aide ? Consultez les logs détaillés dans la console navigateur avec le préfixe `[SCORM]`.
