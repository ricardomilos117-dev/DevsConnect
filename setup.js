#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configurando DevsConnect...\n');

// Verificar se o Node.js está instalado
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js ${nodeVersion} encontrado`);
} catch (error) {
  console.error('❌ Node.js não encontrado. Instale o Node.js versão 14 ou superior.');
  process.exit(1);
}

// Verificar se o npm está instalado
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm ${npmVersion} encontrado`);
} catch (error) {
  console.error('❌ npm não encontrado. Instale o npm.');
  process.exit(1);
}

// Criar arquivo .env se não existir
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Arquivo .env criado a partir do .env.example');
  } else {
    const defaultEnv = `PORT=12000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/devsconnect
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui_${Math.random().toString(36).substring(7)}
CORS_ORIGIN=http://localhost:3000`;
    
    fs.writeFileSync(envPath, defaultEnv);
    console.log('✅ Arquivo .env criado com configurações padrão');
  }
} else {
  console.log('✅ Arquivo .env já existe');
}

// Instalar dependências do backend
console.log('\n📦 Instalando dependências do backend...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependências do backend instaladas');
} catch (error) {
  console.error('❌ Erro ao instalar dependências do backend');
  process.exit(1);
}

// Instalar dependências do frontend
console.log('\n📦 Instalando dependências do frontend...');
try {
  execSync('cd client && npm install', { stdio: 'inherit' });
  console.log('✅ Dependências do frontend instaladas');
} catch (error) {
  console.error('❌ Erro ao instalar dependências do frontend');
  process.exit(1);
}

console.log('\n🎉 Configuração concluída com sucesso!');
console.log('\n📋 Próximos passos:');
console.log('1. Configure o arquivo .env com suas credenciais');
console.log('2. Execute "npm run dev" para iniciar o desenvolvimento');
console.log('3. Acesse http://localhost:3000 para ver a aplicação');
console.log('\n💡 Dicas:');
console.log('- Use MongoDB Atlas para banco de dados em nuvem');
console.log('- Execute "npm run dev" para desenvolvimento');
console.log('- Execute "npm start" para produção');
console.log('\n📚 Consulte o README.md para mais informações');