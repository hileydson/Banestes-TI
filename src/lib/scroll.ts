// Leva a tela para o topo (janela e, no modo retrato forçado, o contêiner #root, que passa a rolar).
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  const root = document.getElementById('root')
  if (root && root.scrollTop > 0) root.scrollTo({ top: 0, behavior: 'smooth' })
}

// Posição atual da rolagem (janela ou, no retrato forçado, o #root)
export function rolagemAtual(): number {
  const root = document.getElementById('root')
  return Math.max(window.scrollY, root?.scrollTop ?? 0)
}

export function rolarPara(y: number) {
  window.scrollTo({ top: y, behavior: 'smooth' })
  const root = document.getElementById('root')
  if (root && root.scrollHeight > root.clientHeight) root.scrollTo({ top: y, behavior: 'smooth' })
}
