// Leva a tela para o topo (janela e, no modo retrato forçado, o contêiner #root, que passa a rolar).
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  const root = document.getElementById('root')
  if (root && root.scrollTop > 0) root.scrollTo({ top: 0, behavior: 'smooth' })
}
