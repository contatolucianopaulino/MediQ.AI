// Servidor simples sem dependências externas para testar
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;

    // Configuração do Supabase via API
    if (pathname === '/api/config') {
        res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
            supabaseUrl: 'https://uifmnunesfevybpahahx.supabase.co',
            supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZm1udW5lc2ZldnlicGFoYWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTc1ODgsImV4cCI6MjA3NjM5MzU4OH0.J0eaMX0JEVch8gXDlZEVAhRddZd6-8wtZD5w4z4N20g',
            environment: 'development'
        }));
        return;
    }

    // Servir arquivos estáticos
    if (pathname === '/') {
        pathname = '/index.html';
    }

    const filePath = path.join(__dirname, 'public', pathname);
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Tentar servir da raiz se não encontrar em public
                const rootPath = path.join(__dirname, pathname);
                fs.readFile(rootPath, (err2, content2) => {
                    if (err2) {
                        res.writeHead(404);
                        res.end('Arquivo não encontrado');
                    } else {
                        res.writeHead(200, { 'Content-Type': contentType });
                        res.end(content2, 'utf-8');
                    }
                });
            } else {
                res.writeHead(500);
                res.end('Erro do servidor: ' + err.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('🚀 MediQ.AI rodando em http://localhost:' + PORT);
    console.log('📱 Abra o navegador e acesse: http://localhost:' + PORT);
    console.log('🔧 Configuração do Supabase: ✅ Configurado');
    console.log('💾 Banco de dados: Supabase PostgreSQL');
    console.log('🔐 Autenticação: Supabase Auth');
});

// Tratamento de erros
process.on('uncaughtException', (err) => {
    console.error('Erro não capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promise rejeitada:', reason);
});