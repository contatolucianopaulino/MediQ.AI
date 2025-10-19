// Configuração simplificada do Supabase
console.log('🔧 Carregando configuração do Supabase...');

// Configuração direta (para desenvolvimento)
const SUPABASE_URL = 'https://uifmnunesfevybpahahx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpZm1udW5lc2ZldnlicGFoYWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTc1ODgsImV4cCI6MjA3NjM5MzU4OH0.J0eaMX0JEVch8gXDlZEVAhRddZd6-8wtZD5w4z4N20g';

// Aguardar carregamento do Supabase
function initSupabaseWhenReady() {
    if (typeof window.supabase !== 'undefined') {
        // Inicializar cliente Supabase
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Exportar para uso global
        window.supabaseClient = supabase;
        
        console.log('✅ Supabase configurado com sucesso');
        
        // Inicializar aplicação
        if (window.AnalisAI) {
            console.log('🚀 Inicializando AnalisAI...');
            window.app = new window.AnalisAI();
        } else {
            console.log('⏳ Aguardando AnalisAI...');
            setTimeout(initSupabaseWhenReady, 100);
        }
    } else {
        console.log('⏳ Aguardando Supabase SDK...');
        setTimeout(initSupabaseWhenReady, 100);
    }
}

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabaseWhenReady);
} else {
    initSupabaseWhenReady();
}