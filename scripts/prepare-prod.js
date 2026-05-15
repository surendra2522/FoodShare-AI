import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🚀 Preparing FoodShare AI for Production Deployment...');

// 1. Check for .env file
const envPath = path.join(rootDir, '.env');
if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env file not found in the root directory!');
    console.log('💡 Please create a .env file based on .env.example before deploying.');
    process.exit(1);
}

// 2. Build Frontend
console.log('\n📦 Building Frontend...');
try {
    execSync('cd frontend && npm install && npm run build', { stdio: 'inherit', cwd: rootDir });
    console.log('✅ Frontend built successfully in /frontend/dist');
} catch (error) {
    console.error('❌ Error building frontend:', error.message);
    process.exit(1);
}

// 3. Verify AI Models
console.log('\n🤖 Verifying AI Models...');
const modelPath = path.join(rootDir, 'ai/models/surplus_predictor.pkl');
if (!fs.existsSync(modelPath)) {
    console.log('⚠️ AI Model not found. Training now...');
    try {
        execSync('cd ai && python training/train_model.py', { stdio: 'inherit', cwd: rootDir });
        console.log('✅ AI Model trained successfully.');
    } catch (error) {
        console.error('❌ Error training AI model. Ensure Python and dependencies are installed.');
        process.exit(1);
    }
} else {
    console.log('✅ AI Model exists and is ready.');
}

console.log('\n🎉 System is ready for deployment!');
console.log('👉 To start the app, run: npm run dev');
console.log('👉 For Docker, run: docker-compose up --build');
