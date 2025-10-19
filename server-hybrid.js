const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de segurança (mais permissivo para desenvolvimento)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "data:"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https://*.supabase.co", "wss://*.supabase.co"],
            frameSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"]
        }
    }
}));

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Rota para configuração do Supabase (segura)
app.get('/api/config', (req, res) => {
    res.json({
        supabaseUrl: process.env.SUPABASE_URL || 'https://uifmnunesfevybpahahx.supabase.co',
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZm1udW5lc2ZldnlicGFoYWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTc1ODgsImV4cCI6MjA3NjM5MzU4OH0.J0eaMX0JEVch8gXDlZEVAhRddZd6-8wtZD5w4z4N20g',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Servir arquivo de configuração do Supabase
app.get('/config/supabase.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    const fs = require('fs');
    const path = require('path');
    const configPath = path.join(__dirname, 'config', 'supabase.js');
    
    if (fs.existsSync(configPath)) {
        res.sendFile(configPath);
    } else {
        // Fallback: gerar configuração dinamicamente
        const configScript = `
// Configuração do Supabase - Gerada pelo servidor
const SUPABASE_URL = '${process.env.SUPABASE_URL || 'https://uifmnunesfevybpahahx.supabase.co'}';
const SUPABASE_ANON_KEY = '${process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZm1udW5lc2ZldnlicGFoYWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTc1ODgsImV4cCI6MjA3NjM5MzU4OH0.J0eaMX0JEVch8gXDlZEVAhRddZd6-8wtZD5w4z4N20g'}';

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exportar para uso global
window.supabaseClient = supabase;

console.log('🚀 Supabase configurado via servidor');

// Inicializar aplicação
if (window.AnalisAI) {
    window.app = new window.AnalisAI();
}
        `;
        res.send(configScript);
    }
});

// Rota para processamento de IA (futuro)
app.post('/api/ai/process', async (req, res) => {
    try {
        const { type, content } = req.body;
        
        // Aqui será implementada a integração com N8N/OpenAI
        res.json({
            success: true,
            message: 'Processamento de IA em desenvolvimento',
            type,
            processed: false
        });
    } catch (error) {
        console.error('Erro no processamento IA:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para webhooks do N8N (futuro)
app.post('/api/webhooks/n8n', async (req, res) => {
    try {
        const { workflow, data } = req.body;
        
        // Processar webhook do N8N
        res.json({
            success: true,
            message: 'Webhook processado',
            workflow
        });
    } catch (error) {
        console.error('Erro no webhook:', error);
        res.status(500).json({ error: 'Erro no webhook' });
    }
});

// Servir frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo deu errado!' });
});

app.listen(PORT, () => {
    console.log(`🚀 MediQ.AI Híbrido rodando na porta ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔧 API: http://localhost:${PORT}/api`);
    console.log(`🧠 IA Ready: ${process.env.SUPABASE_URL ? '✅' : '❌'}`);
});