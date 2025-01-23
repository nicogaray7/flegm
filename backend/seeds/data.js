const users = [
  {
    username: "thomas_creator",
    email: "thomas@flegm.fr",
    password: "$2a$10$XHvjKkJRMx7yZW5tIk/tWe2QwwqxRoK9.WrVSQL4X.yI3WDIEQGJi", // mot de passe: Test123!
    isCreator: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=thomas",
    createdAt: new Date('2024-01-15')
  },
  {
    username: "marie_artiste",
    email: "marie@flegm.fr",
    password: "$2a$10$XHvjKkJRMx7yZW5tIk/tWe2QwwqxRoK9.WrVSQL4X.yI3WDIEQGJi",
    isCreator: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marie",
    createdAt: new Date('2024-01-20')
  },
  {
    username: "lucas_viewer",
    email: "lucas@flegm.fr",
    password: "$2a$10$XHvjKkJRMx7yZW5tIk/tWe2QwwqxRoK9.WrVSQL4X.yI3WDIEQGJi",
    isCreator: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lucas",
    createdAt: new Date('2024-02-01')
  }
];

const posts = [
  {
    title: "Création d'une fresque murale",
    description: "Je vous emmène dans les coulisses de ma dernière création : une fresque murale de 15m² réalisée pour un espace de coworking parisien. Découvrez mes techniques, mes outils et mes astuces !",
    videoUrl: "https://res.cloudinary.com/dfupyozxe/video/upload/v1/flegm_videos/fresque_murale",
    tags: ["art", "fresque", "peinture", "tutoriel"],
    upvoteCount: 156,
    createdAt: new Date('2024-02-15')
  },
  {
    title: "Workshop Calligraphie Moderne",
    description: "Retour sur mon workshop de calligraphie moderne à la Gaîté Lyrique. Une journée riche en partages et en découvertes avec des passionnés.",
    videoUrl: "https://res.cloudinary.com/dfupyozxe/video/upload/v1/flegm_videos/calligraphie",
    tags: ["calligraphie", "workshop", "paris", "art"],
    upvoteCount: 89,
    createdAt: new Date('2024-02-20')
  },
  {
    title: "Techniques de Graffiti Digital",
    description: "Comment j'utilise Procreate pour créer des graffitis digitaux. Un mix entre art urbain traditionnel et création numérique.",
    videoUrl: "https://res.cloudinary.com/dfupyozxe/video/upload/v1/flegm_videos/graffiti_digital",
    tags: ["digital", "graffiti", "procreate", "tutoriel"],
    upvoteCount: 234,
    createdAt: new Date('2024-03-01')
  }
];

const comments = [
  {
    content: "Incroyable fresque ! J'adorerais voir plus de détails sur la technique des dégradés.",
    createdAt: new Date('2024-02-16')
  },
  {
    content: "Le workshop avait l'air génial, dommage que j'ai raté ça. Il y aura d'autres dates ?",
    createdAt: new Date('2024-02-21')
  },
  {
    content: "Tes vidéos m'ont vraiment aidé à progresser. Merci de partager ton savoir !",
    createdAt: new Date('2024-02-22')
  },
  {
    content: "La partie sur Procreate est super bien expliquée. Tu pourrais faire une vidéo sur les brushes personnalisés ?",
    createdAt: new Date('2024-03-02')
  },
  {
    content: "Je viens de m'inscrire sur Flegm et je découvre une super communauté d'artistes. Merci !",
    createdAt: new Date('2024-03-05')
  }
];

// Ajout de données pour les upvotes
const upvotes = posts.map(post => ({
  postId: null, // Sera rempli dynamiquement
  userIds: [], // Sera rempli dynamiquement
  count: post.upvoteCount
}));

module.exports = { users, posts, comments, upvotes }; 