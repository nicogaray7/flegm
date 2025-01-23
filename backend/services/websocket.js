const WebSocket = require('ws');
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

class WebSocketService {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();

    this.wss.on('connection', (ws, req) => {
      const userId = this.getUserIdFromRequest(req);
      this.clients.set(userId, ws);

      ws.on('message', (message) => {
        this.handleMessage(userId, message);
      });

      ws.on('close', () => {
        this.clients.delete(userId);
      });
    });

    // Abonnement Redis pour la scalabilité
    redis.subscribe('broadcast', (err) => {
      if (err) console.error('Redis sub error:', err);
    });

    redis.on('message', (channel, message) => {
      this.broadcast(message);
    });
  }

  getUserIdFromRequest(req) {
    // Logique d'extraction de l'ID utilisateur
    return req.headers['user-id'];
  }

  handleMessage(userId, message) {
    try {
      const data = JSON.parse(message);
      // Traitement du message
      this.broadcast(data);
    } catch (error) {
      console.error('WS message error:', error);
    }
  }

  broadcast(data) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  sendToUser(userId, data) {
    const client = this.clients.get(userId);
    if (client?.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  }
}

module.exports = WebSocketService; 