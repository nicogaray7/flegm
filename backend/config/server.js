const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://flegm.fr']
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 3600,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  w: 'majority',
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: false
};

const expressConfig = {
  jsonLimit: '2mb',
  urlEncodedLimit: '2mb',
  staticOptions: {
    maxAge: '1d',
    etag: true,
    lastModified: true
  }
};

module.exports = {
  corsOptions,
  mongooseOptions,
  expressConfig
}; 