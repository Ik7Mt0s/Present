/**
 * Site de Aniversário de 2 Anos - Haylla Vitória
 * Autor: Desenvolvido com ❤️
 * Data: Fevereiro 2026
 */

// =============================================
// CONFIGURAÇÕES - ÁREA EDITÁVEL PELO USUÁRIO
// =============================================
const CONFIG = {
    // Data do relacionamento (ano, mês, dia)
    DATA_INICIO: new Date(2024, 1, 25), // 25 de Fevereiro de 2024
    
    // Link da playlist do Spotify
    LINK_SPOTIFY: "https://open.spotify.com/playlist/6k82eg1Atd5buqg0L3fM6O?si=a5f318d876ab4970",
    
    // Link da música de fundo (formato MP3)
    LINK_MUSICA: "audio/Unwritten.mp3",
    
    // Número de fotos na galeria
    TOTAL_FOTOS: 6,
    
    // Nome da pessoa amada
    NOME_NAMORADA: "Haylla Vitória"
};

// =============================================
// MÓDULO: CONTADOR DE TEMPO
//==============================================
const Contador = {
    elementos: {
        anos: document.getElementById('anos'),
        meses: document.getElementById('meses'),
        dias: document.getElementById('dias'),
        dataInicio: document.getElementById('dataInicio')
    },

    init() {
        this.atualizar();
        // Atualizar a cada dia
        setInterval(() => this.atualizar(), 24 * 60 * 60 * 1000);
    },

    atualizar() {
        const hoje = new Date();
        const inicio = CONFIG.DATA_INICIO;
        
        // Cálculos precisos
        let anos = hoje.getFullYear() - inicio.getFullYear();
        let meses = hoje.getMonth() - inicio.getMonth();
        let dias = hoje.getDate() - inicio.getDate();

        // Ajustes para dias negativos
        if (dias < 0) {
            meses--;
            const ultimoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
            dias += ultimoMes.getDate();
        }
        
        // Ajustes para meses negativos
        if (meses < 0) {
            anos--;
            meses += 12;
        }

        // Atualizar DOM
        this.elementos.anos.textContent = anos;
        this.elementos.meses.textContent = meses;
        this.elementos.dias.textContent = dias;
    }
};

// =============================================
// MÓDULO: GALERIA DE FOTOS
// =============================================
// =============================================
// MÓDULO: GALERIA DE FOTOS (VERSÃO CORRIGIDA)
// =============================================
const Galeria = {
    elemento: document.getElementById('galeria'),

    init() {
        this.criarEstrutura();
        // CHAMAR O CARREGAMENTO DAS FOTOS IMEDIATAMENTE
        this.carregarFotos();
    },

    criarEstrutura() {
        this.elemento.innerHTML = '';
        
        for (let i = 1; i <= CONFIG.TOTAL_FOTOS; i++) {
            const fotoDiv = document.createElement('div');
            fotoDiv.className = 'foto-item fade-in';
            fotoDiv.setAttribute('data-index', i);
            
            // Placeholder temporário
            fotoDiv.innerHTML = `
                <div class="foto-placeholder">
                    <i class="fas fa-heart"></i>
                    <span>Carregando foto ${i}...</span>
                </div>
            `;
            
            this.elemento.appendChild(fotoDiv);
        }
    },

    // Método para carregar fotos reais
    carregarFotos() {
        console.log("📸 Tentando carregar fotos...");
        const fotos = document.querySelectorAll('.foto-item');
        
        fotos.forEach((foto, index) => {
            const numeroFoto = index + 1;
            const img = new Image();
            
            // CAMINHO CORRETO DAS FOTOS
            img.src = `fotos/photo${numeroFoto}.jpg`;
            img.alt = `Foto ${numeroFoto} - ${CONFIG.NOME_NAMORADA}`;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            
            img.onload = () => {
                console.log(`✅ Foto ${numeroFoto} carregada com sucesso!`);
                // Substitui o placeholder pela imagem
                foto.innerHTML = '';
                foto.appendChild(img);
            };
            
            img.onerror = () => {
                console.log(`❌ Erro ao carregar foto ${numeroFoto}`);
                // Mostra mensagem de erro no placeholder
                foto.innerHTML = `
                    <div class="foto-placeholder" style="background: rgba(255,0,0,0.2);">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Erro ao carregar</span>
                        <small>fotos/photo${numeroFoto}.jpg</small>
                    </div>
                `;
            };
        });
    }
};

// =============================================
// MÓDULO: MÚSICA (VERSÃO ESPECIAL PARA IPHONE/ANDROID)
// =============================================
const Musica = {
    audio: document.getElementById('backgroundMusic'),
    toggleBtn: document.getElementById('toggleMusic'),
    control: document.querySelector('.musica-controle'), // Pegando pelo seletor de classe
    icon: document.getElementById('musicIcon'),
    isPlaying: false,
    audioReady: false,
    userInteracted: false,

    init() {
        // Verificar se os elementos existem
        if (!this.audio || !this.toggleBtn) {
            console.warn('⚠️ Elementos de música não encontrados');
            return;
        }

        // Configurar áudio
        if (CONFIG.LINK_MUSICA) {
            this.audio.src = CONFIG.LINK_MUSICA;
        }
        
        // Configurações essenciais para iOS/iPhone
        this.audio.volume = 0.5;
        this.audio.preload = "auto";
        this.audio.setAttribute('playsinline', '');
        this.audio.setAttribute('webkit-playsinline', '');
        
        // Pré-carregar
        this.audio.load();
        
        // Verificar se o áudio está pronto
        this.audio.addEventListener('canplaythrough', () => {
            this.audioReady = true;
            console.log('🎵 Áudio pronto para tocar');
        });

        this.audio.addEventListener('error', (e) => {
            console.error('❌ Erro no áudio:', e);
        });
        
        // Adicionar evento de clique no botão
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', (e) => this.toggle(e));
        }
        
        // Adicionar evento de toque para iPhone (mais responsivo)
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.toggle(e);
            });
        }
        
        // Se tiver o controle inteiro, adicionar evento também
        if (this.control) {
            this.control.addEventListener('click', (e) => {
                // Não fazer nada se clicou no botão (já tratado)
                if (e.target.closest('.botao-musica')) return;
                this.toggle(e);
            });
        }
        
        // Detectar primeira interação do usuário com a página
        document.body.addEventListener('touchstart', () => this.unlockAudio(), { once: true });
        document.body.addEventListener('click', () => this.unlockAudio(), { once: true });
        
        console.log('🎵 Música inicializada - modo iPhone/Android');
    },

    unlockAudio() {
        if (this.userInteracted || !this.audio) return;
        
        console.log('👆 Usuário interagiu - desbloqueando áudio');
        this.userInteracted = true;
        
        // Tocar e pausar rapidamente para "desbloquear" o áudio
        this.audio.play()
            .then(() => {
                this.audio.pause();
                this.audio.currentTime = 0;
                console.log('🔓 Áudio desbloqueado!');
            })
            .catch(e => console.log('Aguardando interação direta com o botão'));
    },

    toggle(event) {
        // IMPORTANTE: Prevenir comportamento padrão
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        if (!this.audioReady) {
            alert('🎵 Áudio ainda está carregando... tente novamente');
            return;
        }
        
        if (this.isPlaying) {
            // PAUSAR
            this.audio.pause();
            if (this.icon) this.icon.className = 'fas fa-play';
            this.isPlaying = false;
            console.log('⏸️ Música pausada');
        } else {
            // TOCAR - com tratamento especial para iPhone
            const playPromise = this.audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Sucesso!
                    if (this.icon) this.icon.className = 'fas fa-pause';
                    this.isPlaying = true;
                    console.log('✅ Música tocando!');
                }).catch(error => {
                    // Erro!
                    console.error('❌ Erro ao tocar:', error);
                    
                    // Mensagem específica para iPhone
                    if (error.name === 'NotAllowedError') {
                        alert('No iPhone, toque NOVAMENTE no botão (a primeira vez só prepara o áudio)');
                    } else if (error.name === 'NotSupportedError') {
                        alert('Formato de áudio não suportado. Use MP3.');
                    }
                    
                    // Resetar o ícone
                    if (this.icon) this.icon.className = 'fas fa-play';
                });
            }
        }
    }
};

// =============================================
// MÓDULO: CORAÇÕES FLUTUANTES
// =============================================
const Coracoes = {
    container: document.getElementById('heartsContainer'),
    interval: null,

    init() {
        if (!this.container) return;
        this.interval = setInterval(() => this.criar(), 300);
    },

    criar() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 2 + 1) + 'rem';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        
        // Tons de rosa/roxo
        heart.style.color = `hsl(${Math.random() * 20 + 320}, 70%, 60%)`;
        
        this.container.appendChild(heart);
        
        // Remover após animação
        setTimeout(() => {
            heart.remove();
        }, 6000);
    },

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
};

// =============================================
// MÓDULO: ANIMAÇÕES DE SCROLL
// =============================================
const ScrollAnimations = {
    observer: null,

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger effect: delay baseado no índice
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                    
                    // Parar de observar após ativar
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observar elementos
        document.querySelectorAll('.fade-in').forEach(el => {
            this.observer.observe(el);
        });
    }
};

// =============================================
// MÓDULO: SPOTIFY
// =============================================
const Spotify = {
    botao: document.getElementById('spotifyButton'),

    init() {
        if (this.botao && CONFIG.LINK_SPOTIFY) {
            this.botao.href = CONFIG.LINK_SPOTIFY;
        }
    }
};

// =============================================
// INICIALIZAÇÃO
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Site inicializado com sucesso!');
    
    // Inicializar todos os módulos
    Contador.init();
    Galeria.init();
    Musica.init();
    Coracoes.init();
    ScrollAnimations.init();
    Spotify.init();
    
    // Tentar carregar fotos reais após 1 segundo
    setTimeout(() => {
        Galeria.carregarFotos();
    }, 1000);
});