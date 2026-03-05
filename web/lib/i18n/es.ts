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

  termsPage: {
    title: "Condiciones de uso",
    metaDescription: "Condiciones de uso de Flegm — reglas de uso de la plataforma.",
    lastUpdated: "Última actualización: febrero 2026",
    tldrHeading: "En resumen",
    tldrBody:
      "Flegm es una plataforma comunitaria para compartir y descubrir videos de YouTube. Sé genial, no hagas spam y respeta a los demás. Podemos eliminar contenido o cuentas que incumplan estas reglas. Eso es todo.",
    section1Heading: "1. Qué es Flegm",
    section1Body:
      'Flegm ("nosotros", "la plataforma") es un ranking de videos de YouTube impulsado por la comunidad. Puedes subir videos, votar y comentar. No alojamos contenido de video — todo se reproduce a través de YouTube.',
    section2Heading: "2. Tu cuenta",
    section2Li1: "Debes iniciar sesión (con Google o email) para subir videos, votar o comentar.",
    section2Li2: "Eres responsable de tu cuenta. Mantén tus credenciales seguras.",
    section2Li3: "Una cuenta por persona. No crees cuentas alternativas para manipular el ranking.",
    section2Li4: "Podemos suspender o eliminar cuentas que incumplan estas condiciones.",
    section3Heading: "3. Reglas de la comunidad",
    section3Intro: "Mantén la calma. No:",
    section3Li1: "Hacer spam, autopromoción excesiva o usar bots",
    section3Li2: "Publicar contenido odioso, violento o ilegal",
    section3Li3: "Acosar a otros usuarios en los comentarios",
    section3Li4: "Intentar manipular votos o el ranking",
    section3Li5: "Suplantar a otros o falsear tu identidad",
    section3Outro:
      "Moderamos el contenido con puntuación de riesgo automatizada y podemos retener comentarios para revisión. Nos reservamos el derecho de eliminar cualquier contenido a nuestra discreción.",
    section4Heading: "4. Contenido que compartes",
    section4Li1: "Solo puedes compartir videos de YouTube disponibles públicamente.",
    section4Li2: "Al subir un video, compartes un enlace — no reclamas la propiedad de ese contenido.",
    section4Li3: "Tus comentarios son tuyos. Nos concedes permiso a Flegm para mostrarlos en la plataforma.",
    section4Li4: "Podemos eliminar cualquier contenido que incumpla estas condiciones o que consideremos perjudicial.",
    section5Heading: "5. Lo que ofrecemos (y lo que no)",
    section5Li1: 'Flegm se ofrece "tal cual". Hacemos lo posible pero no garantizamos disponibilidad o perfección.',
    section5Li2: "No somos responsables del contenido de los videos de YouTube compartidos en la plataforma.",
    section5Li3: "Podemos cambiar, actualizar o discontinuar funciones en cualquier momento.",
    section5Li4: "No somos responsables de daños por el uso (o la imposibilidad de usar) Flegm.",
    section6Heading: "6. Propiedad intelectual",
    section6Body:
      "El nombre Flegm, el logo y el diseño son nuestros. Los videos de YouTube pertenecen a sus creadores. Conservas la propiedad de tus comentarios pero nos concedes una licencia para mostrarlos en la plataforma.",
    section7Heading: "7. Cambios en estas condiciones",
    section7Body:
      "Podemos actualizar estas condiciones de vez en cuando. Si hacemos cambios importantes, te avisaremos. Seguir usando Flegm tras los cambios implica aceptarlos.",
    section8Heading: "8. Contacto",
    section8Body: "¿Preguntas? Escríbenos a",
    seeAlso: "Ver también:",
    privacyPolicy: "Política de privacidad",
    cookiePolicy: "Política de cookies",
  },

  privacyPage: {
    title: "Política de privacidad",
    metaDescription: "Política de privacidad de Flegm — cómo tratamos tus datos.",
    lastUpdated: "Última actualización: febrero 2026",
    tldrHeading: "En resumen",
    tldrBody:
      "Recogemos lo mínimo necesario para que Flegm funcione — tus datos de acceso, lo que haces en la plataforma y análisis básicos. No vendemos tus datos. Nunca.",
    section1Heading: "1. Qué recogemos",
    accountInfo: "Datos de cuenta",
    accountInfoIntro: "Cuando inicias sesión, obtenemos:",
    googleSignIn: "Inicio con Google:",
    googleSignInDetail: "nombre, email y foto de perfil",
    emailSignIn: "Inicio con email:",
    emailSignInDetail: "solo tu dirección de email",
    accountInfoOutro: "Lo gestiona Supabase Auth. Guardamos tu perfil (nombre de usuario, avatar) para que el sitio funcione.",
    yourActivity: "Tu actividad",
    yourActivityLi1: "Videos que subes",
    yourActivityLi2: "Videos por los que votas",
    yourActivityLi3: "Comentarios que publicas",
    yourActivityOutro: "Es visible para otros usuarios — ese es el objetivo de la plataforma.",
    analytics: "Analíticas",
    analyticsIntro:
      "Usamos Google Analytics 4 para entender cómo se usa Flegm (vistas de página, clics, inicios de sesión). GA puede recoger:",
    analyticsLi1: "Tu dirección IP (anonimizada por Google)",
    analyticsLi2: "Tipo de navegador e información del dispositivo",
    analyticsLi3: "Páginas que visitas y tiempo de permanencia",
    analyticsLi4: "Fuente de referencia (cómo nos encontraste)",
    cookies: "Cookies",
    cookiesIntro: "Usamos cookies para:",
    necessary: "Necesarias:",
    necessaryDetail: "mantener tu sesión (Supabase) y guardar tu preferencia de consentimiento",
    analyticsCat: "Analíticas:",
    analyticsCatDetail: "cookies de Google Analytics para patrones de uso (opt-in)",
    marketing: "Marketing:",
    marketingDetail: "cookies de publicidad y remarketing (opt-in)",
    cookiesOutro: "Las cookies de analíticas y marketing solo se activan tras tu consentimiento. Puedes gestionar tus preferencias en cualquier momento en nuestra",
    cookiePolicyPage: "Política de cookies",
    page: ".",
    section2Heading: "2. Cómo usamos tus datos",
    section2Li1: "Hacer funcionar Flegm — mostrar tu perfil, votos y comentarios",
    section2Li2: "Mantener la plataforma segura — nuestro sistema de moderación puntúa comentarios de riesgo",
    section2Li3: "Entender el uso — las analíticas nos ayudan a mejorar la experiencia",
    section2Li4: "Enviarte enlaces de acceso si usas autenticación por email",
    section3Heading: "3. Quién ve tus datos",
    section3Li1: "Otros usuarios: tu nombre de usuario, avatar, videos subidos, votos y comentarios son públicos",
    section3Li2: "Supabase: aloja nuestra base de datos y la autenticación",
    section3Li3: "Google: proporciona Analytics y el inicio de sesión OAuth",
    section3Li4: "Vercel: aloja el sitio web",
    section3Li5: "Resend: envía emails de acceso y alertas de moderación",
    section3Outro: "No vendemos, alquilamos ni compartimos tus datos personales con anunciantes o intermediarios de datos. Punto.",
    section4Heading: "4. Dónde se almacenan tus datos",
    section4Body:
      "Nuestra infraestructura está alojada en Supabase (cloud) y Vercel. Tus datos pueden procesarse en EE. UU. o la UE según el servicio. Todas las conexiones usan cifrado HTTPS.",
    section5Heading: "5. Cuánto tiempo los conservamos",
    accountData: "Datos de cuenta:",
    accountDataDetail: "mientras tu cuenta exista",
    videosComments: "Videos y comentarios:",
    videosCommentsDetail: "mientras el contenido esté en la plataforma",
    analyticsRetention: "Analíticas:",
    analyticsRetentionDetail: "según las políticas de retención por defecto de Google",
    section5Outro:
      "Si eliminas tu cuenta, borraremos tus datos personales. El contenido público (comentarios, videos subidos) puede quedar anonimizado.",
    section6Heading: "6. Tus derechos",
    section6Intro: "Puedes:",
    access: "Acceder a tus datos — preguntarnos qué tenemos",
    delete: "Eliminar tu cuenta — escríbenos y la borraremos",
    export: "Exportar tus datos — podemos proporcionarte lo que almacenamos",
    optOutBeforeLink: "Excluirte de las analíticas — usa la ",
    optOutAfterLink: " o una extensión del navegador",
    section6Outro: "Si estás en la UE, tienes derechos adicionales según el RGPD (rectificación, restricción, portabilidad, oposición). Contáctanos.",
    section7Heading: "7. Menores",
    section7Body:
      "Flegm no está diseñado para menores de 13 años. No recogemos datos de niños a sabiendas. Si tienes menos de 13 años, no uses la plataforma.",
    section8Heading: "8. Cambios en esta política",
    section8Body:
      "Podemos actualizar esta política a medida que Flegm evolucione. Si hacemos cambios importantes, te avisaremos. La fecha de \"última actualización\" arriba refleja siempre la versión vigente.",
    section9Heading: "9. Contacto",
    section9Body: "¿Preguntas sobre tus datos? Escríbenos a",
    seeAlso: "Ver también:",
    termsOfUse: "Condiciones de uso",
  },

  cookiesPage: {
    title: "Política de cookies",
    metaDescription: "Política de cookies de Flegm — qué cookies usamos y por qué.",
    lastUpdated: "Última actualización: febrero 2026",
    tldrHeading: "En resumen",
    tldrBody:
      "Usamos cookies para mantener tu sesión, entender cómo usas Flegm y (si lo aceptas) para marketing. Puedes cambiar tus preferencias en cualquier momento.",
    section1Heading: "1. Qué son las cookies",
    section1Body:
      "Las cookies son pequeños archivos de texto que se guardan en tu dispositivo al visitar un sitio. Ayudan a recordar preferencias, mantener la sesión y entender cómo interactúas con la plataforma.",
    section2Heading: "2. Cookies que usamos",
    tableCategory: "Categoría",
    tablePurpose: "Finalidad",
    tableOptOut: "¿Puedes excluirte?",
    necessaryRow: "Necesarias",
    necessaryPurpose:
      "Autenticación (sesión Supabase), tokens de seguridad, preferencia de consentimiento. El sitio no funciona sin ellas.",
    no: "No",
    analyticsRow: "Analíticas",
    analyticsPurpose:
      "Google Analytics 4 — vistas de página, clics, inicios de sesión, patrones de uso. Para entender qué funciona.",
    yes: "Sí",
    marketingRow: "Marketing",
    marketingPurpose:
      "Cookies publicitarias, píxeles de remarketing, personalización. Para mostrar anuncios relevantes y medir campañas.",
    section3Heading: "3. Cookies concretas",
    tableCookie: "Cookie",
    tableProvider: "Proveedor",
    tableDuration: "Duración",
    section4Heading: "4. Google Consent Mode v2",
    section4Body:
      "Usamos Google Consent Mode v2 para respetar tus elecciones. Si rechazas cookies de analíticas o marketing, los scripts de Google se cargan en modo respetuoso con la privacidad — no se instalan cookies identificadoras, solo envíos agregados. Así Google puede ofrecer modelado básico sin rastrearte individualmente.",
    section5Heading: "5. Gestionar tus preferencias",
    section5Intro:
      "Puedes cambiar tus preferencias de cookies en cualquier momento con el botón de abajo o en la configuración del navegador.",
    section5Outro:
      "La mayoría de navegadores permiten bloquear o eliminar cookies. Bloquear las necesarias puede impedir que el sitio funcione correctamente.",
    section6Heading: "6. Cookies de terceros",
    section6Body:
      "Algunas cookies las establecen servicios terceros que usamos (Google Analytics, Google Ads). Estos servicios tienen sus propias políticas de privacidad:",
    googlePrivacy: "Política de privacidad de Google",
    gaOptout: "Complemento de exclusión de Google Analytics",
    section7Heading: "7. Contacto",
    section7Body: "¿Preguntas sobre nuestras cookies? Escribe a",
    privacyPolicy: "Política de privacidad",
    termsOfUse: "Condiciones de uso",
  },
};

export default es;
