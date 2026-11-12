import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Headphones,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Square,
  Trash2
} from 'lucide-react'
import { useSession } from '../lib/session'
import { materiaDoCargo, type MateriaCargo } from '../lib/cargos'
import { blocos, loadEstudo, trechosParaFala, type Assunto, type Bloco } from '../lib/estudo'
import { falaSuportada, useFala } from '../lib/fala'
import { rolagemAtual, rolarPara, scrollToTop } from '../lib/scroll'

export default function Estudo() {
  const [assuntos, setAssuntos] = useState<Assunto[] | null>(null)
  const [params] = useSearchParams()
  const { cargo } = useSession()
  useEffect(() => {
    setAssuntos(null)
    loadEstudo(cargo.id).then(setAssuntos)
  }, [cargo.id])

  if (!assuntos) return <p className="muted">Carregando conteúdo…</p>

  const a = params.get('a')
  const m = params.get('m')
  const assunto = a ? assuntos.find((x) => x.id === a) : undefined
  if (assunto) {
    const daMateria = assuntos.filter((x) => x.materia === assunto.materia)
    return <AssuntoView key={assunto.id} assunto={assunto} lista={daMateria} retomar={params.get('r') === '1'} />
  }
  if (m && materiaDoCargo(cargo, m)) return <MateriaView materia={m} lista={assuntos.filter((x) => x.materia === m)} />
  return <EstudoInicio assuntos={assuntos} />
}

const linkAssunto = (x: Assunto, retomar = false) => `/estudo?m=${x.materia}&a=${x.id}${retomar ? '&r=1' : ''}`

/* ------------------------------------------------------------------ */
/* Tela inicial: pausa + matérias                                      */
/* ------------------------------------------------------------------ */
function EstudoInicio({ assuntos }: { assuntos: Assunto[] }) {
  const { estudo, updateEstudo, cargo } = useSession()
  const nav = useNavigate()
  const pausado = estudo.pausa ? assuntos.find((x) => x.id === estudo.pausa!.assunto) : undefined
  const feitos = assuntos.filter((x) => estudo.entendidos[x.id]).length

  return (
    <div className="estudo">
      <h2 className="page-title">
        <BookOpen /> Estudo
      </h2>
      <p className="muted">
        Resumos de tudo o que cai na prova, por matéria e assunto. Toque em <Headphones size={14} style={{ verticalAlign: '-2px' }} /> <b>Ouvir</b> para
        escutar o texto e marque os assuntos que você já entendeu.
      </p>

      {pausado && (
        <motion.div className="glass estudo-pausa" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="estudo-pausa-info">
            <small className="muted">
              <Pause size={14} /> Você parou em
            </small>
            <MateriaChip id={pausado.materia} />
            <strong>{pausado.titulo}</strong>
            {estudo.pausa!.trecho > 0 && <small className="muted">Áudio parado no trecho {estudo.pausa!.trecho + 1}</small>}
          </div>
          <motion.button
            className="start-btn continuar estudo-continuar"
            onClick={() => nav(linkAssunto(pausado, true))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          >
            <span className="pulse" />
            <span className="pulse delay" />
            <Play size={30} fill="currentColor" />
            <b>CONTINUAR</b>
          </motion.button>
          <button className="link-btn" onClick={() => updateEstudo((e) => ({ ...e, pausa: null }))}>
            <Trash2 size={14} /> Descartar a pausa
          </button>
        </motion.div>
      )}

      <div className="glass estudo-geral">
        <div className="estudo-geral-top">
          <span>Assuntos que você já entendeu</span>
          <b>
            {feitos}/{assuntos.length}
          </b>
        </div>
        <Barra valor={feitos} total={assuntos.length} cor="#34d399" />
      </div>

      <div className="estudo-materias">
        {cargo.materias.map((m, i) => {
          const lista = assuntos.filter((x) => x.materia === m.id)
          const ok = lista.filter((x) => estudo.entendidos[x.id]).length
          return (
            <motion.button
              key={m.id}
              className="glass estudo-materia"
              style={{ borderLeftColor: m.cor }}
              onClick={() => nav(`/estudo?m=${m.id}`)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="estudo-materia-top">
                <strong>{m.nome}</strong>
                <ChevronRight size={18} />
              </div>
              <small className="muted">
                {lista.length} assuntos · {ok} entendidos
              </small>
              <Barra valor={ok} total={lista.length} cor={m.cor} />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Lista de assuntos de uma matéria                                    */
/* ------------------------------------------------------------------ */
function MateriaView({ materia, lista }: { materia: string; lista: Assunto[] }) {
  const { estudo } = useSession()
  const nav = useNavigate()
  const { cargo } = useSession()
  const m = materiaDoCargo(cargo, materia)!
  const ok = lista.filter((x) => estudo.entendidos[x.id]).length
  const grupos = [...new Set(lista.map((x) => x.grupo))]
  useEffect(() => scrollToTop(), [])

  return (
    <div className="estudo">
      <button className="btn ghost sm estudo-voltar" onClick={() => nav('/estudo')}>
        <ArrowLeft size={16} /> Matérias
      </button>
      <h2 className="page-title" style={{ color: m.cor }}>
        {m.nome}
      </h2>
      <div className="glass estudo-geral">
        <div className="estudo-geral-top">
          <span>Entendidos</span>
          <b>
            {ok}/{lista.length}
          </b>
        </div>
        <Barra valor={ok} total={lista.length} cor={m.cor} />
      </div>
      {grupos.map((g) => (
        <Fragment key={g}>
          {grupos.length > 1 && <h3 className="sub-title estudo-grupo">{g}</h3>}
          <div className="glass estudo-lista">
            {lista
              .filter((x) => x.grupo === g)
              .map((x) => {
                const feito = !!estudo.entendidos[x.id]
                const parado = estudo.pausa?.assunto === x.id
                return (
                  <button key={x.id} className={'estudo-item' + (feito ? ' feito' : '')} onClick={() => nav(linkAssunto(x))}>
                    {feito ? <CheckCircle2 size={20} className="txt-ok" /> : <Circle size={20} className="muted" />}
                    <span className="estudo-item-titulo">{x.titulo}</span>
                    {parado && (
                      <span className="badge subtle" title="Você parou aqui">
                        <MapPin size={12} /> parou aqui
                      </span>
                    )}
                    <ChevronRight size={16} className="muted" />
                  </button>
                )
              })}
          </div>
        </Fragment>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Conteúdo de um assunto + leitura em voz                             */
/* ------------------------------------------------------------------ */
function AssuntoView({ assunto, lista, retomar }: { assunto: Assunto; lista: Assunto[]; retomar: boolean }) {
  const { estudo, updateEstudo, cargo } = useSession()
  const nav = useNavigate()
  const bs = useMemo(() => blocos(assunto.corpo), [assunto])
  const trechos = useMemo(() => trechosParaFala(assunto.titulo, bs), [assunto, bs])
  const fala = useFala(trechos)
  const entendido = !!estudo.entendidos[assunto.id]
  const pos = lista.findIndex((x) => x.id === assunto.id)
  const anterior = lista[pos - 1]
  const proximo = lista[pos + 1]
  const minutos = Math.max(1, Math.round(assunto.corpo.split(/\s+/).length / 170))
  const blocoAtivo = fala.estado === 'falando' ? trechos[fala.indice]?.bloco : undefined

  // Abrir: retoma a rolagem/áudio da pausa ou começa do topo
  useEffect(() => {
    const p = estudo.pausa
    if (retomar && p?.assunto === assunto.id) {
      fala.posicionar(p.trecho)
      const t = setTimeout(() => rolarPara(p.rolagem), 380) // depois da animação de entrada
      return () => clearTimeout(t)
    }
    scrollToTop()
    // passa a ser o ponto onde o aluno parou
    updateEstudo((e) => ({ ...e, pausa: { assunto: assunto.id, rolagem: 0, trecho: 0, updatedAt: Date.now() } }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Posição da rolagem acompanhada enquanto lê (ao sair da tela a página já mudou e a rolagem não vale mais)
  const rolagemRef = useRef(retomar && estudo.pausa?.assunto === assunto.id ? estudo.pausa.rolagem : 0)
  useEffect(() => {
    const onScroll = () => {
      rolagemRef.current = Math.round(rolagemAtual())
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const root = document.getElementById('root')
    root?.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      root?.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Guarda onde parou (assunto, rolagem e trecho do áudio) ao sair da tela ou ao fechar o app
  const salvarRef = useRef<() => void>(() => {})
  salvarRef.current = () =>
    updateEstudo((e) => ({ ...e, pausa: { assunto: assunto.id, rolagem: rolagemRef.current, trecho: fala.indiceRef.current, updatedAt: Date.now() } }))
  useEffect(() => {
    const vis = () => {
      if (document.visibilityState === 'hidden') salvarRef.current()
    }
    document.addEventListener('visibilitychange', vis)
    return () => {
      document.removeEventListener('visibilitychange', vis)
      salvarRef.current()
    }
  }, [])

  // Enquanto fala, acompanha o parágrafo que está sendo lido
  const refs = useRef<(HTMLElement | null)[]>([])
  useEffect(() => {
    if (blocoAtivo === undefined || blocoAtivo < 0) return
    refs.current[blocoAtivo]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [blocoAtivo])

  const pausarEstudo = () => {
    fala.pausar()
    salvarRef.current()
    nav('/estudo')
  }

  const marcar = () =>
    updateEstudo((e) => {
      const ent = { ...e.entendidos }
      if (ent[assunto.id]) delete ent[assunto.id]
      else ent[assunto.id] = Date.now()
      return { ...e, entendidos: ent }
    })

  const m = materiaDoCargo(cargo, assunto.materia)!
  return (
    <div className="estudo estudo-assunto">
      <div className="row gap estudo-topo">
        <button className="btn ghost sm" onClick={() => nav(`/estudo?m=${assunto.materia}`)}>
          <ArrowLeft size={16} /> {m.curto}
        </button>
        <button className="btn ghost sm" onClick={pausarEstudo}>
          <Pause size={16} /> Pausar estudo
        </button>
      </div>

      <MateriaChip id={assunto.materia} />
      <h2 className="estudo-titulo">{assunto.titulo}</h2>
      <small className="muted">
        {assunto.grupo} · assunto {pos + 1} de {lista.length} · ~{minutos} min de leitura
      </small>

      <Player fala={fala} />

      <article className="glass estudo-texto">
        {bs.map((b, i) => (
          <BlocoView key={i} b={b} ativo={i === blocoAtivo} refEl={(el) => (refs.current[i] = el)} />
        ))}
      </article>

      <motion.button className={'btn big estudo-entendi' + (entendido ? ' feito' : '')} onClick={marcar} whileTap={{ scale: 0.97 }}>
        {entendido ? <CheckCircle2 size={20} /> : <Circle size={20} />}
        {entendido ? 'Entendido! (toque para desmarcar)' : 'Já entendi este assunto'}
      </motion.button>

      <div className="quiz-nav">
        <button className="btn ghost" disabled={!anterior} onClick={() => anterior && nav(linkAssunto(anterior))}>
          <ArrowLeft size={18} /> Anterior
        </button>
        {proximo ? (
          <button className="btn primary" onClick={() => nav(linkAssunto(proximo))}>
            Próximo <ArrowRight size={18} />
          </button>
        ) : (
          <button className="btn primary" onClick={() => nav(`/estudo?m=${assunto.materia}`)}>
            Fim da matéria <CheckCircle2 size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

function Player({ fala }: { fala: ReturnType<typeof useFala> }) {
  if (!falaSuportada())
    return <p className="muted small">Este aparelho/navegador não oferece leitura em voz alta.</p>
  const { estado, indice, total, velocidade } = fala
  const andamento = total ? ((estado === 'parado' ? 0 : indice + 1) / total) * 100 : 0
  return (
    <div className="glass estudo-player">
      {estado === 'falando' ? (
        <button className="btn primary player-main" onClick={fala.pausar} aria-label="Pausar áudio">
          <Pause size={18} /> Pausar
        </button>
      ) : (
        <button className="btn primary player-main" onClick={fala.tocar} aria-label="Ouvir">
          {estado === 'pausado' ? <Play size={18} /> : <Headphones size={18} />} {estado === 'pausado' ? 'Continuar' : 'Ouvir'}
        </button>
      )}
      <button className="icon-btn" onClick={() => fala.pular(-1)} aria-label="Trecho anterior" disabled={estado === 'parado'}>
        <SkipBack size={18} />
      </button>
      <button className="icon-btn" onClick={() => fala.pular(1)} aria-label="Próximo trecho" disabled={estado === 'parado'}>
        <SkipForward size={18} />
      </button>
      <button className="icon-btn" onClick={fala.parar} aria-label="Parar e voltar ao início" disabled={estado === 'parado'}>
        {estado === 'pausado' ? <RotateCcw size={18} /> : <Square size={16} />}
      </button>
      <button
        className="btn ghost sm player-vel"
        onClick={() => fala.mudarVelocidade(VELOCIDADES[(VELOCIDADES.indexOf(velocidade) + 1) % VELOCIDADES.length] ?? 1)}
        aria-label="Velocidade"
      >
        {String(velocidade).replace('.', ',')}x
      </button>
      <div className="player-barra">
        <div style={{ width: `${andamento}%` }} />
      </div>
      {fala.erro && <small className="player-erro">{fala.erro}</small>}
      {estado !== 'parado' && (
        <small className="muted player-pos">
          trecho {indice + 1} de {total}
        </small>
      )}
    </div>
  )
}
const VELOCIDADES = [1, 1.25, 1.5, 1.75, 0.85]

function BlocoView({ b, ativo, refEl }: { b: Bloco; ativo: boolean; refEl(el: HTMLElement | null): void }) {
  const cls = ativo ? 'lendo' : undefined
  if (b.tipo === 'h')
    return (
      <h3 ref={refEl} className={cls}>
        {inline(b.texto)}
      </h3>
    )
  if (b.tipo === 'dica')
    return (
      <div ref={refEl} className={'estudo-dica' + (ativo ? ' lendo' : '')}>
        💡 {inline(b.texto)}
      </div>
    )
  if (b.tipo === 'lista')
    return (
      <ul ref={refEl} className={cls}>
        {b.itens.map((it, i) => (
          <li key={i}>{inline(it)}</li>
        ))}
      </ul>
    )
  return (
    <p ref={refEl} className={cls}>
      {inline(b.texto)}
    </p>
  )
}

// **negrito** e `código`
function inline(s: string): ReactNode[] {
  return s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>
    if (p.startsWith('`') && p.endsWith('`')) return <code key={i}>{p.slice(1, -1)}</code>
    return p
  })
}

function MateriaChip({ id }: { id: string }) {
  const { cargo } = useSession()
  const m: Pick<MateriaCargo, 'cor' | 'curto'> = materiaDoCargo(cargo, id) ?? { cor: '#9fb0d9', curto: id }
  return (
    <span className="materia-tag" style={{ borderColor: m.cor, color: m.cor }}>
      {m.curto}
    </span>
  )
}

function Barra({ valor, total, cor }: { valor: number; total: number; cor: string }) {
  return (
    <div className="estudo-barra">
      <motion.div initial={{ width: 0 }} animate={{ width: `${total ? (valor / total) * 100 : 0}%` }} style={{ background: cor }} />
    </div>
  )
}
