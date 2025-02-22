const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 3600
};

const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  w: 'majority',
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: process.env.NODE_ENV === 'development',
  useNewUrlParser: true,
  useUnifiedTopology: true
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