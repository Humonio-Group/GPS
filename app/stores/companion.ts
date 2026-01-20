import type { Nullable } from "~/types/primitives/objects";

interface CompanionState {
  conversations: any[];
  selectedConversationId: Nullable<number>;
  loading: {
    list: boolean;
    item: boolean;
    thinking: boolean;
    answering: boolean;
    sending: boolean;
  };
}

export const useCompanionStore = defineStore("companion", {
  state: (): CompanionState => ({
    conversations: [
      {
        id: 1,
        slug: "abc",
        title: "A, B ou C",
        messages: [
          {
            message: "Bonjour ! 👋 Comment puis-je vous aider aujourd'hui ?",
            author: "agent",
          },
          {
            message: "J'ai besoin d'aide pour configurer mon compte.",
            author: "user",
          },
          {
            message: "Pas de problème ! Voici les étapes pour configurer votre compte :\n\n1. **Créer votre profil**\n   - Accédez à *Paramètres > Profil*\n   - Remplissez vos informations personnelles\n\n2. **Configurer vos préférences**\n   - Choisissez votre langue\n   - Définissez vos notifications\n\n3. **Sécuriser votre compte**\n   - Activez l'authentification à deux facteurs\n   - Créez un mot de passe fort\n\nAvez-vous des questions sur l'une de ces étapes ?",
            author: "agent",
          },
          {
            message: "Comment activer l'authentification à deux facteurs ?",
            author: "user",
          },
          {
            message: "Excellente question ! Voici comment activer la **2FA** :\n\n```bash\n1. Allez dans Paramètres > Sécurité\n2. Cliquez sur \"Activer la 2FA\"\n3. Scannez le QR code avec votre application\n```\n\n> ⚠️ **Important** : Conservez vos codes de récupération dans un endroit sûr !\n\nApplications recommandées :\n- Google Authenticator\n- Authy\n- Microsoft Authenticator\n\nBesoin d'aide supplémentaire ?",
            author: "agent",
          },
          {
            message: "Non merci, c'est parfait !",
            author: "user",
          },
          {
            message: "Super ! 🎉\n\nN'hésitez pas à revenir si vous avez d'autres questions.\n\n---\n\n*Bonne journée !*",
            author: "agent",
          },
        ],
      },
      {
        id: 2,
        slug: "xyz",
        title: "X, Y ou Z",
        messages: [
          {
            message: "Bonjour ! Je suis là pour vous aider à démarrer votre projet. De quoi avez-vous besoin aujourd'hui ?",
            author: "agent",
          },
          {
            message: "Je voudrais créer une application web pour gérer les tâches de mon équipe.",
            author: "user",
          },
          {
            message: "Excellent projet ! Pour mieux vous aider, j'ai quelques questions :\n\n**Questions importantes :**\n1. Combien de personnes utiliseront l'application ?\n2. Avez-vous déjà une stack technique en tête ?\n3. Quelles sont les fonctionnalités principales souhaitées ?\n\nCela me permettra de vous proposer une architecture adaptée.",
            author: "agent",
          },
          {
            message: "On sera environ 20 personnes. Je pensais utiliser React et Node.js. Pour les fonctionnalités : créer des tâches, les assigner, suivre leur progression et avoir un tableau de bord.",
            author: "user",
          },
          {
            message: "Parfait ! Voici une proposition d'architecture pour votre projet :\n\n## Stack technique recommandée\n\n**Frontend :**\n- ⚛️ React avec TypeScript\n- 🎨 TailwindCSS pour le design\n- 📊 Recharts pour le tableau de bord\n- 🔄 React Query pour la gestion d'état\n\n**Backend :**\n- 🟢 Node.js + Express\n- 🗄️ PostgreSQL (base de données)\n- 🔐 JWT pour l'authentification\n- 📧 Nodemailer pour les notifications\n\n## Fonctionnalités principales\n\n1. **Gestion des tâches**\n   - Création, édition, suppression\n   - Statuts : `À faire`, `En cours`, `Terminé`\n   - Priorités : Haute, Moyenne, Basse\n\n2. **Assignation**\n   - Assigner à un ou plusieurs membres\n   - Notifications par email\n\n3. **Tableau de bord**\n   - Vue d'ensemble des tâches\n   - Statistiques par membre\n   - Graphiques de progression\n\nQu'en pensez-vous ?",
            author: "agent",
          },
          {
            message: "C'est vraiment bien ! Par contre, je ne connais pas PostgreSQL. On peut utiliser MongoDB à la place ?",
            author: "user",
          },
          {
            message: "Absolument ! MongoDB est un excellent choix. Voici comment adapter l'architecture :\n\n## Stack mise à jour\n\n**Backend :**\n- 🟢 Node.js + Express\n- 🍃 **MongoDB** avec Mongoose\n- 🔐 JWT pour l'authentification\n\n### Avantages de MongoDB pour votre projet :\n\n✅ **Flexibilité** : Schéma flexible pour les tâches\n✅ **Simplicité** : Facile à apprendre\n✅ **Performance** : Excellente pour les lectures rapides\n✅ **Évolutivité** : Adapté pour 20+ utilisateurs\n\n### Structure de données suggérée :\n\n```javascript\n// Collection Users\n{\n  _id: ObjectId,\n  name: string,\n  email: string,\n  role: \"admin\" | \"member\"\n}\n\n// Collection Tasks\n{\n  _id: ObjectId,\n  title: string,\n  description: string,\n  status: \"todo\" | \"in_progress\" | \"done\",\n  priority: \"high\" | \"medium\" | \"low\",\n  assignedTo: [ObjectId],\n  createdBy: ObjectId,\n  createdAt: Date,\n  dueDate: Date\n}\n```\n\nVoulez-vous que je vous aide à démarrer avec un modèle de code ?",
            author: "agent",
          },
          {
            message: "Oui, ce serait génial ! Comment je commence ?",
            author: "user",
          },
          {
            message: "Parfait ! Voici un plan d'action étape par étape :\n\n## 🚀 Plan de démarrage\n\n### Phase 1 : Configuration (Jour 1-2)\n\n```bash\n# Backend\n1. Initialiser le projet Node.js\n2. Installer les dépendances (Express, Mongoose, JWT)\n3. Configurer MongoDB Atlas (gratuit)\n4. Créer les modèles de données\n\n# Frontend\n1. Créer l'app React avec Vite\n2. Installer TailwindCSS\n3. Configurer le routing\n```\n\n### Phase 2 : Développement (Jour 3-10)\n\n**Backend :**\n- [ ] API d'authentification (register/login)\n- [ ] CRUD des tâches\n- [ ] Gestion des assignations\n- [ ] Middleware d'autorisation\n\n**Frontend :**\n- [ ] Page de connexion\n- [ ] Liste des tâches\n- [ ] Formulaire de création\n- [ ] Tableau de bord\n\n### Phase 3 : Finalisation (Jour 11-14)\n\n- [ ] Tests\n- [ ] Déploiement\n- [ ] Documentation\n\n---\n\n> 💡 **Conseil** : Commencez par l'authentification, c'est la base de votre app !\n\nVoulez-vous que je vous fournisse le code de démarrage pour le backend ou le frontend en premier ?",
            author: "agent",
          },
          {
            message: "Super plan ! Je vais commencer par le backend. Merci beaucoup !",
            author: "user",
          },
          {
            message: "Avec plaisir ! 🎉\n\n**Ressources utiles :**\n- 📚 [Documentation Mongoose](https://mongoosejs.com/)\n- 🔐 [Guide JWT](https://jwt.io/introduction)\n- 🎓 [Tutoriel Express](https://expressjs.com/)\n\n---\n\nN'hésitez pas à revenir si vous avez des questions pendant le développement. **Bon courage !** 💪",
            author: "agent",
          },
        ],
      },
    ],
    selectedConversationId: null,
    loading: {
      list: false,
      item: false,
      thinking: false,
      answering: false,
      sending: false,
    },
  }),
  getters: {
    api: () => useApi(),
    selectedConversation: state => state.conversations.find(c => c.id === state.selectedConversationId) ?? null,
    canWrite: state => !state.loading.thinking && !state.loading.answering,
  },
  actions: {
    async loadConversations() {
      // todo: load all user's conversations - loic
    },
    async loadConversationMessages() {
      if (!this.selectedConversation) return;

      // todo: load conversation messages - loic
      console.log("loading conversations messages");
    },
    selectConversation(slug?: string) {
      if (!slug) {
        this.selectedConversationId = null;
        return;
      }

      const conversation = this.conversations.find(c => c.slug === slug);

      if (!conversation) return;
      if (this.selectedConversationId === conversation?.id) return;

      this.selectedConversationId = conversation!.id;
      this.loadConversationMessages();
    },

    async createConversation(initialMessage: string, model: string) {
      console.log(initialMessage, model);
    }, // todo: create model ids - loic
    async sendMessage(message: string) {
      if (!this.selectedConversation) return;
      // todo: send message to selected conversation id - loic
      this.selectedConversation.messages.push({
        message,
        author: "user",
      });
      console.log(message);

      this.loading.thinking = true;
      setTimeout(() => this.loading.thinking = false, 5000);
    },
  },
});
