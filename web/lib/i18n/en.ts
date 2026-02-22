const en = {
  // Nav & Header
  nav: {
    home: "Home",
    trending: "Trending",
    leaderboard: "Leaderboard",
    dropAVideo: "Drop a video",
    allTimeBest: "All-Time Best",
    about: "About",
    terms: "Terms",
    privacy: "Privacy",
    cookies: "Cookies",
  },

  // Footer
  footer: {
    tagline: "the youtube leaderboard",
    language: "Language",
  },

  // Home page
  home: {
    communityPowered: "community-powered",
    heroTitle: "The YouTube",
    heroTitleHighlight: "Leaderboard",
    heroSubtitle: "Drop bangers, upvote the best, and watch what the community is loving rn",
    today: "today",
    thisWeek: "this week",
    thisMonth: "this month",
    droppingToday: "Dropping Today",
    yesterday: "Yesterday",
    sectionThisWeek: "This Week",
    sectionThisMonth: "This Month",
    emptyToday: "Nothing yet today \u2014 be the first to drop something fire",
    emptyYesterday: "No videos from yesterday.",
    emptyWeek: "No videos from the past week.",
    emptyMonth: "No videos from the past month.",
    videosDroppedWeek: (count: number) =>
      `${count} video${count !== 1 ? "s" : ""} dropped this week`,
    videosDroppedMonth: (count: number) =>
      `${count} video${count !== 1 ? "s" : ""} dropped this month`,
    dbError: (err: string) =>
      `Could not load videos: ${err}. Check DATABASE_URL in .env.local and run npm run db:push if needed.`,
  },

  // Leaderboard
  leaderboard: {
    title: "Leaderboard",
    subtitle: "Top 100 videos voted by the community",
    empty: "No videos yet. Be the first to drop one!",
    dbError: (err: string) =>
      `Could not load leaderboard: ${err}. Check DATABASE_URL and run npm run db:push if needed.`,
    somethingWrong: "Something went wrong.",
  },

  // Trending
  trending: {
    title: "Trending Now",
    subtitle: "The hottest YouTube videos in the last 24 hours, voted by the community",
    empty: "No trending videos yet today.",
    emptyLink: "Be the first to drop one!",
    navTrending: "Trending",
    navThisWeek: "This Week",
    navThisMonth: "This Month",
    navAllTime: "All Time",
    navLeaderboard: "Leaderboard",
    whatIsTitle: "What is Flegm Trending?",
    whatIsText:
      "Flegm Trending shows the YouTube videos that are getting the most love from the community right now. Unlike algorithmic recommendations, these picks are 100% community-driven \u2014 real people dropping and upvoting the videos they think are worth watching. Updated continuously throughout the day.",
  },

  // Top Week
  topWeek: {
    title: "Top This Week",
    subtitle: "The best YouTube videos from the past 7 days, ranked by community votes",
    empty: "No videos this week yet.",
    emptyLink: "Drop the first one!",
    seoTitle: "Weekly YouTube Video Rankings",
    seoText:
      "Every week, the Flegm community discovers and ranks the best YouTube videos. These aren\u2019t algorithmic picks \u2014 they\u2019re curated by real viewers who drop videos they love and upvote the ones worth watching. Check back every week to see what\u2019s rising.",
  },

  // Top Month
  topMonth: {
    title: "Top This Month",
    subtitle: "The best YouTube videos from the past 30 days, ranked by the community",
    empty: "No videos this month yet.",
    emptyLink: "Drop the first one!",
    seoTitle: "Monthly YouTube Video Rankings",
    seoText:
      "See which YouTube videos dominated the month. Flegm\u2019s monthly rankings give you a snapshot of the content the community loved most over the past 30 days \u2014 from viral hits to hidden gems that deserved more attention.",
  },

  // Top All-Time
  topAllTime: {
    title: "All-Time Best",
    subtitle: "The greatest YouTube videos ever ranked on Flegm, voted by the community",
    empty: "No videos yet.",
    emptyLink: "Be the first to drop one!",
    seoTitle: "The Definitive YouTube Video Rankings",
    seoText:
      "This is the ultimate list \u2014 every video that has ever been dropped on Flegm, ranked by total community upvotes. From viral sensations to underrated gems, these are the videos that stood the test of time and earned the community\u2019s seal of approval.",
  },

  // Submit
  submit: {
    title: "Drop a video",
    subtitle: "Paste a YouTube link and let the community decide if it\u2019s fire",
    label: "YouTube URL",
    placeholder: "https://www.youtube.com/watch?v=...",
    buttonSubmit: "Drop it",
    buttonSubmitting: "Dropping...",
    signInToSubmit: "Sign in to drop a video",
    signInToUpvote: "Sign in to upvote your faves",
    signInToComment: "Sign in to join the convo",
  },

  // Auth / Login
  auth: {
    welcomeTo: "Welcome to Flegm",
    signInTo: "Sign in to Flegm",
    logInTo: "Log in to Flegm",
    or: "or",
    continueWithGoogle: "Continue with Google",
    signInWithGoogle: "Sign in with Google",
    continueWithEmail: "Continue with Email",
    sending: "Sending...",
    checkEmail: "Check your email for a sign-in link",
    emailPlaceholder: "you@example.com",
    byContAccept: "By continuing, you accept our",
    termsOfUse: "Terms of Use",
    and: "and",
    privacyPolicy: "Privacy Policy",
    redirecting: "Redirecting...",
    signOut: "Sign out",
    signingOut: "Signing out\u2026",
  },

  // Video page
  video: {
    comments: "Comments",
    joinConvo: "Join the convo",
    noComments: "No comments yet. Be the first to share your take",
    viewChannel: "View channel",
    posting: "Posting...",
    post: "Post",
    cancel: "Cancel",
    replyTo: (author: string) => `Reply to ${author}...`,
    shareThoughts: "Share your thoughts...",
    reply: "Reply",
  },

  // Channel
  channel: {
    videosOnFlegm: (count: number) =>
      `${count} video${count !== 1 ? "s" : ""} on Flegm`,
    videos: "Videos",
  },

  // Submit success banner
  banner: {
    videoAdded: "Video added! Share it with your friends",
    copyLink: "Copy link",
    copied: "Copied!",
    dismiss: "Dismiss",
  },

  // Cookie banner
  cookie: {
    message:
      "We use cookies to improve your experience, measure site performance, and show relevant content.",
    cookiePolicy: "Cookie policy",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    manage: "Manage",
    preferences: "Cookie preferences",
    necessary: "Necessary",
    necessaryDesc: "Authentication, security, core functions",
    alwaysOn: "Always on",
    analytics: "Analytics",
    analyticsDesc: "Google Analytics, page views, usage patterns",
    marketing: "Marketing",
    marketingDesc: "Ads, retargeting, personalized content",
    savePreferences: "Save preferences",
    back: "Back",
  },

  // 404
  notFound: {
    title: "Page not found",
    text: "The page you\u2019re looking for doesn\u2019t exist.",
    backHome: "Back to home",
  },

  // About page
  about: {
    title: "About",
    titleHighlight: "Flegm",
    subtitle: "The community-powered YouTube leaderboard",
    whatIsTitle: "What is Flegm?",
    whatIsText1:
      "Flegm is a platform where the community decides which YouTube videos deserve the spotlight. No algorithm, no corporate curation \u2014 just real people sharing and voting on the videos they love.",
    whatIsText2:
      "Think of it as a living, breathing YouTube chart powered by taste, not data science.",
    howItWorksTitle: "How it works",
    step1Title: "Drop a video",
    step1Text: "Paste any YouTube URL and it\u2019s instantly live on Flegm.",
    step2Title: "Upvote",
    step2Text:
      "See something great? Hit the upvote button. The more upvotes a video gets, the higher it climbs.",
    step3Title: "Discover",
    step3Text: "Browse",
    step3TrendingVideos: "trending videos",
    step3The: "the",
    step3LeaderboardLink: "leaderboard",
    step3Or: "or",
    step3AllTime: "all-time bests",
    step4Title: "Discuss",
    step4Text: "Leave comments and join the conversation around each video.",
    whyTitle: "Why Flegm?",
    communityDriven: "Community-driven",
    communityDrivenDesc: "Rankings are 100% based on community votes, not algorithms",
    realTime: "Real-time",
    realTimeDesc: "See what\u2019s hot right now, updated continuously",
    hiddenGems: "Surface hidden gems",
    hiddenGemsDesc: "Discover videos that YouTube\u2019s algorithm won\u2019t show you",
    realConversations: "Real conversations",
    realConversationsDesc: "Discuss videos with people who actually watch them",
    faqTitle: "Frequently asked questions",
    faqFreeQ: "Is Flegm free?",
    faqFreeA:
      "Yes, Flegm is completely free. Browse, drop videos, upvote, and comment at no cost.",
    faqDiffQ: "How is this different from YouTube Trending?",
    faqDiffA:
      "YouTube\u2019s trending page is controlled by an algorithm that favors big channels and advertisers. Flegm\u2019s rankings are purely community-driven.",
    faqAnyQ: "Can I drop any YouTube video?",
    faqAnyA:
      "Yes, any publicly available YouTube video can be shared on Flegm. Just paste the URL and it\u2019s live instantly.",
    faqAccountQ: "Do I need an account?",
    faqAccountA:
      "You can browse without an account. To drop videos, upvote, or comment, sign in with Google or email.",
    readyDiscover: "Ready to discover something great?",
    browseVideos: "Browse videos",
  },
};

export type Dictionary = {
  nav: { [K in keyof typeof en.nav]: string };
  footer: { [K in keyof typeof en.footer]: string };
  home: {
    [K in keyof typeof en.home]: (typeof en.home)[K] extends (...args: infer A) => string
      ? (...args: A) => string
      : string;
  };
  leaderboard: {
    [K in keyof typeof en.leaderboard]: (typeof en.leaderboard)[K] extends (...args: infer A) => string
      ? (...args: A) => string
      : string;
  };
  trending: { [K in keyof typeof en.trending]: string };
  topWeek: { [K in keyof typeof en.topWeek]: string };
  topMonth: { [K in keyof typeof en.topMonth]: string };
  topAllTime: { [K in keyof typeof en.topAllTime]: string };
  submit: { [K in keyof typeof en.submit]: string };
  auth: { [K in keyof typeof en.auth]: string };
  video: {
    [K in keyof typeof en.video]: (typeof en.video)[K] extends (...args: infer A) => string
      ? (...args: A) => string
      : string;
  };
  channel: {
    [K in keyof typeof en.channel]: (typeof en.channel)[K] extends (...args: infer A) => string
      ? (...args: A) => string
      : string;
  };
  banner: { [K in keyof typeof en.banner]: string };
  cookie: { [K in keyof typeof en.cookie]: string };
  notFound: { [K in keyof typeof en.notFound]: string };
  about: { [K in keyof typeof en.about]: string };
};

export default en as Dictionary;
