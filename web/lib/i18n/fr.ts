import type { Dictionary } from "./en";

const fr: Dictionary = {
  nav: {
    home: "Accueil",
    trending: "Tendances",
    leaderboard: "Classement",
    dropAVideo: "Poster une vid\u00e9o",
    allTimeBest: "Les meilleurs",
    about: "\u00c0 propos",
    terms: "CGU",
    privacy: "Confidentialit\u00e9",
    cookies: "Cookies",
  },

  footer: {
    tagline: "le classement youtube communautaire",
    language: "Langue",
  },

  home: {
    communityPowered: "port\u00e9 par la communaut\u00e9",
    heroTitle: "Le classement",
    heroTitleHighlight: "YouTube",
    heroSubtitle:
      "Poste des p\u00e9pites, vote pour les meilleures, et d\u00e9couvre ce que la communaut\u00e9 adore",
    today: "aujourd\u2019hui",
    thisWeek: "cette semaine",
    thisMonth: "ce mois",
    droppingToday: "Post\u00e9es aujourd\u2019hui",
    yesterday: "Hier",
    sectionThisWeek: "Cette semaine",
    sectionThisMonth: "Ce mois-ci",
    emptyToday:
      "Rien pour l\u2019instant \u2014 sois le premier \u00e0 poster quelque chose de fou",
    emptyYesterday: "Pas de vid\u00e9os hier.",
    emptyWeek: "Pas de vid\u00e9os la semaine pass\u00e9e.",
    emptyMonth: "Pas de vid\u00e9os le mois dernier.",
    videosDroppedWeek: (count: number) =>
      `${count} vid\u00e9o${count !== 1 ? "s" : ""} post\u00e9e${count !== 1 ? "s" : ""} cette semaine`,
    videosDroppedMonth: (count: number) =>
      `${count} vid\u00e9o${count !== 1 ? "s" : ""} post\u00e9e${count !== 1 ? "s" : ""} ce mois-ci`,
    dbError: (err: string) =>
      `Impossible de charger les vid\u00e9os : ${err}. V\u00e9rifie DATABASE_URL dans .env.local et lance npm run db:push si n\u00e9cessaire.`,
  },

  leaderboard: {
    title: "Classement",
    subtitle: "Top 100 des vid\u00e9os vot\u00e9es par la communaut\u00e9",
    empty: "Pas encore de vid\u00e9os. Sois le premier \u00e0 en poster une !",
    dbError: (err: string) =>
      `Impossible de charger le classement : ${err}. V\u00e9rifie DATABASE_URL et lance npm run db:push si n\u00e9cessaire.`,
    somethingWrong: "Quelque chose s\u2019est mal pass\u00e9.",
  },

  trending: {
    title: "Tendances",
    subtitle:
      "Les vid\u00e9os YouTube les plus populaires des derni\u00e8res 24 heures, vot\u00e9es par la communaut\u00e9",
    empty: "Pas encore de vid\u00e9os en tendance aujourd\u2019hui.",
    emptyLink: "Sois le premier \u00e0 en poster une !",
    navTrending: "Tendances",
    navThisWeek: "Cette semaine",
    navThisMonth: "Ce mois-ci",
    navAllTime: "Tous les temps",
    navLeaderboard: "Classement",
    whatIsTitle: "Qu\u2019est-ce que Flegm Tendances ?",
    whatIsText:
      "Flegm Tendances montre les vid\u00e9os YouTube qui re\u00e7oivent le plus d\u2019amour de la communaut\u00e9 en ce moment. Contrairement aux recommandations algorithmiques, ces choix sont 100\u00a0% port\u00e9s par la communaut\u00e9 \u2014 de vraies personnes qui postent et votent pour les vid\u00e9os qu\u2019elles pensent valoir le d\u00e9tour. Mis \u00e0 jour en continu tout au long de la journ\u00e9e.",
  },

  topWeek: {
    title: "Top de la semaine",
    subtitle:
      "Les meilleures vid\u00e9os YouTube des 7 derniers jours, class\u00e9es par votes de la communaut\u00e9",
    empty: "Pas encore de vid\u00e9os cette semaine.",
    emptyLink: "Poste la premi\u00e8re !",
    seoTitle: "Classement YouTube hebdomadaire",
    seoText:
      "Chaque semaine, la communaut\u00e9 Flegm d\u00e9couvre et classe les meilleures vid\u00e9os YouTube. Ce ne sont pas des choix algorithmiques \u2014 ce sont de vrais spectateurs qui postent les vid\u00e9os qu\u2019ils aiment et votent pour celles qui valent le coup. Reviens chaque semaine pour voir ce qui monte.",
  },

  topMonth: {
    title: "Top du mois",
    subtitle:
      "Les meilleures vid\u00e9os YouTube des 30 derniers jours, class\u00e9es par la communaut\u00e9",
    empty: "Pas encore de vid\u00e9os ce mois-ci.",
    emptyLink: "Poste la premi\u00e8re !",
    seoTitle: "Classement YouTube mensuel",
    seoText:
      "D\u00e9couvre quelles vid\u00e9os YouTube ont domin\u00e9 le mois. Le classement mensuel de Flegm te donne un aper\u00e7u du contenu que la communaut\u00e9 a le plus aim\u00e9 au cours des 30 derniers jours \u2014 des hits viraux aux p\u00e9pites cach\u00e9es qui m\u00e9ritaient plus d\u2019attention.",
  },

  topAllTime: {
    title: "Les meilleurs",
    subtitle:
      "Les plus grandes vid\u00e9os YouTube jamais class\u00e9es sur Flegm, vot\u00e9es par la communaut\u00e9",
    empty: "Pas encore de vid\u00e9os.",
    emptyLink: "Sois le premier \u00e0 en poster une !",
    seoTitle: "Le classement d\u00e9finitif des vid\u00e9os YouTube",
    seoText:
      "Voici la liste ultime \u2014 toutes les vid\u00e9os qui ont \u00e9t\u00e9 post\u00e9es sur Flegm, class\u00e9es par nombre total de votes de la communaut\u00e9. Des sensations virales aux p\u00e9pites sous-estim\u00e9es, ce sont les vid\u00e9os qui ont r\u00e9sist\u00e9 \u00e0 l\u2019\u00e9preuve du temps et gagn\u00e9 l\u2019approbation de la communaut\u00e9.",
  },

  submit: {
    title: "Poster une vid\u00e9o",
    subtitle:
      "Colle un lien YouTube et laisse la communaut\u00e9 d\u00e9cider si c\u2019est du lourd",
    label: "URL YouTube",
    placeholder: "https://www.youtube.com/watch?v=...",
    buttonSubmit: "Poster",
    buttonSubmitting: "Publication...",
    signInToSubmit: "Connecte-toi pour poster une vid\u00e9o",
    signInToUpvote: "Connecte-toi pour voter pour tes favoris",
    signInToComment: "Connecte-toi pour rejoindre la conversation",
  },

  auth: {
    welcomeTo: "Bienvenue sur Flegm",
    signInTo: "Se connecter \u00e0 Flegm",
    logInTo: "Connexion \u00e0 Flegm",
    or: "ou",
    continueWithGoogle: "Continuer avec Google",
    signInWithGoogle: "Se connecter avec Google",
    continueWithEmail: "Continuer avec Email",
    sending: "Envoi...",
    checkEmail: "V\u00e9rifie tes emails pour le lien de connexion",
    emailPlaceholder: "toi@exemple.com",
    byContAccept: "En continuant, tu acceptes nos",
    termsOfUse: "Conditions d\u2019utilisation",
    and: "et",
    privacyPolicy: "Politique de confidentialit\u00e9",
    redirecting: "Redirection...",
    signOut: "D\u00e9connexion",
    signingOut: "D\u00e9connexion\u2026",
  },

  video: {
    comments: "Commentaires",
    joinConvo: "Rejoins la conversation",
    noComments:
      "Pas encore de commentaires. Sois le premier \u00e0 donner ton avis",
    viewChannel: "Voir la cha\u00eene",
    posting: "Publication...",
    post: "Publier",
    cancel: "Annuler",
    replyTo: (author: string) => `R\u00e9pondre \u00e0 ${author}...`,
    shareThoughts: "Partage tes impressions...",
    reply: "R\u00e9pondre",
  },

  channel: {
    videosOnFlegm: (count: number) =>
      `${count} vid\u00e9o${count !== 1 ? "s" : ""} sur Flegm`,
    videos: "Vid\u00e9os",
  },

  banner: {
    videoAdded: "Vid\u00e9o ajout\u00e9e ! Partage-la avec tes amis",
    copyLink: "Copier le lien",
    copied: "Copi\u00e9 !",
    dismiss: "Fermer",
  },

  cookie: {
    message:
      "Nous utilisons des cookies pour am\u00e9liorer ton exp\u00e9rience, mesurer les performances du site et afficher du contenu pertinent.",
    cookiePolicy: "Politique de cookies",
    acceptAll: "Tout accepter",
    rejectAll: "Tout refuser",
    manage: "G\u00e9rer",
    preferences: "Pr\u00e9f\u00e9rences cookies",
    necessary: "N\u00e9cessaires",
    necessaryDesc: "Authentification, s\u00e9curit\u00e9, fonctions essentielles",
    alwaysOn: "Toujours actif",
    analytics: "Analyse",
    analyticsDesc: "Google Analytics, pages vues, habitudes d\u2019utilisation",
    marketing: "Marketing",
    marketingDesc: "Publicit\u00e9s, reciblage, contenu personnalis\u00e9",
    savePreferences: "Enregistrer",
    back: "Retour",
  },

  notFound: {
    title: "Page introuvable",
    text: "La page que tu cherches n\u2019existe pas.",
    backHome: "Retour \u00e0 l\u2019accueil",
  },

  about: {
    title: "\u00c0 propos de",
    titleHighlight: "Flegm",
    subtitle: "Le classement YouTube port\u00e9 par la communaut\u00e9",
    whatIsTitle: "Qu\u2019est-ce que Flegm ?",
    whatIsText1:
      "Flegm est une plateforme o\u00f9 la communaut\u00e9 d\u00e9cide quelles vid\u00e9os YouTube m\u00e9ritent d\u2019\u00eatre mises en avant. Pas d\u2019algorithme, pas de curation corporate \u2014 juste de vraies personnes qui partagent et votent pour les vid\u00e9os qu\u2019elles adorent.",
    whatIsText2:
      "Imagine un classement YouTube vivant, port\u00e9 par le go\u00fbt, pas par la data science.",
    howItWorksTitle: "Comment \u00e7a marche",
    step1Title: "Poste une vid\u00e9o",
    step1Text:
      "Colle n\u2019importe quelle URL YouTube et elle est instantan\u00e9ment en ligne sur Flegm.",
    step2Title: "Vote",
    step2Text:
      "Tu vois quelque chose de g\u00e9nial ? Clique sur le bouton voter. Plus une vid\u00e9o a de votes, plus elle monte.",
    step3Title: "D\u00e9couvre",
    step3Text: "Parcours",
    step3TrendingVideos: "les tendances",
    step3The: "le",
    step3LeaderboardLink: "classement",
    step3Or: "ou",
    step3AllTime: "les meilleurs de tous les temps",
    step4Title: "Discute",
    step4Text:
      "Laisse des commentaires et participe aux discussions autour de chaque vid\u00e9o.",
    whyTitle: "Pourquoi Flegm ?",
    communityDriven: "Port\u00e9 par la communaut\u00e9",
    communityDrivenDesc:
      "Le classement est 100\u00a0% bas\u00e9 sur les votes de la communaut\u00e9, pas sur des algorithmes",
    realTime: "Temps r\u00e9el",
    realTimeDesc: "Vois ce qui est chaud en ce moment, mis \u00e0 jour en continu",
    hiddenGems: "D\u00e9niche les p\u00e9pites",
    hiddenGemsDesc:
      "D\u00e9couvre des vid\u00e9os que l\u2019algorithme de YouTube ne te montrera pas",
    realConversations: "De vraies conversations",
    realConversationsDesc:
      "Discute des vid\u00e9os avec des gens qui les regardent vraiment",
    faqTitle: "Questions fr\u00e9quentes",
    faqFreeQ: "Flegm est-il gratuit ?",
    faqFreeA:
      "Oui, Flegm est enti\u00e8rement gratuit. Navigue, poste des vid\u00e9os, vote et commente sans rien payer.",
    faqDiffQ: "En quoi c\u2019est diff\u00e9rent de YouTube Tendances ?",
    faqDiffA:
      "La page tendances de YouTube est contr\u00f4l\u00e9e par un algorithme qui favorise les grosses cha\u00eenes et les annonceurs. Le classement Flegm est purement communautaire.",
    faqAnyQ: "Je peux poster n\u2019importe quelle vid\u00e9o YouTube ?",
    faqAnyA:
      "Oui, n\u2019importe quelle vid\u00e9o YouTube publique peut \u00eatre partag\u00e9e sur Flegm. Colle l\u2019URL et c\u2019est en ligne instantan\u00e9ment.",
    faqAccountQ: "Ai-je besoin d\u2019un compte ?",
    faqAccountA:
      "Tu peux naviguer sans compte. Pour poster des vid\u00e9os, voter ou commenter, connecte-toi avec Google ou par email.",
    readyDiscover: "Pr\u00eat \u00e0 d\u00e9couvrir quelque chose de g\u00e9nial ?",
    browseVideos: "Voir les vid\u00e9os",
  },
};

export default fr;
