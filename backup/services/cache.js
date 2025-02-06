const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

const cacheMiddleware = (duration) => (req, res, next) => {
  const key = `__express__${req.originalUrl}`;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    res.send(cachedResponse);
    return;
  }

  res.sendResponse = res.send;
  res.send = (body) => {
    cache.set(key, body, duration);
    res.sendResponse(body);
  };
  next();
};

module.exports = { cache, cacheMiddleware }; 