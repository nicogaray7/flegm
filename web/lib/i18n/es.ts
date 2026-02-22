import type { Dictionary } from "./en";

const es: Dictionary = {
  nav: {
    home: "Inicio",
    trending: "Tendencias",
    leaderboard: "Ranking",
    dropAVideo: "Subir un video",
    allTimeBest: "Los mejores",
    about: "Acerca de",
    terms: "T\u00e9rminos",
    privacy: "Privacidad",
    cookies: "Cookies",
  },

  footer: {
    tagline: "el ranking de youtube comunitario",
    language: "Idioma",
  },

  home: {
    communityPowered: "impulsado por la comunidad",
    heroTitle: "El ranking de",
    heroTitleHighlight: "YouTube",
    heroSubtitle:
      "Sube videos increíbles, vota por los mejores y descubre lo que la comunidad ama",
    today: "hoy",
    thisWeek: "esta semana",
    thisMonth: "este mes",
    droppingToday: "Subidos hoy",
    yesterday: "Ayer",
    sectionThisWeek: "Esta semana",
    sectionThisMonth: "Este mes",
    emptyToday:
      "Nada a\u00fan \u2014 s\u00e9 el primero en subir algo incre\u00edble",
    emptyYesterday: "Sin videos de ayer.",
    emptyWeek: "Sin videos de la semana pasada.",
    emptyMonth: "Sin videos del mes pasado.",
    videosDroppedWeek: (count: number) =>
      `${count} video${count !== 1 ? "s" : ""} subido${count !== 1 ? "s" : ""} esta semana`,
    videosDroppedMonth: (count: number) =>
      `${count} video${count !== 1 ? "s" : ""} subido${count !== 1 ? "s" : ""} este mes`,
    dbError: (err: string) =>
      `No se pudieron cargar los videos: ${err}. Verifica DATABASE_URL en .env.local y ejecuta npm run db:push si es necesario.`,
  },

  leaderboard: {
    title: "Ranking",
    subtitle: "Top 100 videos votados por la comunidad",
    empty: "\u00a1A\u00fan no hay videos. S\u00e9 el primero en subir uno!",
    dbError: (err: string) =>
      `No se pudo cargar el ranking: ${err}. Verifica DATABASE_URL y ejecuta npm run db:push si es necesario.`,
    somethingWrong: "Algo sali\u00f3 mal.",
  },

  trending: {
    title: "Tendencias",
    subtitle:
      "Los videos de YouTube m\u00e1s populares de las \u00faltimas 24 horas, votados por la comunidad",
    empty: "A\u00fan no hay videos en tendencia hoy.",
    emptyLink: "\u00a1S\u00e9 el primero en subir uno!",
    navTrending: "Tendencias",
    navThisWeek: "Esta semana",
    navThisMonth: "Este mes",
    navAllTime: "Todos los tiempos",
    navLeaderboard: "Ranking",
    whatIsTitle: "\u00bfQu\u00e9 es Flegm Tendencias?",
    whatIsText:
      "Flegm Tendencias muestra los videos de YouTube que est\u00e1n recibiendo m\u00e1s amor de la comunidad ahora mismo. A diferencia de las recomendaciones algor\u00edtmicas, estas selecciones son 100\u00a0% impulsadas por la comunidad \u2014 personas reales subiendo y votando por los videos que creen que valen la pena. Actualizado continuamente durante todo el d\u00eda.",
  },

  topWeek: {
    title: "Top de la semana",
    subtitle:
      "Los mejores videos de YouTube de los \u00faltimos 7 d\u00edas, clasificados por votos de la comunidad",
    empty: "A\u00fan no hay videos esta semana.",
    emptyLink: "\u00a1Sube el primero!",
    seoTitle: "Rankings semanales de videos YouTube",
    seoText:
      "Cada semana, la comunidad de Flegm descubre y clasifica los mejores videos de YouTube. No son selecciones algor\u00edtmicas \u2014 son seleccionados por espectadores reales que suben videos que aman y votan por los que vale la pena ver. Vuelve cada semana para ver qu\u00e9 est\u00e1 subiendo.",
  },

  topMonth: {
    title: "Top del mes",
    subtitle:
      "Los mejores videos de YouTube de los \u00faltimos 30 d\u00edas, clasificados por la comunidad",
    empty: "A\u00fan no hay videos este mes.",
    emptyLink: "\u00a1Sube el primero!",
    seoTitle: "Rankings mensuales de videos YouTube",
    seoText:
      "Descubre qu\u00e9 videos de YouTube dominaron el mes. Los rankings mensuales de Flegm te dan una instant\u00e1nea del contenido que la comunidad m\u00e1s am\u00f3 en los \u00faltimos 30 d\u00edas \u2014 desde \u00e9xitos virales hasta joyas ocultas que merec\u00edan m\u00e1s atenci\u00f3n.",
  },

  topAllTime: {
    title: "Los mejores",
    subtitle:
      "Los mejores videos de YouTube jam\u00e1s clasificados en Flegm, votados por la comunidad",
    empty: "A\u00fan no hay videos.",
    emptyLink: "\u00a1S\u00e9 el primero en subir uno!",
    seoTitle: "El ranking definitivo de videos YouTube",
    seoText:
      "Esta es la lista definitiva \u2014 cada video que se ha subido a Flegm, clasificado por votos totales de la comunidad. Desde sensaciones virales hasta joyas subestimadas, estos son los videos que resistieron la prueba del tiempo y ganaron la aprobaci\u00f3n de la comunidad.",
  },

  submit: {
    title: "Subir un video",
    subtitle:
      "Pega un enlace de YouTube y deja que la comunidad decida si es incre\u00edble",
    label: "URL de YouTube",
    placeholder: "https://www.youtube.com/watch?v=...",
    buttonSubmit: "Subir",
    buttonSubmitting: "Subiendo...",
    signInToSubmit: "Inicia sesi\u00f3n para subir un video",
    signInToUpvote: "Inicia sesi\u00f3n para votar por tus favoritos",
    signInToComment: "Inicia sesi\u00f3n para unirte a la conversaci\u00f3n",
  },

  auth: {
    welcomeTo: "Bienvenido a Flegm",
    signInTo: "Inicia sesi\u00f3n en Flegm",
    logInTo: "Inicia sesi\u00f3n en Flegm",
    or: "o",
    continueWithGoogle: "Continuar con Google",
    signInWithGoogle: "Iniciar sesi\u00f3n con Google",
    continueWithEmail: "Continuar con Email",
    sending: "Enviando...",
    checkEmail: "Revisa tu email para el enlace de inicio de sesi\u00f3n",
    emailPlaceholder: "tu@ejemplo.com",
    byContAccept: "Al continuar, aceptas nuestros",
    termsOfUse: "T\u00e9rminos de uso",
    and: "y",
    privacyPolicy: "Pol\u00edtica de privacidad",
    redirecting: "Redirigiendo...",
    signOut: "Cerrar sesi\u00f3n",
    signingOut: "Cerrando sesi\u00f3n\u2026",
  },

  video: {
    comments: "Comentarios",
    joinConvo: "\u00danete a la conversaci\u00f3n",
    noComments:
      "A\u00fan no hay comentarios. S\u00e9 el primero en dar tu opini\u00f3n",
    viewChannel: "Ver canal",
    posting: "Publicando...",
    post: "Publicar",
    cancel: "Cancelar",
    replyTo: (author: string) => `Responder a ${author}...`,
    shareThoughts: "Comparte lo que piensas...",
    reply: "Responder",
  },

  channel: {
    videosOnFlegm: (count: number) =>
      `${count} video${count !== 1 ? "s" : ""} en Flegm`,
    videos: "Videos",
  },

  banner: {
    videoAdded: "\u00a1Video a\u00f1adido! Comp\u00e1rtelo con tus amigos",
    copyLink: "Copiar enlace",
    copied: "\u00a1Copiado!",
    dismiss: "Cerrar",
  },

  cookie: {
    message:
      "Usamos cookies para mejorar tu experiencia, medir el rendimiento del sitio y mostrar contenido relevante.",
    cookiePolicy: "Pol\u00edtica de cookies",
    acceptAll: "Aceptar todo",
    rejectAll: "Rechazar todo",
    manage: "Gestionar",
    preferences: "Preferencias de cookies",
    necessary: "Necesarias",
    necessaryDesc: "Autenticaci\u00f3n, seguridad, funciones esenciales",
    alwaysOn: "Siempre activas",
    analytics: "An\u00e1lisis",
    analyticsDesc: "Google Analytics, p\u00e1ginas vistas, patrones de uso",
    marketing: "Marketing",
    marketingDesc: "Anuncios, retargeting, contenido personalizado",
    savePreferences: "Guardar",
    back: "Volver",
  },

  notFound: {
    title: "P\u00e1gina no encontrada",
    text: "La p\u00e1gina que buscas no existe.",
    backHome: "Volver al inicio",
  },

  about: {
    title: "Acerca de",
    titleHighlight: "Flegm",
    subtitle: "El ranking de YouTube impulsado por la comunidad",
    whatIsTitle: "\u00bfQu\u00e9 es Flegm?",
    whatIsText1:
      "Flegm es una plataforma donde la comunidad decide qu\u00e9 videos de YouTube merecen estar en el spotlight. Sin algoritmo, sin curaci\u00f3n corporativa \u2014 solo personas reales compartiendo y votando por los videos que aman.",
    whatIsText2:
      "Pi\u00e9nsalo como un chart de YouTube vivo, impulsado por el gusto, no por la ciencia de datos.",
    howItWorksTitle: "C\u00f3mo funciona",
    step1Title: "Sube un video",
    step1Text:
      "Pega cualquier URL de YouTube y est\u00e1 instant\u00e1neamente en vivo en Flegm.",
    step2Title: "Vota",
    step2Text:
      "\u00bfVes algo genial? Dale al bot\u00f3n de votar. Cuantos m\u00e1s votos tenga un video, m\u00e1s alto sube.",
    step3Title: "Descubre",
    step3Text: "Explora",
    step3TrendingVideos: "las tendencias",
    step3The: "el",
    step3LeaderboardLink: "ranking",
    step3Or: "o",
    step3AllTime: "los mejores de todos los tiempos",
    step4Title: "Comenta",
    step4Text:
      "Deja comentarios y \u00fanete a la conversaci\u00f3n sobre cada video.",
    whyTitle: "\u00bfPor qu\u00e9 Flegm?",
    communityDriven: "Impulsado por la comunidad",
    communityDrivenDesc:
      "El ranking se basa 100\u00a0% en los votos de la comunidad, no en algoritmos",
    realTime: "Tiempo real",
    realTimeDesc:
      "Mira qu\u00e9 est\u00e1 de moda ahora, actualizado continuamente",
    hiddenGems: "Descubre joyas ocultas",
    hiddenGemsDesc:
      "Encuentra videos que el algoritmo de YouTube no te mostrar\u00e1",
    realConversations: "Conversaciones reales",
    realConversationsDesc:
      "Comenta videos con personas que realmente los ven",
    faqTitle: "Preguntas frecuentes",
    faqFreeQ: "\u00bfEs Flegm gratis?",
    faqFreeA:
      "S\u00ed, Flegm es completamente gratis. Navega, sube videos, vota y comenta sin costo alguno.",
    faqDiffQ: "\u00bfEn qu\u00e9 se diferencia de YouTube Tendencias?",
    faqDiffA:
      "La p\u00e1gina de tendencias de YouTube est\u00e1 controlada por un algoritmo que favorece a los grandes canales y anunciantes. Los rankings de Flegm son puramente comunitarios.",
    faqAnyQ: "\u00bfPuedo subir cualquier video de YouTube?",
    faqAnyA:
      "S\u00ed, cualquier video p\u00fablico de YouTube puede compartirse en Flegm. Solo pega la URL y est\u00e1 en vivo instant\u00e1neamente.",
    faqAccountQ: "\u00bfNecesito una cuenta?",
    faqAccountA:
      "Puedes navegar sin cuenta. Para subir videos, votar o comentar, inicia sesi\u00f3n con Google o email.",
    readyDiscover: "\u00bfListo para descubrir algo incre\u00edble?",
    browseVideos: "Ver videos",
  },
};

export default es;
