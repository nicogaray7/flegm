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

  termsPage: {
    title: "Conditions d'utilisation",
    metaDescription: "Conditions d'utilisation de Flegm — les r\u00e8gles d'usage de la plateforme.",
    lastUpdated: "Derni\u00e8re mise \u00e0 jour : f\u00e9vrier 2026",
    tldrHeading: "En bref",
    tldrBody:
      "Flegm est une plateforme communautaire pour partager et d\u00e9couvrir des vid\u00e9os YouTube. Reste cool, pas de spam, respecte les autres. On peut supprimer du contenu ou des comptes qui ne respectent pas ces r\u00e8gles. C'est tout.",
    section1Heading: "1. Qu'est-ce que Flegm",
    section1Body:
      'Flegm (\u00ab\u00a0nous\u00a0\u00bb, \u00ab\u00a0la plateforme\u00a0\u00bb) est un classement de vid\u00e9os YouTube pilot\u00e9 par la communaut\u00e9. Tu peux poster des vid\u00e9os, voter pour elles et commenter. On n\'h\u00e9berge aucun contenu vid\u00e9o — tout passe par YouTube.',
    section2Heading: "2. Ton compte",
    section2Li1: "Tu dois te connecter (Google ou email) pour poster, voter ou commenter.",
    section2Li2: "Tu es responsable de ton compte. Garde tes identifiants en s\u00e9curit\u00e9.",
    section2Li3: "Un compte par personne. Pas de comptes alternatifs pour tricher au classement.",
    section2Li4: "On peut suspendre ou supprimer les comptes qui ne respectent pas ces conditions.",
    section3Heading: "3. R\u00e8gles de la communaut\u00e9",
    section3Intro: "Reste cool. Ne pas\u00a0:",
    section3Li1: "Spammer, s'auto-promouvoir abusivement ou utiliser des bots",
    section3Li2: "Publier du contenu haineux, violent ou ill\u00e9gal",
    section3Li3: "Harceler d'autres utilisateurs dans les commentaires",
    section3Li4: "Tenter de manipuler les votes ou le classement",
    section3Li5: "Usurper l'identit\u00e9 d'autrui ou se faire passer pour quelqu'un d'autre",
    section3Outro:
      "On mod\u00e8re le contenu via un scoring de risque automatis\u00e9 et peut mettre des commentaires en attente. On se r\u00e9serve le droit de supprimer tout contenu \u00e0 notre discr\u00e9tion.",
    section4Heading: "4. Contenu que tu partages",
    section4Li1: "Tu ne peux partager que des vid\u00e9os YouTube accessibles au public.",
    section4Li2: "En postant une vid\u00e9o, tu partages un lien — tu ne revendiques pas la propri\u00e9t\u00e9 de ce contenu.",
    section4Li3: "Tes commentaires t'appartiennent. Tu accordes \u00e0 Flegm le droit de les afficher sur la plateforme.",
    section4Li4: "On peut supprimer tout contenu qui viole ces conditions ou qu'on juge nuisible.",
    section5Heading: "5. Ce qu'on fournit (et ce qu'on ne fournit pas)",
    section5Li1: "Flegm est fourni \u00ab\u00a0tel quel\u00a0\u00bb. On fait de notre mieux mais on ne garantit pas la disponibilit\u00e9 ou la perfection.",
    section5Li2: "On n'est pas responsables du contenu des vid\u00e9os YouTube partag\u00e9es sur la plateforme.",
    section5Li3: "On peut modifier, mettre \u00e0 jour ou arr\u00eater des fonctionnalit\u00e9s \u00e0 tout moment.",
    section5Li4: "On n'est pas responsables des dommages li\u00e9s \u00e0 l'utilisation (ou \u00e0 l'impossibilit\u00e9 d'utiliser) Flegm.",
    section6Heading: "6. Propri\u00e9t\u00e9 intellectuelle",
    section6Body:
      "Le nom Flegm, le logo et le design nous appartiennent. Les vid\u00e9os YouTube appartiennent \u00e0 leurs cr\u00e9ateurs. Tu conserves la propri\u00e9t\u00e9 de tes commentaires mais nous en accordes une licence d'affichage sur la plateforme.",
    section7Heading: "7. Modifications des conditions",
    section7Body:
      "On peut mettre \u00e0 jour ces conditions de temps en temps. En cas de changement important, on t'en informera. Continuer \u00e0 utiliser Flegm apr\u00e8s modification vaut acceptation.",
    section8Heading: "8. Contact",
    section8Body: "Des questions\u00a0? \u00c9cris-nous \u00e0",
    seeAlso: "Voir aussi\u00a0:",
    privacyPolicy: "Politique de confidentialit\u00e9",
    cookiePolicy: "Politique des cookies",
  },

  privacyPage: {
    title: "Politique de confidentialit\u00e9",
    metaDescription: "Politique de confidentialit\u00e9 de Flegm — comment on traite tes donn\u00e9es.",
    lastUpdated: "Derni\u00e8re mise \u00e0 jour : f\u00e9vrier 2026",
    tldrHeading: "En bref",
    tldrBody:
      "On collecte le strict n\u00e9cessaire pour faire tourner Flegm — tes infos de connexion, ce que tu fais sur la plateforme et des analytics de base. On ne vend jamais tes donn\u00e9es.",
    section1Heading: "1. Ce qu'on collecte",
    accountInfo: "Infos de compte",
    accountInfoIntro: "Quand tu te connectes, on re\u00e7oit\u00a0:",
    googleSignIn: "Connexion Google\u00a0:",
    googleSignInDetail: "nom, email et photo de profil",
    emailSignIn: "Connexion email\u00a0:",
    emailSignInDetail: "uniquement ton adresse email",
    accountInfoOutro: "C'est g\u00e9r\u00e9 par Supabase Auth. On stocke ton profil (pseudo, avatar) pour que le site fonctionne.",
    yourActivity: "Ton activit\u00e9",
    yourActivityLi1: "Les vid\u00e9os que tu postes",
    yourActivityLi2: "Les vid\u00e9os pour lesquelles tu votes",
    yourActivityLi3: "Les commentaires que tu postes",
    yourActivityOutro: "C'est visible par les autres — c'est le principe de la plateforme.",
    analytics: "Analytics",
    analyticsIntro:
      "On utilise Google Analytics\u00a04 pour comprendre comment les gens utilisent Flegm (pages vues, clics, connexions). GA peut collecter\u00a0:",
    analyticsLi1: "Ton adresse IP (anonymis\u00e9e par Google)",
    analyticsLi2: "Type de navigateur et infos appareil",
    analyticsLi3: "Les pages que tu visites et le temps passé",
    analyticsLi4: "La source de r\u00e9f\u00e9rence (comment tu nous as trouv\u00e9s)",
    cookies: "Cookies",
    cookiesIntro: "On utilise des cookies pour\u00a0:",
    necessary: "N\u00e9cessaires\u00a0:",
    necessaryDetail: "te garder connect\u00e9 (session Supabase) et enregistrer ton choix de consentement",
    analyticsCat: "Analytics\u00a0:",
    analyticsCatDetail: "cookies Google Analytics pour les habitudes d'utilisation (opt-in)",
    marketing: "Marketing\u00a0:",
    marketingDetail: "cookies publicit\u00e9 et reciblage (opt-in)",
    cookiesOutro: "Les cookies analytics et marketing ne sont d\u00e9pos\u00e9s qu'apr\u00e8s ton consentement. Tu peux g\u00e9rer tes pr\u00e9f\u00e9rences \u00e0 tout moment sur notre",
    cookiePolicyPage: "Politique des cookies",
    page: ".",
    section2Heading: "2. Comment on utilise tes donn\u00e9es",
    section2Li1: "Faire tourner Flegm — afficher ton profil, tes votes et commentaires",
    section2Li2: "S\u00e9curiser la plateforme — notre mod\u00e9ration score les commentaires \u00e0 risque",
    section2Li3: "Comprendre l'usage — les analytics nous aident \u00e0 am\u00e9liorer l'exp\u00e9rience",
    section2Li4: "T'envoyer les liens de connexion si tu utilises l'auth email",
    section3Heading: "3. Qui voit tes donn\u00e9es",
    section3Li1: "Les autres utilisateurs\u00a0: pseudo, avatar, vid\u00e9os post\u00e9es, votes et commentaires sont publics",
    section3Li2: "Supabase\u00a0: h\u00e9berge notre base et l'authentification",
    section3Li3: "Google\u00a0: fournit Analytics et la connexion OAuth",
    section3Li4: "Vercel\u00a0: h\u00e9berge le site",
    section3Li5: "Resend\u00a0: envoie les emails de connexion et alertes de mod\u00e9ration",
    section3Outro: "On ne vend, ne loue ni ne partage tes donn\u00e9es personnelles avec des annonceurs ou courtiers en donn\u00e9es. Point.",
    section4Heading: "4. O\u00f9 sont stock\u00e9es tes donn\u00e9es",
    section4Body:
      "Notre infrastructure est h\u00e9berg\u00e9e sur Supabase (cloud) et Vercel. Tes donn\u00e9es peuvent \u00eatre trait\u00e9es aux \u00c9tats-Unis ou dans l'UE selon le service. Toutes les connexions sont en HTTPS.",
    section5Heading: "5. Dur\u00e9e de conservation",
    accountData: "Donn\u00e9es de compte\u00a0:",
    accountDataDetail: "tant que ton compte existe",
    videosComments: "Vid\u00e9os et commentaires\u00a0:",
    videosCommentsDetail: "tant que le contenu est sur la plateforme",
    analyticsRetention: "Analytics\u00a0:",
    analyticsRetentionDetail: "selon les politiques de r\u00e9tention par d\u00e9faut de Google",
    section5Outro:
      "Si tu supprimes ton compte, on supprime tes donn\u00e9es personnelles. Le contenu public (commentaires, vid\u00e9os post\u00e9es) peut rester anonymis\u00e9.",
    section6Heading: "6. Tes droits",
    section6Intro: "Tu peux\u00a0:",
    access: "Acc\u00e9der \u00e0 tes donn\u00e9es — nous demander ce qu'on poss\u00e8de",
    delete: "Supprimer ton compte — \u00e9cris-nous et on tout efface",
    export: "Exporter tes donn\u00e9es — on peut te fournir ce qu'on stocke",
    optOutBeforeLink: "Refuser les analytics — utilise la ",
    optOutAfterLink: " ou une extension de navigateur",
    section6Outro: "Si tu es dans l'UE, tu b\u00e9n\u00e9ficies de droits suppl\u00e9mentaires (RGPD\u00a0: rectification, limitation, portabilit\u00e9, opposition). Contacte-nous.",
    section7Heading: "7. Mineurs",
    section7Body:
      "Flegm n'est pas con\u00e7u pour les moins de 13\u00a0ans. On ne collecte pas sciemment de donn\u00e9es d'enfants. Si tu as moins de 13\u00a0ans, n'utilise pas la plateforme.",
    section8Heading: "8. Modifications de cette politique",
    section8Body:
      "On peut mettre \u00e0 jour cette politique au fil de l'\u00e9volution de Flegm. En cas de changement important, on t'en informera. La date \u00ab\u00a0derni\u00e8re mise \u00e0 jour\u00a0\u00bb en haut refl\u00e8te toujours la version en vigueur.",
    section9Heading: "9. Contact",
    section9Body: "Des questions sur tes donn\u00e9es\u00a0? \u00c9cris-nous \u00e0",
    seeAlso: "Voir aussi\u00a0:",
    termsOfUse: "Conditions d'utilisation",
  },

  cookiesPage: {
    title: "Politique des cookies",
    metaDescription: "Politique des cookies de Flegm — quels cookies on utilise et pourquoi.",
    lastUpdated: "Derni\u00e8re mise \u00e0 jour : f\u00e9vrier 2026",
    tldrHeading: "En bref",
    tldrBody:
      "On utilise des cookies pour te garder connect\u00e9, comprendre comment tu utilises Flegm et (si tu acceptes) pour le marketing. Tu peux modifier tes pr\u00e9f\u00e9rences \u00e0 tout moment.",
    section1Heading: "1. Qu'est-ce qu'un cookie\u00a0?",
    section1Body:
      "Les cookies sont de petits fichiers texte stock\u00e9s sur ton appareil quand tu visites un site. Ils permettent de m\u00e9moriser tes pr\u00e9f\u00e9rences, de te garder connect\u00e9 et de comprendre comment tu interagis avec la plateforme.",
    section2Heading: "2. Cookies utilis\u00e9s",
    tableCategory: "Cat\u00e9gorie",
    tablePurpose: "Finalit\u00e9",
    tableOptOut: "Opt-out possible\u00a0?",
    necessaryRow: "N\u00e9cessaires",
    necessaryPurpose:
      "Authentification (session Supabase), jetons de s\u00e9curit\u00e9, pr\u00e9f\u00e9rence de consentement. Le site ne peut pas fonctionner sans.",
    no: "Non",
    analyticsRow: "Analytics",
    analyticsPurpose:
      "Google Analytics\u00a04 — pages vues, clics, \u00e9v\u00e9nements de connexion, habitudes. Pour comprendre ce qui fonctionne.",
    yes: "Oui",
    marketingRow: "Marketing",
    marketingPurpose:
      "Cookies publicit\u00e9, pixels de reciblage, personnalisation. Pour afficher des annonces pertinentes et mesurer l'efficacit\u00e9 des campagnes.",
    section3Heading: "3. Cookies d\u00e9taill\u00e9s",
    tableCookie: "Cookie",
    tableProvider: "Fournisseur",
    tableDuration: "Dur\u00e9e",
    section4Heading: "4. Google Consent Mode v2",
    section4Body:
      "On utilise Google Consent Mode v2 pour respecter tes choix. Quand tu refuses les cookies analytics ou marketing, les scripts Google tournent en mode respectueux de la vie priv\u00e9e — pas de cookies identifiants, uniquement des pings agr\u00e9g\u00e9s. \u00c7a permet \u00e0 Google de fournir une mod\u00e9lisation basique sans te suivre individuellement.",
    section5Heading: "5. Gestion de tes pr\u00e9f\u00e9rences",
    section5Intro:
      "Tu peux modifier tes pr\u00e9f\u00e9rences cookies \u00e0 tout moment via le bouton ci-dessous ou les param\u00e8tres de ton navigateur.",
    section5Outro:
      "La plupart des navigateurs permettent aussi de bloquer ou supprimer les cookies. Bloquer les cookies n\u00e9cessaires peut emp\u00eacher le site de fonctionner correctement.",
    section6Heading: "6. Cookies tiers",
    section6Body:
      "Certains cookies sont d\u00e9pos\u00e9s par des services tiers que nous utilisons (Google Analytics, Google Ads). Ces services ont leurs propres politiques de confidentialit\u00e9\u00a0:",
    googlePrivacy: "Politique de confidentialit\u00e9 Google",
    gaOptout: "Module de d\u00e9sactivation Google Analytics",
    section7Heading: "7. Contact",
    section7Body: "Questions sur nos cookies\u00a0? \u00c9cris \u00e0",
    privacyPolicy: "Politique de confidentialit\u00e9",
    termsOfUse: "Conditions d'utilisation",
  },
};

export default fr;
