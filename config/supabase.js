// Configuração do Supabase - Versão Híbrida
let SUPABASE_URL, SUPABASE_ANON_KEY;

// Tentar carregar configuração do servidor (mais seguro)
async function loadConfig() {
    try {
        const response = await fetch('/api/config');
        const config = await response.json();
        SUPABASE_URL = config.supabaseUrl;
        SUPABASE_ANON_KEY = config.supabaseAnonKey;
        console.log('🔒 Configuração carregada do servidor (seguro)');
    } catch (error) {
        // Fallback para configuração local (desenvolvimento)
        SUPABASE_URL = 'https://uifmnunesfevybpahahx.supabase.co';
        SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZm1udW5lc2ZldnlicGFoYWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTc1ODgsImV4cCI6MjA3NjM5MzU4OH0.J0eaMX0JEVch8gXDlZEVAhRddZd6-8wtZD5w4z4N20g';
        console.warn('⚠️ Usando configuração local - Configure o servidor para produção');
    }
}

// Inicializar Supabase após carregar configuração
async function initSupabase() {
    await loadConfig();
    
    // Verificar se as credenciais foram configuradas
    if (SUPABASE_URL.includes('seu-projeto') || SUPABASE_ANON_KEY.includes('sua-chave')) {
        console.warn('⚠️ ATENÇÃO: Configure suas credenciais do Supabase');
        console.warn('📖 Veja as instruções em SUPABASE_SETUP.md');
    }

    // Inicializar cliente Supabase
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Exportar para uso global
    window.supabaseClient = supabase;
    
    console.log('🚀 MediQ.AI Híbrido configurado');
    
    // Inicializar aplicação após configuração
    if (window.AnalisAI) {
        window.app = new window.AnalisAI();
    }
}

// Aguardar carregamento da página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    initSupabase();
}

// Listener de foco removido para evitar loops