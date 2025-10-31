// Array de músicas de exemplo
// Cada objeto: { titulo, artista, capaUrl, audioUrl }
const musicas = [
	{
		titulo: '12 Horas/Pra Você Acreditar',
		artista: 'Panda, Humberto & Ronaldo, Ícaro e Gilmar',
		capaUrl: 'https://i.scdn.co/image/ab67616d0000b273a8a29125d82763c598901f23',
		audioUrl: 'https://p.scdn.co/mp3-preview/dd4c6ccaef04aa78419b63bd755f61701e22c024'
	},
	{
		titulo: 'Bring Me to Life',
		artista: 'Evanescence',
		capaUrl: 'https://i.scdn.co/image/ab67616d0000b273629dc9e2e3bc20bbd7d92e51',
		audioUrl: 'https://p.scdn.co/mp3-preview/7c2c32f2348073c0a3d8933f0f23caeba85c7c6c'
	},
	{
		titulo: 'Tempo Perdido',
		artista: 'Legião Urbana',
		capaUrl: 'https://i.scdn.co/image/ab67616d0000b273f29b566ee698471e54ee36c6',
		audioUrl: 'https://p.scdn.co/mp3-preview/a3a7d232ecd11890779e3fec4238f83278794e91'
	},
	{
		titulo: 'Na Sua Estante',
		artista: 'Pitty',
		capaUrl: 'assets/covers/cover4.jpg',
		audioUrl: 'assets/audio/na-sua-estante.mp3'
	},
	{
		titulo: 'Te Esqueci Sem Querer',
		artista: 'Henrique e Juliano',
		capaUrl: 'assets/covers/cover5.jpg',
		audioUrl: 'assets/audio/te-esqueci-sem-querer.mp3'
	},
	{
		titulo: 'Índia',
		artista: 'Leandro e Leonardo',
		capaUrl: 'assets/covers/cover6.jpg',
		audioUrl: 'assets/audio/india.mp3'
	},
	{
		titulo: 'Pelo Tempo Que Durar',
		artista: 'Marisa Monte',
		capaUrl: 'assets/covers/cover7.jpg',
		audioUrl: 'assets/audio/pelo-tempo-que-durar.mp3'
	},
	{
		titulo: 'Escondendo Ouro',
		artista: 'Zé Neto e Cristiano',
		capaUrl: 'assets/covers/cover8.jpg',
		audioUrl: 'assets/audio/escondendo-ouro.mp3'
	}
];

// Tornar disponível globalmente para que o script de UI possa usar
window.musicas = musicas;

// Exemplo: você pode iterar sobre `musicas` e preencher `#lista-de-musicas` no DOM
// (Implementação de render pode ser adicionada conforme solicitado.)

/**
 * Renderiza o array `musicas` dentro da div#lista-de-musicas
 * Mostra capa, título e artista para cada música.
 */
function renderMusicas(list = window.musicas) {
	const container = document.getElementById('lista-de-musicas');
	if (!container) {
		console.warn('Elemento #lista-de-musicas não encontrado no DOM.');
		return;
	}

	// Limpa conteúdo existente
	container.innerHTML = '';

	list.forEach((m, index) => {
		// Cria um card simples compatível com o CSS existente
		const card = document.createElement('article');
		card.className = 'card';

		card.innerHTML = `
			<img src="${m.capaUrl}" alt="Capa: ${escapeHtml(m.titulo)}" class="cover" />
			<div class="card-body">
				<h3>${escapeHtml(m.titulo)}</h3>
				<p class="meta">${escapeHtml(m.artista)}</p>
				<button class="play" data-id="${index}">▶ Tocar</button>
			</div>
		`;

		// Adiciona listener no botão
		const playButton = card.querySelector('.play');
		playButton.addEventListener('click', () => player.play(m));

		container.appendChild(card);
	});
}

// Pequena função utilitária para escapar texto inserido no HTML
function escapeHtml(str) {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

// Classe para gerenciar o player de música
class Player {
	constructor() {
		this.audio = new Audio();
		this.currentTrack = null;
		this.isPlaying = false;
		
		// Configurar volume inicial
		this.audio.volume = 0.7;
		
		// Eventos de áudio
		this.audio.addEventListener('ended', () => {
			this.isPlaying = false;
			this.updateButtons();
		});
	}

	play(musica) {
		// Se clicar na mesma música, alterna play/pause
		if (this.currentTrack === musica) {
			if (this.isPlaying) {
				this.pause();
			} else {
				this.resume();
			}
			return;
		}

		// Se for uma música diferente
		if (this.currentTrack) {
			this.pause();
		}

		// Configura e toca a nova música
		this.audio.src = musica.audioUrl;
		this.currentTrack = musica;
		this.audio.play();
		this.isPlaying = true;

		// Atualiza visual dos botões
		this.updateButtons();
	}

	pause() {
		this.audio.pause();
		this.isPlaying = false;
		this.updateButtons();
	}

	resume() {
		this.audio.play();
		this.isPlaying = true;
		this.updateButtons();
	}

	updateButtons() {
		// Atualiza todos os botões
		document.querySelectorAll('.play').forEach(btn => {
			const musicaId = btn.getAttribute('data-id');
			const isCurrentTrack = this.currentTrack && 
				this.currentTrack.titulo === musicas[musicaId].titulo;

			btn.textContent = isCurrentTrack && this.isPlaying ? '⏸ Pause' : '▶ Tocar';
			
			// Marca o card atual
			const card = btn.closest('.card');
			if (card) {
				if (isCurrentTrack) {
					card.setAttribute('aria-current', 'true');
				} else {
					card.removeAttribute('aria-current');
				}
			}
		});

		// Atualiza player fixo
		const cover = document.getElementById('nowPlayingCover');
		const title = document.getElementById('nowPlayingTitle');
		const artist = document.getElementById('nowPlayingArtist');

		if (this.currentTrack) {
			cover.src = this.currentTrack.capaUrl;
			cover.alt = `Capa: ${this.currentTrack.titulo}`;
			title.textContent = this.currentTrack.titulo;
			artist.textContent = this.currentTrack.artista;
		} else {
			cover.src = '';
			cover.alt = '';
			title.textContent = 'Selecione uma música';
			artist.textContent = '';
		}
	}
}

// Instância global do player
const player = new Player();

// Renderiza as músicas em destaque
function renderDestaque() {
	const container = document.querySelector('.featured-grid');
	if (!container) return;

	// Pega as 3 primeiras músicas para destaque
	const destaques = musicas.slice(0, 3);
	
	destaques.forEach((m, index) => {
		const card = document.createElement('article');
		card.className = 'card featured-card';
		
		card.innerHTML = `
			<img src="${m.capaUrl}" alt="Capa: ${escapeHtml(m.titulo)}" class="cover" />
			<div class="card-body">
				<h3>${escapeHtml(m.titulo)}</h3>
				<p class="meta">${escapeHtml(m.artista)}</p>
				<button class="play featured-play" data-id="${index}">▶ Tocar Agora</button>
			</div>
		`;

		container.appendChild(card);
		
		// Adiciona listener no botão
		const playButton = card.querySelector('.play');
		playButton.addEventListener('click', () => player.play(m));
	});
}

// Renderiza automaticamente ao carregar o script
document.addEventListener('DOMContentLoaded', function () {
	renderDestaque();
	renderMusicas();
	
	// Atualiza ano no footer
	const anoEl = document.getElementById('ano');
	if (anoEl) anoEl.textContent = new Date().getFullYear();

	// Controle de volume
	const volumeControl = document.getElementById('volume');
	if (volumeControl) {
		volumeControl.addEventListener('input', (e) => {
			player.audio.volume = e.target.value / 100;
		});
	}
});
