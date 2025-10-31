// Array de músicas de exemplo
// Cada objeto: { titulo, artista, capaUrl }
const musicas = [
	{
		titulo: '12 Horas/Pra Você Acreditar',
		artista: 'Panda, Humberto & Ronaldo, Ícaro e Gilmar',
		capaUrl: 'cover1.jpg'
	},
	{
		titulo: 'Bring Me to Life',
		artista: 'Evanescence',
		capaUrl: 'cover2.jpg'
	},
	{
		titulo: 'Tempo Perdido',
		artista: 'Legião Urbana',
		capaUrl: 'cover3.jpg'
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

	list.forEach((m) => {
		// Cria um card simples compatível com o CSS existente
		const card = document.createElement('article');
		card.className = 'card';

		card.innerHTML = `
			<img src="${m.capaUrl}" alt="Capa: ${escapeHtml(m.titulo)}" class="cover" />
			<div class="card-body">
				<h3>${escapeHtml(m.titulo)}</h3>
				<p class="meta">${escapeHtml(m.artista)}</p>
				<button class="play">▶ Tocar</button>
			</div>
		`;

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

// Renderiza automaticamente ao carregar o script
document.addEventListener('DOMContentLoaded', function () {
	renderMusicas();
	const anoEl = document.getElementById('ano');
	if (anoEl) anoEl.textContent = new Date().getFullYear();
});
