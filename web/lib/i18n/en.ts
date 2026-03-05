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

  // Terms of Use page
  termsPage: {
    title: "Terms of Use",
    metaDescription: "Flegm terms of use — the rules for using the platform.",
    lastUpdated: "Last updated: February 2026",
    tldrHeading: "TL;DR",
    tldrBody:
      "Flegm is a community platform for sharing and discovering YouTube videos. Be cool, don't spam, and respect others. We can remove content or accounts that break these rules. That's basically it.",
    section1Heading: "1. What Flegm is",
    section1Body:
      'Flegm ("we", "us", "the platform") is a community-driven YouTube video leaderboard. You can drop videos, upvote them, and leave comments. We don\'t host any video content — everything plays through YouTube.',
    section2Heading: "2. Your account",
    section2Li1: "You need to sign in (via Google or email) to drop videos, upvote, or comment.",
    section2Li2: "You're responsible for your account. Keep your credentials safe.",
    section2Li3: "One account per person. Don't create alts to game the leaderboard.",
    section2Li4: "We can suspend or delete accounts that violate these terms.",
    section3Heading: "3. Community rules",
    section3Intro: "Keep it chill. Don't:",
    section3Li1: "Spam, self-promote excessively, or use bots",
    section3Li2: "Post hateful, violent, or illegal content",
    section3Li3: "Harass other users in comments",
    section3Li4: "Try to manipulate votes or game the leaderboard",
    section3Li5: "Impersonate others or misrepresent your identity",
    section3Outro:
      "We moderate content using automated risk scoring and may hold comments for review. We reserve the right to remove any content at our discretion.",
    section4Heading: "4. Content you share",
    section4Li1: "You can only share YouTube videos that are publicly available.",
    section4Li2: "By dropping a video, you're sharing a link — you're not claiming ownership of that content.",
    section4Li3: "Your comments are your own. You grant Flegm permission to display them on the platform.",
    section4Li4: "We can remove any content that violates these terms or that we consider harmful.",
    section5Heading: "5. What we provide (and don't)",
    section5Li1: 'Flegm is provided "as is". We do our best but can\'t guarantee uptime or perfection.',
    section5Li2: "We're not responsible for the content of YouTube videos shared on the platform.",
    section5Li3: "We may change, update, or discontinue features at any time.",
    section5Li4: "We're not liable for any damages from using (or not being able to use) Flegm.",
    section6Heading: "6. Intellectual property",
    section6Body:
      "The Flegm name, logo, and design are ours. The YouTube videos belong to their creators. You keep ownership of your comments, but give us a license to display them on the platform.",
    section7Heading: "7. Changes to these terms",
    section7Body:
      "We might update these terms from time to time. If we make significant changes, we'll let you know. Continuing to use Flegm after changes means you accept them.",
    section8Heading: "8. Contact",
    section8Body: "Questions? Hit us up at",
    seeAlso: "See also:",
    privacyPolicy: "Privacy Policy",
    cookiePolicy: "Cookie Policy",
  },

  // Privacy Policy page
  privacyPage: {
    title: "Privacy Policy",
    metaDescription: "Flegm privacy policy — how we handle your data.",
    lastUpdated: "Last updated: February 2026",
    tldrHeading: "TL;DR",
    tldrBody:
      "We collect the minimum we need to run Flegm — your sign-in info, what you do on the platform, and basic analytics. We don't sell your data. Ever.",
    section1Heading: "1. What we collect",
    accountInfo: "Account info",
    accountInfoIntro: "When you sign in, we get:",
    googleSignIn: "Google sign-in:",
    googleSignInDetail: "your name, email, and profile picture",
    emailSignIn: "Email sign-in:",
    emailSignInDetail: "just your email address",
    accountInfoOutro: "This is handled by Supabase Auth. We store your profile (username, avatar) so the site works.",
    yourActivity: "Your activity",
    yourActivityLi1: "Videos you drop",
    yourActivityLi2: "Videos you upvote",
    yourActivityLi3: "Comments you post",
    yourActivityOutro: "This is visible to other users — that's the whole point of the platform.",
    analytics: "Analytics",
    analyticsIntro:
      "We use Google Analytics 4 to understand how people use Flegm (page views, button clicks, sign-in events). GA may collect:",
    analyticsLi1: "Your IP address (anonymized by Google)",
    analyticsLi2: "Browser type and device info",
    analyticsLi3: "Pages you visit and how long you stay",
    analyticsLi4: "Referral source (how you found us)",
    cookies: "Cookies",
    cookiesIntro: "We use cookies for:",
    necessary: "Necessary:",
    necessaryDetail: "keeping you signed in (Supabase session) and storing your consent preference",
    analyticsCat: "Analytics:",
    analyticsCatDetail: "Google Analytics cookies to understand usage patterns (opt-in)",
    marketing: "Marketing:",
    marketingDetail: "advertising and retargeting cookies (opt-in)",
    cookiesOutro: "Analytics and marketing cookies are only set after you give consent. You can manage your preferences any time on our",
    cookiePolicyPage: "Cookie Policy",
    page: "page.",
    section2Heading: "2. How we use your data",
    section2Li1: "To run Flegm — show your profile, display your votes and comments",
    section2Li2: "To keep the platform safe — our moderation system scores comments for risk",
    section2Li3: "To understand usage — analytics help us improve the experience",
    section2Li4: "To send you sign-in links if you use email auth",
    section3Heading: "3. Who sees your data",
    section3Li1: "Other users: your username, avatar, dropped videos, upvotes, and comments are public",
    section3Li2: "Supabase: hosts our database and handles authentication",
    section3Li3: "Google: provides Analytics and OAuth sign-in",
    section3Li4: "Vercel: hosts the website",
    section3Li5: "Resend: sends sign-in emails and moderation alerts",
    section3Outro: "We don't sell, rent, or share your personal data with advertisers or data brokers. Period.",
    section4Heading: "4. Where your data lives",
    section4Body:
      "Our infrastructure is hosted on Supabase (cloud) and Vercel. Your data may be processed in the US or EU depending on the service. All connections use HTTPS encryption.",
    section5Heading: "5. How long we keep it",
    accountData: "Account data:",
    accountDataDetail: "as long as your account exists",
    videosComments: "Videos & comments:",
    videosCommentsDetail: "as long as the content is on the platform",
    analyticsRetention: "Analytics:",
    analyticsRetentionDetail: "retained per Google's default retention policies",
    section5Outro:
      "If you delete your account, we'll remove your personal data. Public content (comments, dropped videos) may remain anonymized.",
    section6Heading: "6. Your rights",
    section6Intro: "You can:",
    access: "Access your data — ask us what we have",
    delete: "Delete your account — email us and we'll wipe it",
    export: "Export your data — we can provide what we store",
    optOutBeforeLink: "Opt out of analytics — use the ",
    optOutAfterLink: " or a browser extension",
    section6Outro: "If you're in the EU, you have additional rights under GDPR (rectification, restriction, portability, objection). Just reach out.",
    section7Heading: "7. Kids",
    section7Body:
      "Flegm is not designed for anyone under 13. We don't knowingly collect data from children. If you're under 13, please don't use the platform.",
    section8Heading: "8. Changes to this policy",
    section8Body:
      "We might update this policy as Flegm evolves. If we make significant changes, we'll let you know. The \"last updated\" date at the top always reflects the current version.",
    section9Heading: "9. Contact",
    section9Body: "Got questions about your data? Email us at",
    seeAlso: "See also:",
    termsOfUse: "Terms of Use",
  },

  // Cookie Policy page
  cookiesPage: {
    title: "Cookie Policy",
    metaDescription: "Flegm cookie policy — what cookies we use and why.",
    lastUpdated: "Last updated: February 2026",
    tldrHeading: "TL;DR",
    tldrBody:
      "We use cookies to keep you signed in, understand how you use Flegm, and (if you opt in) for marketing purposes. You can change your preferences any time.",
    section1Heading: "1. What are cookies?",
    section1Body:
      "Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, keep you logged in, and understand how you interact with the platform.",
    section2Heading: "2. Cookies we use",
    tableCategory: "Category",
    tablePurpose: "Purpose",
    tableOptOut: "Can you opt out?",
    necessaryRow: "Necessary",
    necessaryPurpose:
      "Authentication (Supabase session), security tokens, cookie consent preference. The site won't work without them.",
    no: "No",
    analyticsRow: "Analytics",
    analyticsPurpose:
      "Google Analytics 4 — page views, button clicks, sign-in events, usage patterns. Helps us understand what's working and what's not.",
    yes: "Yes",
    marketingRow: "Marketing",
    marketingPurpose:
      "Advertising cookies, retargeting pixels, ad personalization. Used to show relevant ads and measure ad campaign effectiveness.",
    section3Heading: "3. Specific cookies",
    tableCookie: "Cookie",
    tableProvider: "Provider",
    tableDuration: "Duration",
    section4Heading: "4. Google Consent Mode v2",
    section4Body:
      "We use Google Consent Mode v2 to respect your cookie choices. When you decline analytics or marketing cookies, Google tags load in a privacy-safe mode — no identifying cookies are set, and only aggregate, cookieless pings are sent. This lets Google provide basic conversion modeling without tracking you individually.",
    section5Heading: "5. Managing your preferences",
    section5Intro:
      "You can change your cookie preferences at any time using the button below, or through your browser settings.",
    section5Outro:
      "Most browsers also let you block or delete cookies. Note that blocking necessary cookies may prevent the site from working properly.",
    section6Heading: "6. Third-party cookies",
    section6Body:
      "Some cookies are set by third-party services we use (Google Analytics, Google Ads). These services have their own privacy policies:",
    googlePrivacy: "Google Privacy Policy",
    gaOptout: "Google Analytics Opt-out Browser Add-on",
    section7Heading: "7. Contact",
    section7Body: "Questions about our cookie practices? Email",
    privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms of Use",
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
  termsPage: { [K in keyof typeof en.termsPage]: string };
  privacyPage: { [K in keyof typeof en.privacyPage]: string };
  cookiesPage: { [K in keyof typeof en.cookiesPage]: string };
};

export default en as Dictionary;
