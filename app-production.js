// Versão otimizada para produção - sem loops e CSP issues
class MediQAI {
    constructor() {
        this.currentUser = null;
        this.supabase = window.supabaseClient;
        this.isAuthProcessing = false;
        this.cardioState = {
            lastRisk: null,
            monitoring: [],
            isInsightsLoading: false,
            insightsRequestToken: 0,
            selectedCase: null,
            cases: this.buildCardioCases()
        };
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

        const cardioForm = document.getElementById('cardio-triage-form');
        if (cardioForm) {
            cardioForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCardioTriage();
            });
        }

        const cardioRefresh = document.getElementById('cardio-monitor-refresh');
        if (cardioRefresh) {
            cardioRefresh.addEventListener('click', () => {
                this.loadCardioMonitoring();
            });
        }

        const cardioInsights = document.getElementById('cardio-insights-btn');
        if (cardioInsights) {
            cardioInsights.dataset.defaultLabel = cardioInsights.innerHTML;
            cardioInsights.addEventListener('click', () => {
                this.generateCardioInsights({ manual: true });
            });
        }

        const caseSelect = document.getElementById('cardio-case-select');
        if (caseSelect) {
            this.populateCardioCases(caseSelect);
            caseSelect.addEventListener('change', (event) => {
                this.handleCardioCaseSelection(event.target.value);
            });
        }
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
        } else if (sectionId === 'cardio') {
            this.loadCardioMonitoring();
            this.renderCardioSummary();
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
                name: 'Cardiologia Assistida',
                description: 'Triagem, monitoramento e insights cardiológicos',
                icon: 'fas fa-heartbeat',
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

        const activeCount = modules.filter(module => module.enabled).length;
        const activeModulesEl = document.getElementById('active-modules');
        if (activeModulesEl) {
            activeModulesEl.textContent = activeCount;
        }
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

    handleCardioTriage() {
        const age = Number(document.getElementById('cardio-age').value);
        const gender = document.getElementById('cardio-gender').value;
        const systolic = Number(document.getElementById('cardio-systolic').value);
        const ldl = Number(document.getElementById('cardio-cholesterol').value);
        const diabetes = document.getElementById('cardio-diabetes').value;
        const smoker = document.getElementById('cardio-smoker').value;
        const symptoms = document.getElementById('cardio-symptoms').value.trim();

        if (!age || !gender || !systolic || !ldl || !diabetes || !smoker) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

        let score = 5;
        score += Math.max(0, age - 40) * 0.3;
        score += systolic > 120 ? (systolic - 120) * 0.2 : 0;
        score += ldl > 100 ? (ldl - 100) * 0.1 : 0;
        if (diabetes === 'yes') score += 10;
        if (smoker === 'yes') score += 8;
        if (gender === 'male') score += 2;
        if (symptoms) score += 3;

        const category = score >= 30 ? 'Alto' : score >= 15 ? 'Moderado' : 'Baixo';
        const recommendations = [];

        if (category === 'Alto') {
            recommendations.push('Encaminhar para avaliação cardiológica imediata.');
            recommendations.push('Solicitar exames complementares (ECG, troponina).');
        } else if (category === 'Moderado') {
            recommendations.push('Agendar consulta especializada em até 7 dias.');
            recommendations.push('Reforçar controle de fatores de risco e exames laboratoriais.');
        } else {
            recommendations.push('Manter acompanhamento clínico e prevenção primária.');
        }

        if (systolic >= 140) {
            recommendations.push('Avaliar manejo de hipertensão arterial.');
        }
        if (ldl >= 160) {
            recommendations.push('Considerar intensificação de terapia hipolipemiante.');
        }

        const result = {
            score: Math.round(score),
            category,
            recommendations,
            symptoms,
            inputs: {
                age,
                gender,
                systolic,
                ldl,
                diabetes,
                smoker
            },
            timestamp: Date.now(),
            caseId: this.cardioState.selectedCase
        };

        this.cardioState.lastRisk = result;
        this.renderCardioTriageResult(result);
        this.renderCardioSummary();
        this.generateCardioInsights();
    }

    renderCardioTriageResult(result) {
        const container = document.getElementById('cardio-triage-result');
        if (!container) return;

        const colorClass = result.category === 'Alto' ? 'risk-high' : result.category === 'Moderado' ? 'risk-medium' : 'risk-low';
        container.innerHTML = `
            <div class="cardio-result-header ${colorClass}">
                <span class="cardio-score">${result.score}</span>
                <div>
                    <strong>Risco ${result.category}</strong>
                    <p>Pontuação estimada para eventos cardiovasculares.</p>
                </div>
            </div>
            <div class="cardio-recommendations">
                ${result.recommendations.map(item => `<span class="cardio-badge">${item}</span>`).join('')}
            </div>
        `;
    }

    async loadCardioMonitoring() {
        const container = document.getElementById('cardio-monitoring');
        if (!container) return;

        container.innerHTML = '<p class="cardio-placeholder">Carregando dados...</p>';

        let monitoring = [];
        if (this.currentUser) {
            try {
                const { data } = await this.supabase
                    .from('cardio_monitoring')
                    .select('*')
                    .eq('clinic_id', this.currentUser.clinic_id)
                    .order('recorded_at', { ascending: false })
                    .limit(5);
                monitoring = data || [];
            } catch (error) {
                console.error('Erro ao carregar monitoramento cardiológico:', error);
            }
        }

        if (!monitoring.length) {
            monitoring = this.getCardioSampleData();
        }

        this.cardioState.monitoring = monitoring;
        this.renderCardioMonitoring(monitoring);
        this.renderCardioSummary();
        this.generateCardioInsights();
    }

    renderCardioMonitoring(monitoring) {
        const container = document.getElementById('cardio-monitoring');
        if (!container) return;

        if (!monitoring.length) {
            container.innerHTML = '<p class="cardio-placeholder">Nenhum dado encontrado.</p>';
            return;
        }

        container.innerHTML = monitoring.map(item => `
            <div class="cardio-monitor-row">
                <div>
                    <strong>${item.patient_name || 'Paciente'}</strong>
                    <p>${new Date(item.recorded_at || Date.now()).toLocaleString('pt-BR')}</p>
                </div>
                <div class="cardio-monitor-metrics">
                    <span class="metric">PA: ${item.systolic || '--'}/${item.diastolic || '--'} mmHg</span>
                    <span class="metric">FC: ${item.heart_rate || '--'} bpm</span>
                    <span class="metric">SatO₂: ${item.oxygen_saturation || '--'}%</span>
                </div>
            </div>
        `).join('');
    }

    getCardioSampleData() {
        const now = Date.now();
        return [
            {
                patient_name: 'Paciente A',
                systolic: 145,
                diastolic: 92,
                heart_rate: 88,
                oxygen_saturation: 96,
                recorded_at: new Date(now - 3600 * 1000).toISOString()
            },
            {
                patient_name: 'Paciente B',
                systolic: 118,
                diastolic: 76,
                heart_rate: 72,
                oxygen_saturation: 98,
                recorded_at: new Date(now - 7200 * 1000).toISOString()
            },
            {
                patient_name: 'Paciente C',
                systolic: 160,
                diastolic: 102,
                heart_rate: 94,
                oxygen_saturation: 94,
                recorded_at: new Date(now - 10800 * 1000).toISOString()
            }
        ];
    }

    async generateCardioInsights(options = {}) {
        const summaryEl = document.getElementById('cardio-insights-summary');
        if (!summaryEl) return;

        const contextParts = [];
        const insights = [];

        const risk = this.cardioState.lastRisk;
        if (risk) {
            const inputs = risk.inputs || {};
            const descriptors = [];
            if (inputs.age) descriptors.push(`${inputs.age} anos`);
            if (inputs.gender) descriptors.push(inputs.gender === 'male' ? 'sexo masculino' : 'sexo feminino');
            if (descriptors.length) {
                contextParts.push(`Paciente ${descriptors.join(', ')}.`);
            }
            contextParts.push(`Triagem cardiológica recente com risco ${risk.category.toLowerCase()} e pontuação ${risk.score}.`);
            if (inputs.systolic) contextParts.push(`Pressão sistólica: ${inputs.systolic} mmHg.`);
            if (inputs.ldl) contextParts.push(`LDL: ${inputs.ldl} mg/dL.`);
            contextParts.push(`Diabetes: ${inputs.diabetes === 'yes' ? 'sim' : 'não'}; Tabagismo: ${inputs.smoker === 'yes' ? 'sim' : 'não'}.`);
            if (risk.symptoms) {
                contextParts.push(`Sintomas relatados: ${risk.symptoms}.`);
                insights.push(`Sintomas relatados: ${risk.symptoms}.`);
            }
            insights.push(`Última triagem indica risco ${risk.category.toLowerCase()} (pontuação ${risk.score}).`);
            risk.recommendations.forEach(rec => insights.push(rec));
        }

        const monitoring = this.cardioState.monitoring || [];
        if (monitoring.length) {
            const recent = monitoring[0];
            const vitals = `PA ${recent.systolic || '--'}/${recent.diastolic || '--'} mmHg, FC ${recent.heart_rate || '--'} bpm, SatO₂ ${recent.oxygen_saturation || '--'}%.`;
            contextParts.push(`Sinais vitais mais recentes (${recent.patient_name || 'Paciente'}): ${vitals}`);
            insights.push(`Sinais vitais recentes: ${vitals}`);

            if (monitoring.length > 1) {
                const trend = monitoring.slice(0, 3).map(item => {
                    const label = item.patient_name || 'Paciente';
                    const timestamp = item.recorded_at ? new Date(item.recorded_at).toLocaleString('pt-BR') : 'Sem data';
                    return `${label} (${timestamp}) - PA ${item.systolic || '--'}/${item.diastolic || '--'} mmHg, FC ${item.heart_rate || '--'} bpm`;
                }).join(' | ');
                contextParts.push(`Histórico recente de monitoramento: ${trend}.`);
            }

            if (recent.systolic >= 140 || recent.diastolic >= 90) {
                insights.push('Pressão arterial recente acima do alvo recomendado.');
            }
            if (recent.heart_rate >= 100) {
                insights.push('Frequência cardíaca elevada requer investigação.');
            }
            if ((recent.oxygen_saturation || 0) < 94) {
                insights.push('Saturação de oxigênio abaixo do ideal para paciente cardiopata.');
            }
        }

        if (!insights.length) {
            summaryEl.textContent = options.manual ? 'Nenhum insight gerado: forneça dados de triagem ou monitoramento.' : 'Execute a triagem ou carregue dados de monitoramento para gerar recomendações.';
            return;
        }

        const fallbackText = this.buildProfessionalInsights(insights);
        summaryEl.textContent = fallbackText;

        const config = window.GEMINI_CONFIG || {};
        if (!config.apiKey) {
            return;
        }

        const requestToken = ++this.cardioState.insightsRequestToken;
        this.updateCardioInsightsLoading(true);

        try {
            summaryEl.textContent = 'Gerando insights com IA...';
            const prompt = this.buildCardioPrompt(contextParts);
            const aiText = await this.requestGeminiInsights(prompt);
            if (requestToken !== this.cardioState.insightsRequestToken) {
                return;
            }
            summaryEl.textContent = aiText || fallbackText;
        } catch (error) {
            console.error('Erro ao gerar insights com Gemini:', error);
            if (requestToken === this.cardioState.insightsRequestToken) {
                summaryEl.textContent = fallbackText;
            }
        } finally {
            if (requestToken === this.cardioState.insightsRequestToken) {
                this.updateCardioInsightsLoading(false);
            }
        }
    }

    updateCardioInsightsLoading(isLoading) {
        this.cardioState.isInsightsLoading = isLoading;
        const btn = document.getElementById('cardio-insights-btn');
        if (!btn) return;

        if (!btn.dataset.defaultLabel) {
            btn.dataset.defaultLabel = btn.innerHTML;
        }

        btn.disabled = isLoading;
        btn.innerHTML = isLoading ? '<i class="fas fa-spinner fa-spin"></i> Gerando...' : btn.dataset.defaultLabel;
    }

    buildCardioPrompt(contextParts) {
        const sanitizedParts = (contextParts || []).filter(Boolean);
        const contextText = sanitizedParts.length ? sanitizedParts.map(part => `- ${part}`).join('\n') : '- Dados insuficientes fornecidos.';
        return [
            'Você é um assistente clínico cardiologista. Analise os dados fornecidos e gere recomendações concisas.',
            'Considere condutas baseadas em boas práticas brasileiras (SBC) e destaque alertas críticos, ajustes terapêuticos e próximos passos diagnósticos.',
            'Dados clínicos:',
            contextText,
            'Responda em português do Brasil com até três recomendações acionáveis e um resumo curto (máximo 80 palavras). Não inclua informações pessoais ou qualquer dado que não esteja no contexto.'
        ].join('\n\n');
    }

    async requestGeminiInsights(prompt) {
        const config = window.GEMINI_CONFIG || {};
        if (!config.apiKey) return null;

        const model = config.model || 'gemini-1.5-flash';
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: prompt }]
                        }
                    ]
                })
            });

            if (!response.ok) {
                console.error('Gemini API retornou erro:', response.status, response.statusText);
                return null;
            }

            const data = await response.json();
            const parts = data?.candidates?.[0]?.content?.parts || [];
            const text = parts.map(part => part.text).join(' ').trim();
            return text || null;
        } catch (error) {
            console.error('Erro na requisição à Gemini API:', error);
            return null;
        }
    }

    buildCardioCases() {
        return [
            {
                id: 'angina_estavel',
                label: 'Angina estável em paciente hipertenso',
                summary: 'Paciente masculino, 58 anos, hipertenso de longa data, com episódios de dor torácica aos esforços e alívio com repouso.',
                background: 'Histórico: HAS há 12 anos, LDL 172 mg/dL, tabagismo cessado há 5 anos. Medicamentos atuais: losartana 50 mg 2x/dia, AAS 100 mg/dia.',
                guideline: 'Diretrizes SBC 2021 sugerem otimizar antianginosos, controle rigoroso de PA (<130/80 mmHg) e meta de LDL < 70 mg/dL.',
                monitoring: [
                    {
                        patient_name: 'Paciente - Última consulta',
                        systolic: 148,
                        diastolic: 88,
                        heart_rate: 82,
                        oxygen_saturation: 97,
                        recorded_at: new Date().toISOString()
                    },
                    {
                        patient_name: 'Paciente - Consulta anterior',
                        systolic: 154,
                        diastolic: 92,
                        heart_rate: 86,
                        oxygen_saturation: 96,
                        recorded_at: new Date(Date.now() - 86400000).toISOString()
                    }
                ],
                form: {
                    age: 58,
                    gender: 'male',
                    systolic: 148,
                    ldl: 172,
                    diabetes: 'no',
                    smoker: 'no',
                    symptoms: 'Dor torácica em aperto aos esforços, com alívio ao repouso.'
                }
            },
            {
                id: 'insuficiencia_cardiaca',
                label: 'Insuficiência cardíaca com possível descompensação',
                summary: 'Paciente feminina, 72 anos, com insuficiência cardíaca FE reduzida, relata dispneia aos mínimos esforços e edemas em MMII.',
                background: 'Histórico: IC com FE 32%, diabetes tipo 2, DRC estágio 3. Medicamentos: carvedilol 12,5 mg 2x/dia, sacubitril-valsartana 49/51 mg 2x/dia, furosemida 40 mg/dia.',
                guideline: 'SBC/DEIC 2021 recomendam monitorização de peso diário, ajuste de diuréticos frente a ganho agudo e avaliação de BNP para estratificação.',
                monitoring: [
                    {
                        patient_name: 'Paciente - Hoje',
                        systolic: 118,
                        diastolic: 72,
                        heart_rate: 94,
                        oxygen_saturation: 93,
                        recorded_at: new Date().toISOString()
                    },
                    {
                        patient_name: 'Paciente - 2 dias atrás',
                        systolic: 126,
                        diastolic: 76,
                        heart_rate: 88,
                        oxygen_saturation: 94,
                        recorded_at: new Date(Date.now() - 172800000).toISOString()
                    }
                ],
                form: {
                    age: 72,
                    gender: 'female',
                    systolic: 118,
                    ldl: 96,
                    diabetes: 'yes',
                    smoker: 'no',
                    symptoms: 'Dispneia aos mínimos esforços, ortopneia, edema em membros inferiores.'
                }
            },
            {
                id: 'pos_infarto',
                label: 'Reavaliação pós-infarto com stent',
                summary: 'Paciente masculino, 65 anos, pós IAM com stent farmacológico há 3 meses, em reabilitação cardíaca.',
                background: 'Histórico: IAM com supradesnivelamento, FE 48%, HAS controlada, dislipidemia. Medicações: ticagrelor 90 mg 2x/dia, AAS 100 mg/dia, atorvastatina 80 mg/dia, carvedilol 25 mg 2x/dia.',
                guideline: 'Diretrizes SBC 2022 enfatizam manter dupla antiagregação por 12 meses, reforço da reabilitação e metas de LDL < 55 mg/dL.',
                monitoring: [
                    {
                        patient_name: 'Paciente - Consulta atual',
                        systolic: 122,
                        diastolic: 76,
                        heart_rate: 68,
                        oxygen_saturation: 98,
                        recorded_at: new Date().toISOString()
                    },
                    {
                        patient_name: 'Paciente - Semana passada',
                        systolic: 128,
                        diastolic: 78,
                        heart_rate: 72,
                        oxygen_saturation: 97,
                        recorded_at: new Date(Date.now() - 604800000).toISOString()
                    }
                ],
                form: {
                    age: 65,
                    gender: 'male',
                    systolic: 122,
                    ldl: 89,
                    diabetes: 'no',
                    smoker: 'no',
                    symptoms: 'Cansaço leve na esteira, sem dor torácica, adesão parcial às orientações dietéticas.'
                }
            }
        ];
    }

    populateCardioCases(selectEl) {
        if (!selectEl) return;
        const options = this.cardioState.cases || [];
        options.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.label;
            selectEl.appendChild(option);
        });
    }

    handleCardioCaseSelection(caseId) {
        this.cardioState.selectedCase = caseId || null;
        const selected = (this.cardioState.cases || []).find(item => item.id === caseId);

        if (selected?.form) {
            const form = selected.form;
            document.getElementById('cardio-age').value = form.age;
            document.getElementById('cardio-gender').value = form.gender;
            document.getElementById('cardio-systolic').value = form.systolic;
            document.getElementById('cardio-cholesterol').value = form.ldl;
            document.getElementById('cardio-diabetes').value = form.diabetes;
            document.getElementById('cardio-smoker').value = form.smoker;
            document.getElementById('cardio-symptoms').value = form.symptoms || '';
        }

        if (selected?.monitoring) {
            this.cardioState.monitoring = selected.monitoring;
            this.renderCardioMonitoring(selected.monitoring);
        }

        this.renderCardioSummary();
        this.generateCardioInsights({ manual: true });
    }

    renderCardioSummary() {
        const summaryEl = document.getElementById('cardio-patient-summary');
        const backgroundEl = document.getElementById('cardio-patient-background');
        const guidelineEl = document.getElementById('cardio-guideline-note');

        if (!summaryEl || !backgroundEl || !guidelineEl) return;

        const selected = this.cardioState.cases?.find(item => item.id === this.cardioState.selectedCase);
        const risk = this.cardioState.lastRisk;
        const monitoring = this.cardioState.monitoring;

        if (!selected && !risk) {
            summaryEl.innerHTML = '<p class="cardio-placeholder">Selecione um caso ou preencha a triagem para visualizar o resumo.</p>';
            backgroundEl.innerHTML = '';
            guidelineEl.innerHTML = '';
            return;
        }

        const summaryParts = [];
        if (selected?.summary) {
            summaryParts.push(`<strong>Resumo clínico:</strong> ${selected.summary}`);
        }
        if (risk) {
            summaryParts.push(`<strong>Triagem recente:</strong> Risco ${risk.category.toLowerCase()} (pontuação ${risk.score}).`);
        }
        if (monitoring && monitoring.length) {
            const recent = monitoring[0];
            summaryParts.push(`<strong>Sinais vitais recentes:</strong> PA ${recent.systolic || '--'}/${recent.diastolic || '--'} mmHg, FC ${recent.heart_rate || '--'} bpm, SatO₂ ${recent.oxygen_saturation || '--'}%.`);
        }

        summaryEl.innerHTML = summaryParts.join('<br>');
        backgroundEl.innerHTML = selected?.background ? `<strong>Histórico terapêutico:</strong> ${selected.background}` : '';
        guidelineEl.innerHTML = selected?.guideline ? `<strong>Diretrizes:</strong> ${selected.guideline}` : '';
    }

    buildProfessionalInsights(insights) {
        if (!insights || !insights.length) return '';

        const structured = insights.slice(0, 5).map((item, index) => {
            return `${index + 1}. ${item}`;
        });

        return structured.join('\n');
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MediQAI();
});