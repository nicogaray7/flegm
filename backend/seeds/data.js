module.exports = {
  users: [
    {
      username: 'thomas_creator',
      email: 'thomas@flegm.fr',
      password: 'Test123!',
      bio: 'Artiste digital et créateur de contenu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thomas',
      isCreator: true
    },
    {
      username: 'sophie_artiste',
      email: 'sophie@flegm.fr',
      password: 'Test123!',
      bio: 'Photographe et vidéaste',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie',
      isCreator: true
    },
    {
      username: 'lucas_viewer',
      email: 'lucas@flegm.fr',
      password: 'Test123!',
      bio: 'Passionné d\'art numérique',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lucas',
      isCreator: false
    }
  ],
  posts: [
    {
      title: 'Création d\'une fresque numérique',
      description: 'Découvrez le processus créatif derrière ma dernière fresque numérique',
      content: 'Dans cette vidéo, je vous montre étape par étape comment j\'ai créé une fresque numérique pour un espace de coworking parisien...',
      imageUrl: 'https://picsum.photos/800/600?random=1',
      category: 'Art Digital',
      tags: ['Fresque', 'Art Numérique', 'Procreate'],
      videoUrl: 'https://storage.flegm.fr/videos/fresque-numerique'
    },
    {
      title: 'Workshop Motion Design',
      description: 'Retour sur mon workshop de motion design à la Gaîté Lyrique',
      content: 'Un atelier intense de 3 jours où nous avons exploré les fondamentaux du motion design...',
      imageUrl: 'https://picsum.photos/800/600?random=2',
      category: 'Formation',
      tags: ['Motion Design', 'After Effects', 'Workshop'],
      videoUrl: 'https://storage.flegm.fr/videos/workshop-motion'
    },
    {
      title: 'L\'art du Stop Motion',
      description: 'Techniques avancées de stop motion avec un smartphone',
      content: 'Comment créer des animations stop motion professionnelles avec un simple smartphone...',
      imageUrl: 'https://picsum.photos/800/600?random=3',
      category: 'Animation',
      tags: ['Stop Motion', 'Animation', 'Mobile'],
      videoUrl: 'https://storage.flegm.fr/videos/stop-motion'
    }
  ],
  comments: [
    {
      content: 'Superbe tutoriel ! J\'ai appris énormément de choses.',
      rating: 5
    },
    {
      content: 'Quand aura lieu le prochain workshop ?',
      rating: 4
    },
    {
      content: 'Les effets visuels sont impressionnants !',
      rating: 5
    },
    {
      content: 'Merci pour ces conseils précieux.',
      rating: 4
    }
  ]
}; 