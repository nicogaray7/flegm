const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de l\'environnement de développement...\n');

// Vérification de Node.js
try {
  const nodeVersion = process.version;
  const major = parseInt(nodeVersion.slice(1).split('.')[0]);
  console.log(`📦 Node.js version: ${nodeVersion}`);
  if (major !== 18) {
    console.warn('⚠️  Attention: La version recommandée de Node.js est v18.x');
  }
} catch (error) {
  console.error('❌ Erreur lors de la vérification de Node.js:', error);
}

// Vérification de MongoDB
try {
  execSync('mongod --version');
  console.log('✅ MongoDB est installé');
} catch (error) {
  console.error('❌ MongoDB n\'est pas installé ou n\'est pas accessible');
}

// Vérification des fichiers .env
const envFiles = {
  backend: ['.env', '.env.development', '.env.production'],
  frontend: ['.env.local', '.env.development', '.env.production']
};

for (const [project, files] of Object.entries(envFiles)) {
  console.log(`\n🔍 Vérification des fichiers .env pour ${project}:`);
  files.forEach(file => {
    const filePath = path.join(__dirname, '..', project, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} existe`);
    } else {
      console.warn(`⚠️  ${file} est manquant`);
    }
  });
}

// Vérification des ports
try {
  const portsOutput = execSync('lsof -i :3000,5000 -P -n').toString();
  if (portsOutput) {
    console.warn('\n⚠️  Certains ports sont déjà utilisés:');
    console.log(portsOutput);
  } else {
    console.log('\n✅ Les ports 3000 et 5000 sont disponibles');
  }
} catch (error) {
  console.log('\n✅ Les ports 3000 et 5000 sont disponibles');
}

// Vérification des dépendances
console.log('\n📦 Vérification des dépendances...');
try {
  execSync('npm audit', { stdio: 'inherit' });
} catch (error) {
  console.warn('⚠️  Des vulnérabilités ont été trouvées dans les dépendances');
}

console.log('\n✨ Vérification terminée'); 