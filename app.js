// Versão otimizada para produção - sem loops e CSP issues
class MediQAI {
    constructor() {
        this.currentUser = null;
        this.supabase = window.supabaseClient;
        this.isAuthProcessing = false;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        
        // Verificar sessão inicial
        const { data: { session } } = await this.supabase.auth.getSession();
        
        if (session) {
            await this.loadCurrentUser(session.user);
            this.showDashboard();
        } else {
            this.showLogin();
        }

        // Auth state listener otimizado
        this.supabase.auth.onAuthStateChange(async (event, session) => {
            if (this.isAuthProcessing) return;
            
            if (event === 'SIGNED_IN' && session && !this.currentUser) {
                this.isAuthProcessing = true;
                await this.loadCurrentUser(session.user);
                this.showDashboard();
                this.isAuthProcessing = false;
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                this.showLogin();
            }
        });
    }

    setupEventListeners() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Menu navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);
            });
        });

        // Refresh users
        document.getElementById('refresh-users-btn').addEventListener('click', () => {
            this.loadUsers();
        });

        // Add user (simplified)
        document.getElementById('add-user-btn').addEventListener('click', () => {
            const email = prompt('Email do novo usuário:');
            const name = prompt('Nome do usuário:');
            if (email && name) {
                this.createUser(email, name);
            }
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    showLogin() {
        this.showScreen('login-screen');
    }

    showDashboard() {
        this.showScreen('dashboard-screen');
        this.loadOverview();
    }

    showSection(sectionId) {
        // Update menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionId}-section`).classList.add('active');

        // Load section data
        if (sectionId === 'users') {
            this.loadUsers();
        } else if (sectionId === 'modules') {
            this.loadModules();
        } else if (sectionId === 'overview') {
            this.loadOverview();
        }
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const { error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                alert('Erro no login: ' + error.message);
                return;
            }
        } catch (error) {
            console.error('Erro no login:', error);
            alert('Erro de conexão');
        }
    }

    async logout() {
        try {
            await this.supabase.auth.signOut();
        } catch (error) {
            console.error('Erro no logout:', error);
        }
    }

    async loadCurrentUser(authUser) {
        try {
            const { data: profile } = await this.supabase
                .from('profiles')
                .select('*, clinics(name)')
                .eq('id', authUser.id)
                .single();

            if (profile) {
                this.currentUser = {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    clinic_id: profile.clinic_id,
                    permissions: profile.permissions || []
                };

                document.getElementById('user-name').textContent = this.currentUser.name;
            }
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
        }
    }

    async loadUsers() {
        if (!this.currentUser) return;

        try {
            const { data: users } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('clinic_id', this.currentUser.clinic_id)
                .order('created_at', { ascending: false });

            this.renderUsers(users || []);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        }
    }

    renderUsers(users) {
        const tbody = document.getElementById('users-tbody');
        tbody.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    ${user.permissions.map(perm => 
                        `<span class="permission-badge">${this.getPermissionLabel(perm)}</span>`
                    ).join('')}
                </td>
                <td>
                    <span class="status-active">Ativo</span>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('total-users').textContent = users.length;
    }

    loadModules() {
        const modules = [
            {
                name: 'Prescrição Inteligente',
                description: 'IA para auxiliar na prescrição médica',
                icon: 'fas fa-prescription-bottle-alt',
                enabled: true
            },
            {
                name: 'Transcrição de Áudio',
                description: 'Transcrição automática de consultas',
                icon: 'fas fa-microphone',
                enabled: true
            },
            {
                name: 'Análise de Histórico',
                description: 'Análise do histórico clínico',
                icon: 'fas fa-chart-line',
                enabled: false
            },
            {
                name: 'Análise de Exames',
                description: 'Interpretação de resultados',
                icon: 'fas fa-file-medical',
                enabled: false
            }
        ];

        const grid = document.getElementById('modules-grid');
        grid.innerHTML = '';

        modules.forEach(module => {
            const card = document.createElement('div');
            card.className = 'module-card';
            card.innerHTML = `
                <h3><i class="${module.icon}"></i> ${module.name}</h3>
                <p>${module.description}</p>
                <div class="module-status">
                    <i class="fas fa-circle ${module.enabled ? 'status-enabled' : 'status-disabled'}"></i>
                    ${module.enabled ? 'Habilitado' : 'Desabilitado'}
                </div>
            `;
            grid.appendChild(card);
        });
    }

    loadOverview() {
        this.loadUsers();
        this.loadModules();
    }

    async createUser(email, name) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email: email,
                password: '123456', // Senha temporária
            });

            if (error) {
                alert('Erro: ' + error.message);
                return;
            }

            if (data.user) {
                await this.supabase.from('profiles').insert([{
                    id: data.user.id,
                    name: name,
                    email: email,
                    clinic_id: this.currentUser.clinic_id,
                    permissions: ['medico']
                }]);

                alert('Usuário criado! Email de confirmação enviado.');
                this.loadUsers();
            }
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            alert('Erro de conexão');
        }
    }

    getPermissionLabel(permission) {
        const labels = {
            'medico': 'Médico',
            'secretaria': 'Secretária',
            'faturamento': 'Faturamento',
            'clinica_admin': 'Admin'
        };
        return labels[permission] || permission;
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MediQAI();
});