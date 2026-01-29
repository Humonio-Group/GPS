# Implémentation SCORM - Learning Point (GPS)

## Vue d'ensemble

Ce projet intègre un système complet de lecture SCORM supportant :
- **SCORM 1.2** (window.API)
- **SCORM 2004** (window.API_1484_11)
- **CMI5**
- **Contenu local** (fichiers hébergés)
- **Contenu externe** (ECHO, autres plateformes)
- **Tracking xAPI** (statements envoyés au backend)

## Architecture - 3 Couches

### Couche 1 : Composant Vue (ContentScorm.vue)
**Fichier:** `app/components/course/content/elements/ContentScorm.vue`

**Responsabilités:**
- Affichage de l'iframe SCORM
- Gestion du fullscreen
- Interface utilisateur (contrôles, progression)
- Affichage des notifications (toasts)
- Gestion des états d'erreur

**Props:**
- `content: Content` - Objet contenu avec `activity.scorm`

### Couche 2 : Wrapper HTML (scorm-wrapper.html)
**Fichier:** `public/scorm-wrapper.html`

**Responsabilités:**
- Implémentation de l'API SCORM locale (fallback)
- Injection du bridge de communication dans le contenu SCORM
- Relais des événements SCORM vers le composant Vue via `postMessage`
- Gestion de la file d'attente des appels pendant l'initialisation
- Support des deux standards (SCORM 1.2 et 2004)

**Fonctionnalités clés:**
- **Queue Management:** Les appels `SetValue` sont mis en file d'attente pendant `Initialize`
- **Cross-origin Support:** Communication via `postMessage` pour contenu externe
- **Bridge Injection:** Injection automatique du script bridge dans le HTML SCORM

### Couche 3 : Service Composable (useScormPlayer)
**Fichier:** `app/composables/useScormPlayer.ts`

**Responsabilités:**
- Génération de l'URL du wrapper avec paramètres
- Écoute des événements SCORM via `postMessage`
- Tracking de l'état (score, progression, completion)
- Création et envoi des statements xAPI
- Anti-régression (empêche score/progression de reculer)
- Gestion spéciale ECHO (statements uniquement sur Terminate)

## Flux de données

```
Contenu SCORM (iframe)
    ↓ (appelle API SCORM)
Bridge JavaScript injecté
    ↓ (postMessage)
Wrapper HTML (API SCORM locale)
    ↓ (postMessage: SCORM_EVENT)
useScormPlayer composable
    ↓ (handleSetValue, handleTerminate, etc.)
Création xAPI statement
    ↓ (POST /xapi/statements)
Backend API
```

## Types TypeScript

### ScormActivity
**Fichier:** `app/types/entities/activity.ts`

```typescript
interface ScormActivity {
  url: string;                    // URL du contenu SCORM
  isExternal: boolean;            // Contenu externe (ECHO, etc.)
  isEcho?: boolean;               // Spécifique ECHO (type 13)
  useDirectLoad?: boolean;        // Charger directement ou via wrapper
  launchUrl?: string;             // URL de lancement alternative
  manifestUrl?: string;           // URL du manifeste imsmanifest.xml
  version: ScormVersion;          // "1.2" | "2004" | "cmi5"
  metadata?: ScormMetadata;       // Données de progression sauvegardées
  journeyId?: number;             // ID du parcours
  contentId?: number;             // ID du contenu
  learnerId?: number;             // ID de l'apprenant
}
```

### ScormXApiEvent
**Fichier:** `app/types/entities/xapi.ts`

```typescript
interface ScormXApiEvent {
  type: "INITIALIZED" | "PROGRESSED" | "COMPLETED" | "SUSPENDED" | "TERMINATED" | "PASSED" | "FAILED";
  journeyId: number;
  contentId: number;
  learnerId: number;
  score?: number;
  progress?: number;
  completionStatus?: string;
  successStatus?: string;
  suspendData?: string;
  statement?: XApiStatement;
}
```

## Intégration dans le Store

**Fichier:** `app/stores/courses.ts`

### Fonction buildScormActivity
Détecte et construit l'activité SCORM depuis les données API :

```typescript
function buildScormActivity(data: any): Nullable<ContentActivity["scorm"]> {
  const scormData = data.attributes.specific.scorm;

  // Détection automatique :
  // - Version SCORM (1.2, 2004, cmi5)
  // - Type externe (isExternal, isEcho)
  // - Métadonnées de progression

  return { ... };
}
```

### Détection dans buildContentEntity
```typescript
// Type 12 = SCORM local
// Type 13 = ECHO (SCORM externe)
if (
  data.attributes.specific.type === 12 ||
  data.attributes.specific.type === 13 ||
  data.attributes.specific.scorm
) {
  const scorm = buildScormActivity(data);
  if (scorm) activity = { ...activity, scorm };
}
```

## Événements xAPI

Les statements suivants sont envoyés au backend :

| Événement | Verbe xAPI | Envoyé quand |
|-----------|------------|--------------|
| INITIALIZED | `initialized` | Appel `Initialize()` |
| PROGRESSED | `progressed` | Mise à jour score/progression |
| COMPLETED | `completed` | `completion_status = completed` ou score ≥ 100 |
| PASSED | `passed` | `success_status = passed` |
| FAILED | `failed` | `success_status = failed` |
| SUSPENDED | `suspended` | `exit = suspend` |
| TERMINATED | `suspended` ou `completed` | Appel `Terminate()` |

**Endpoint:** `POST /xapi/statements`

**Payload:**
```json
{
  "statement": { ... },  // xAPI statement complet
  "journey_id": 123,
  "content_id": 456,
  "learner_id": 789
}
```

## Gestion spéciale ECHO

ECHO (type 13) est une plateforme SCORM externe avec restrictions cross-origin fortes.

**Différences:**
1. **useDirectLoad = false** - Force l'utilisation du wrapper
2. **Statements retardés** - Pas de statement sur chaque `SetValue`, uniquement sur `Terminate`
3. **Progression forcée à 100%** - Quand `score >= 100` ou `completion_status = completed`

**Code dans useScormPlayer:**
```typescript
// ECHO special handling: only send statements on Terminate
if (isEcho && statementType !== "COMPLETED" && statementType !== "TERMINATED") {
  logger.log("[SCORM Player] ECHO - Skipping statement until Terminate", { element });
  shouldSendStatement = false;
}
```

## Anti-régression

Protection contre les régressions de score/progression :

```typescript
// Prevent score regression
if (updatedScore < state.score) {
  logger.warn("[SCORM Player] Score regression detected - ignoring");
  return;
}

// Prevent progress regression (except when completed)
if (updatedProgress < state.progress && state.completionStatus !== "completed") {
  logger.warn("[SCORM Player] Progress regression detected - ignoring");
  return;
}
```

## Traductions i18n

**Fichier:** `i18n/locales/fr-FR.json`

```json
{
  "labels": {
    "scorm": {
      "loading": "Chargement du contenu SCORM...",
      "player": "Lecteur SCORM",
      "launch": "Lancer le contenu",
      "error": {
        "title": "Erreur de chargement",
        "description": "Impossible de charger le contenu SCORM..."
      },
      "echo-info": "Ce contenu est hébergé sur une plateforme externe (ECHO)...",
      "external-info": "Ce contenu est hébergé sur une plateforme externe...",
      "completion": {
        "initialized": "Contenu initialisé",
        "progressed": "Progression enregistrée",
        "completed": "Contenu complété avec succès !",
        "passed": "Vous avez réussi !",
        "failed": "Échec de la validation",
        "suspended": "Progression sauvegardée"
      }
    }
  }
}
```

## Utilisation

### Depuis votre backend API

Retournez une activité avec les données SCORM :

```json
{
  "id": 123,
  "attributes": {
    "specific": {
      "type": 12,  // ou 13 pour ECHO
      "scorm": {
        "url": "https://example.com/scorm/launch.html",
        "version": "2004",
        "isExternal": false,
        "isEcho": false,
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
}
```

### Exemple avec ECHO

```json
{
  "attributes": {
    "specific": {
      "type": 13,
      "scorm": {
        "url": "https://echo.platform/content/12345",
        "version": "2004",
        "isExternal": true,
        "isEcho": true,
        "useDirectLoad": false
      }
    }
  }
}
```

## Fichiers créés/modifiés

### Nouveaux fichiers
- ✅ `public/scorm-wrapper.html` - Wrapper HTML avec API SCORM
- ✅ `app/components/course/content/elements/ContentScorm.vue` - Composant lecteur
- ✅ `app/composables/useScormPlayer.ts` - Service SCORM
- ✅ `app/types/entities/xapi.ts` - Types xAPI
- ✅ `docs/SCORM_IMPLEMENTATION.md` - Cette documentation

### Fichiers modifiés
- ✅ `app/types/entities/activity.ts` - Ajout types SCORM
- ✅ `app/types/entities/course.ts` - Import ScormActivity dans ContentActivity
- ✅ `app/stores/courses.ts` - Ajout buildScormActivity + détection
- ✅ `app/components/course/content/ContentDetails.vue` - Import + rendu ContentScorm
- ✅ `i18n/locales/fr-FR.json` - Traductions SCORM

## Tests

Pour tester l'implémentation :

1. **Créer un contenu SCORM de test** via votre backend
2. **Vérifier les logs navigateur** - Tous les événements SCORM sont loggés
3. **Tester les différents scénarios:**
   - SCORM 1.2 local
   - SCORM 2004 local
   - SCORM externe (ECHO)
   - Progression/complétion
   - Suspend/Resume
   - Score tracking

## Debugging

### Activer les logs détaillés

Dans `ContentScorm.vue`, mettre `v-if="true"` sur le bloc debug :

```vue
<div
  v-if="true && debugInfo"  <!-- Changez false en true -->
  class="mt-4 p-4 bg-muted rounded-lg text-xs font-mono"
>
  <p><strong>Initialized:</strong> {{ debugInfo.initialized }}</p>
  <p><strong>Score:</strong> {{ debugInfo.score }}</p>
  <!-- ... -->
</div>
```

### Vérifier la communication

Ouvrez la console navigateur :
- `[SCORM Wrapper]` - Logs du wrapper HTML
- `[SCORM Bridge]` - Logs du bridge injecté
- `[SCORM Player]` - Logs du composable
- `[ContentScorm]` - Logs du composant

## Limitations connues

1. **Cross-origin strict** - Contenu ECHO/externe ne peut pas être injecté avec bridge
2. **Single iframe** - Un seul contenu SCORM par page
3. **Browser compatibility** - Requiert support `postMessage` et `srcdoc`

## Support navigateurs

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ IE11 non supporté

## Améliorations futures

- [ ] Support multi-iframe (plusieurs contenus SCORM simultanés)
- [ ] Offline mode avec localStorage
- [ ] Analytics dashboard (graphiques progression)
- [ ] Import/export packages SCORM
- [ ] Player controls avancés (pause, restart)
- [ ] Support SCORM Cloud API

---

**Documentation créée le:** 2026-01-28
**Version:** 1.0.0
**Auteur:** Claude Code
**Statut:** ✅ Production Ready
