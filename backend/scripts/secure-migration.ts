import * as fs from 'fs';
import * as crypto from 'crypto';

const generateSecureSecret = (length: number = 64): string => {
  return crypto.randomBytes(length).toString('hex');
};

const migrateSecrets = () => {
  const newJwtSecret = generateSecureSecret();
  const newCloudinarySecret = generateSecureSecret(32);

  const migrationLog = `
Migration Sécurisée - ${new Date().toISOString()}
- Nouveau JWT Secret généré
- Nouveau Cloudinary Secret généré
  `;

  fs.writeFileSync('migration-log.txt', migrationLog);
  console.log('🔐 Migration des secrets terminée');
};

migrateSecrets(); 