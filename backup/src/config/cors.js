const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://flegm.fr', 'https://www.flegm.fr'] 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

module.exports = corsOptions; 