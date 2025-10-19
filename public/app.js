class AnalisAI {
    constructor() {
        this.currentUser = null;
        this.supabase = window.supabaseClient;
        this.demoMode = false; // Desabilitar modo demo para usar Supabase
        this.init();
    }

    async init() {
        this.setupEventListeners();
        
        // Verificar se usuário está logado no Supabase
        const { data: { session } } = await this.supabase.auth.getSession();
        
        if (session) {
            await this.loadCurrentUser(session.user);
            this.showDashboard();
        } else {
            this.showLogin();
        }

        // Escutar mudanças de autenticação (evitar loops)
        let isProcessingAuth = false;
        this.supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state change:', event, session?.user?.email);
            
            if (isProcessingAuth) {
                console.log('Ignorando evento duplicado:', event);
                return;
            }
            
            if (event === 'SIGNED_IN' && session && !this.currentUser) {
                isProcessingAuth = true;
                await this.loadCurrentUser(session.user);
                this.showDashboard();
                isProcessingAuth = false;
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                this.showLogin();
            }
        });
    }

    setupEventListeners() {
        // Login/Register navigation
        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegister();
        });

        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLogin();
        });

        // Forms
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        document.getElementById('user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddUser();
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

        // Modal controls
        document.getElementById('add-user-btn').addEventListener('click', () => {
            // Abrir página simplificada para adicionar usuário
            const popup = window.open('add-user-simple.html', '_blank', 'width=600,height=700');
            
            // Verificar quando a janela é fechada e atualizar lista
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    setTimeout(() => {
                        this.loadUsers();
                        this.showNotification('Lista atualizada!', 'info');
                    }, 1000);
                }
            }, 1000);
        });

        // Botão de atualizar usuários
        document.getElementById('refresh-users-btn').addEventListener('click', () => {
            this.loadUsers();
            this.showNotification('Lista de usuários atualizada!', 'success');
        });

        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideModals();
            });
        });

        // Close modal on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModals();
                }
            });
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

    showRegister() {
        this.showScreen('register-screen');
    }

    showDashboard() {
        this.showScreen('dashboard-screen');
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

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    hideModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                this.showNotification(error.message, 'error');
                return;
            }

            this.showNotification('Login realizado com sucesso!', 'success');
            // O redirecionamento será feito automaticamente pelo onAuthStateChange
            
        } catch (error) {
            console.error('Erro no login:', error);
            this.showNotification('Erro de conexão', 'error');
        }
    }

    async handleRegister() {
        const clinicName = document.getElementById('clinic-name').value;
        const adminName = document.getElementById('admin-name').value;
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;

        try {
            // 1. Criar usuário no Supabase Auth
            const { data: authData, error: authError } = await this.supabase.auth.signUp({
                email: email,
                password: password
            });

            if (authError) {
                this.showNotification(authError.message, 'error');
                return;
            }

            // 2. Criar clínica
            const { data: clinicData, error: clinicError } = await this.supabase
                .from('clinics')
                .insert([{
                    name: clinicName,
                    email: email,
                    phone: phone,
                    address: address
                }])
                .select()
                .single();

            if (clinicError) {
                this.showNotification('Erro ao criar clínica: ' + clinicError.message, 'error');
                return;
            }

            // 3. Criar perfil do usuário
            const { error: profileError } = await this.supabase
                .from('profiles')
                .insert([{
                    id: authData.user.id,
                    name: adminName,
                    email: email,
                    clinic_id: clinicData.id,
                    permissions: ['clinica_admin']
                }]);

            if (profileError) {
                this.showNotification('Erro ao criar perfil: ' + profileError.message, 'error');
                return;
            }

            this.showNotification('Clínica cadastrada com sucesso! Verifique seu email para confirmar a conta.', 'success');
            this.showLogin();
            document.getElementById('register-form').reset();

        } catch (error) {
            console.error('Erro no cadastro:', error);
            this.showNotification('Erro de conexão', 'error');
        }
    }

    async handleAddUser() {
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const password = document.getElementById('user-password').value;
        
        const permissions = [];
        document.querySelectorAll('.permissions-grid input[type="checkbox"]:checked').forEach(checkbox => {
            permissions.push(checkbox.value);
        });

        try {
            // Método simplificado: criar convite para o usuário
            // O usuário receberá um email para definir a senha
            
            // 1. Criar usuário via signup normal (ele receberá email de confirmação)
            const { data: authData, error: authError } = await this.supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        name: name,
                        clinic_id: this.currentUser.clinic_id,
                        permissions: permissions
                    }
                }
            });

            if (authError) {
                if (authError.message.includes('already registered')) {
                    this.showNotification('Email já cadastrado. Usuário pode fazer login diretamente.', 'info');
                    this.hideModals();
                    document.getElementById('user-form').reset();
                    return;
                }
                this.showNotification('Erro ao criar usuário: ' + authError.message, 'error');
                return;
            }

            // 2. Criar perfil do usuário (se o signup foi bem-sucedido)
            if (authData.user) {
                const { error: profileError } = await this.supabase
                    .from('profiles')
                    .insert([{
                        id: authData.user.id,
                        name: name,
                        email: email,
                        clinic_id: this.currentUser.clinic_id,
                        permissions: permissions
                    }]);

                if (profileError) {
                    console.warn('Perfil será criado quando o usuário confirmar o email');
                }
            }

            this.showNotification('Convite enviado! O usuário receberá um email para confirmar a conta.', 'success');
            this.hideModals();
            document.getElementById('user-form').reset();
            this.loadUsers();

        } catch (error) {
            console.error('Erro ao adicionar usuário:', error);
            this.showNotification('Erro de conexão', 'error');
        }
    }

    async loadCurrentUser(authUser) {
        try {
            const { data: profile, error } = await this.supabase
                .from('profiles')
                .select(`
                    *,
                    clinics (
                        id,
                        name,
                        modules
                    )
                `)
                .eq('id', authUser.id)
                .single();

            if (error) {
                console.error('Erro ao carregar perfil:', error);
                return;
            }

            this.currentUser = {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                clinic_id: profile.clinic_id,
                clinic_name: profile.clinics?.name,
                permissions: profile.permissions || [],
                modules: profile.clinics?.modules || []
            };

            this.loadUserData();

        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
        }
    }

    loadUserData() {
        if (this.currentUser) {
            const userNameElement = document.getElementById('user-name');
            if (userNameElement) {
                userNameElement.textContent = this.currentUser.name;
            }
        }
    }

    async loadUsers() {
        try {
            if (!this.currentUser || !this.currentUser.clinic_id) {
                this.showNotification('Erro: dados do usuário não encontrados', 'error');
                return;
            }

            console.log('Carregando usuários para clínica:', this.currentUser.clinic_id);

            const { data: users, error } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('clinic_id', this.currentUser.clinic_id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Erro ao carregar usuários:', error);
                this.showNotification('Erro ao carregar usuários: ' + error.message, 'error');
                return;
            }

            console.log('Usuários carregados:', users);
            this.renderUsers(users || []);

        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            this.showNotification('Erro de conexão', 'error');
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
                    <span class="status-active">
                        ${user.active ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <button class="btn-secondary edit-user-btn" data-user-id="${user.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Update stats
        document.getElementById('total-users').textContent = users.length;

        // Adicionar event listeners para botões de editar
        document.querySelectorAll('.edit-user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.closest('button').dataset.userId;
                this.editUser(userId);
            });
        });
    }

    loadModules() {
        const modules = [
            {
                id: 'prescricao_ia',
                name: 'Prescrição Inteligente',
                description: 'IA para auxiliar na prescrição médica e sugestões de diagnóstico',
                icon: 'fas fa-prescription-bottle-alt',
                enabled: true
            },
            {
                id: 'transcricao_audio',
                name: 'Transcrição de Áudio',
                description: 'Transcrição automática de consultas e geração de resumos',
                icon: 'fas fa-microphone',
                enabled: true
            },
            {
                id: 'analise_historico',
                name: 'Análise de Histórico',
                description: 'Análise inteligente do histórico clínico do paciente',
                icon: 'fas fa-chart-line',
                enabled: false
            },
            {
                id: 'analise_exames',
                name: 'Análise de Exames',
                description: 'Interpretação automática de resultados de exames',
                icon: 'fas fa-file-medical',
                enabled: false
            }
        ];

        this.renderModules(modules);
    }

    renderModules(modules) {
        const grid = document.getElementById('modules-grid');
        grid.innerHTML = '';

        modules.forEach(module => {
            const card = document.createElement('div');
            card.className = 'module-card';
            card.innerHTML = `
                <h3>
                    <i class="${module.icon}"></i>
                    ${module.name}
                </h3>
                <p>${module.description}</p>
                <div class="module-status">
                    <i class="fas fa-circle ${module.enabled ? 'status-enabled' : 'status-disabled'}"></i>
                    ${module.enabled ? 'Habilitado' : 'Desabilitado'}
                </div>
            `;
            grid.appendChild(card);
        });

        // Update stats
        const activeModules = modules.filter(m => m.enabled).length;
        document.getElementById('active-modules').textContent = activeModules;
    }

    loadOverview() {
        // Stats já são carregadas quando os usuários e módulos são carregados
        this.loadUsers();
        this.loadModules();
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

    editUser(userId) {
        // Implementar edição de usuário
        this.showNotification('Funcionalidade em desenvolvimento', 'info');
    }

    async logout() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) {
                this.showNotification('Erro no logout: ' + error.message, 'error');
                return;
            }
            this.showNotification('Logout realizado com sucesso!', 'success');
            // O redirecionamento será feito automaticamente pelo onAuthStateChange
        } catch (error) {
            console.error('Erro no logout:', error);
            this.showNotification('Erro de conexão', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        // Adicionar estilos se não existirem
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    color: white;
                    z-index: 1001;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    min-width: 300px;
                    animation: slideIn 0.3s ease;
                }
                .notification-success { background: var(--success-color); }
                .notification-error { background: var(--danger-color); }
                .notification-info { background: var(--secondary-color); }
                .notification button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0;
                    margin-left: auto;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Exportar classe para inicialização controlada
window.AnalisAI = AnalisAI;