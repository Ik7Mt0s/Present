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
// =============================================
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
const Galeria = {
    elemento: document.getElementById('galeria'),

    init() {
        this.criarEstrutura();
    },

    criarEstrutura() {
        this.elemento.innerHTML = '';
        
        for (let i = 1; i <= CONFIG.TOTAL_FOTOS; i++) {
            const fotoDiv = document.createElement('div');
            fotoDiv.className = 'foto-item fade-in';
            fotoDiv.setAttribute('data-index', i);
            
            const imgPath = `fotos/photo${i}.jpg`;
            
            fotoDiv.innerHTML = `
                <div class="foto-placeholder">
                    <i class="fas fa-heart"></i>
                    <span>Adicione sua foto aqui</span>
                    <small>${imgPath}</small>
                </div>
            `;
            
            this.elemento.appendChild(fotoDiv);
        }
    },

    // Método para carregar fotos reais (será chamado quando as fotos existirem)
    carregarFotos() {
        const fotos = document.querySelectorAll('.foto-item');
        fotos.forEach((foto, index) => {
            const img = new Image();
            img.src = `fotos/photo${index + 1}.jpg`;
            img.alt = `Foto ${index + 1} - Haylla Vitória`;
            img.onload = () => {
                foto.innerHTML = '';
                foto.appendChild(img);
            };
        });
    }
};

// =============================================
// MÓDULO: MÚSICA
// =============================================
const Musica = {
    audio: document.getElementById('backgroundMusic'),
    toggleBtn: document.getElementById('toggleMusic'),
    icon: document.getElementById('musicIcon'),
    isPlaying: false,

    init() {
        if (CONFIG.LINK_MUSICA) {
            this.audio.src = CONFIG.LINK_MUSICA;
        }
        
        this.audio.volume = 0.5; // Volume 50%
        this.toggleBtn.addEventListener('click', () => this.toggle());
        
        // Tentar tocar quando usuário interagir com a página
        document.body.addEventListener('click', () => this.tocarAutomatico(), { once: true });
    },

    toggle() {
        if (this.isPlaying) {
            this.audio.pause();
            this.icon.className = 'fas fa-play';
        } else {
            this.audio.play().catch(e => {
                console.log("Autoplay bloqueado:", e);
                alert("Clique em qualquer lugar da página para ativar a música");
            });
            this.icon.className = 'fas fa-pause';
        }
        this.isPlaying = !this.isPlaying;
    },

    tocarAutomatico() {
        if (!this.isPlaying && this.audio.paused) {
            this.audio.play().catch(e => console.log("Erro ao tocar música:", e));
            this.icon.className = 'fas fa-pause';
            this.isPlaying = true;
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
        this.botao.href = CONFIG.LINK_SPOTIFY;
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
    
    // Opcional: tentar carregar fotos reais após 1 segundo
    setTimeout(() => {
        Galeria.carregarFotos();
    }, 1000);
});