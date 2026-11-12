import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { BarChart3, Trophy } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { useSession } from '../lib/session'
import { AREAS, MATERIAS } from '../lib/materias'
import { computeInsight, fmtPct, pct, total } from '../lib/insights'
import type { Attempt } from '../lib/types'
import { progressoMaterias } from '../lib/zeradas'

const tooltipStyle = {
  contentStyle: { background: '#111c3d', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12, color: '#e6ecff' },
  itemStyle: { color: '#e6ecff' },
  labelStyle: { color: '#9fb0d9' }
}

export default function Resultados() {
  const { profile, backend, user, questions, progress } = useSession()
  const [attempts, setAttempts] = useState<Attempt[]>([])
  useEffect(() => {
    if (backend && user) backend.listAttempts(user.uid).then(setAttempts)
  }, [backend, user])
  if (!profile) return null

  const ins = computeInsight(profile)
  let tA = 0,
    tE = 0
  const porMateria = MATERIAS.map((m) => {
    const s = profile.stats[m.id] ?? { a: 0, e: 0 }
    tA += s.a
    tE += s.e
    return { nome: m.curto, completo: m.nome, Acertos: s.a, Erros: s.e, aproveitamento: Math.round(pct(s)), cor: m.cor }
  })
  const porArea = AREAS.filter((a) => a.materia === 'ESP').map((a) => {
    const s = profile.areaStats[a.id] ?? { a: 0, e: 0 }
    return { nome: a.nome, Acertos: s.a, Erros: s.e, aproveitamento: Math.round(pct(s)), n: total(s) }
  })
  const evolucao = attempts.map((a, i) => ({
    n: i + 1,
    tipo: a.tipo,
    aproveitamento: Math.round((a.acertos / Math.max(1, a.total)) * 100),
    data: new Date(a.data).toLocaleDateString('pt-BR')
  }))

  return (
    <div className="resultados">
      <h2 className="page-title">
        <BarChart3 /> Seus resultados
      </h2>

      <MateriasZeradas questions={questions} correct={progress.correct} />

      <div className="kpis">
        {[
          { label: 'Pontos (acertos)', v: tA, cor: '#34d399' },
          { label: 'Erros', v: tE, cor: '#f87171' },
          { label: 'Aproveitamento', v: fmtPct(ins.geral), cor: '#60a5fa' },
          { label: 'Testes feitos', v: profile.testes, cor: '#fbbf24' },
          { label: 'Provas feitas', v: profile.provas, cor: '#a78bfa' },
          { label: 'Melhor nota em prova', v: profile.melhorNotaProva.toFixed(2), cor: '#f472b6' }
        ].map((k, i) => (
          <motion.div key={k.label} className="glass kpi" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <b style={{ color: k.cor }}>{k.v}</b>
            <small>{k.label}</small>
          </motion.div>
        ))}
      </div>

      {ins.mensagens.length > 0 && (
        <motion.div className="glass insight-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {ins.mensagens.map((m, i) => (
            <p key={i}>💡 {m}</p>
          ))}
        </motion.div>
      )}

      <div className="charts">
        <ChartCard titulo="Acertos e erros por matéria do edital" delay={0.1}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={porMateria} margin={{ left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
              <XAxis dataKey="nome" tick={{ fill: '#9fb0d9', fontSize: 11 }} interval={0} />
              <YAxis tick={{ fill: '#9fb0d9', fontSize: 11 }} allowDecimals={false} />
              <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(255,255,255,.04)' }} />
              <Legend />
              <Bar dataKey="Acertos" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} animationDuration={1200} />
              <Bar dataKey="Erros" stackId="a" fill="#f87171" radius={[6, 6, 0, 0]} animationDuration={1200} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titulo="Aproveitamento (%) por matéria" delay={0.2}>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={porMateria} outerRadius="70%">
              <PolarGrid stroke="rgba(255,255,255,.12)" />
              <PolarAngleAxis dataKey="nome" tick={{ fill: '#9fb0d9', fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#6b7cab', fontSize: 9 }} angle={90} />
              <Radar dataKey="aproveitamento" name="Aproveitamento %" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.35} animationDuration={1200} />
              <Tooltip {...tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard titulo="Distribuição dos seus acertos" delay={0.3}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={porMateria.filter((m) => m.Acertos > 0)}
                dataKey="Acertos"
                nameKey="nome"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                animationDuration={1200}
              >
                {porMateria
                  .filter((m) => m.Acertos > 0)
                  .map((m) => (
                    <Cell key={m.nome} fill={m.cor} stroke="none" />
                  ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          {tA === 0 && <p className="muted center">Ainda sem acertos registrados.</p>}
        </ChartCard>

        <ChartCard titulo="Evolução do aproveitamento a cada teste/prova" delay={0.4}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={evolucao} margin={{ left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
              <XAxis dataKey="n" tick={{ fill: '#9fb0d9', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#9fb0d9', fontSize: 11 }} />
              <Tooltip {...tooltipStyle} labelFormatter={(n) => `Atividade ${n}`} />
              <Line type="monotone" dataKey="aproveitamento" name="Aproveitamento %" stroke="#a78bfa" strokeWidth={3} dot={{ r: 4 }} animationDuration={1500} />
            </LineChart>
          </ResponsiveContainer>
          {evolucao.length === 0 && <p className="muted center">Faça um teste para começar o histórico.</p>}
        </ChartCard>
      </div>

      <ChartCard titulo="Conhecimentos Específicos por área do edital" delay={0.5} wide>
        <ResponsiveContainer width="100%" height={Math.max(300, porArea.length * 34)}>
          <BarChart data={porArea} layout="vertical" margin={{ left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
            <XAxis type="number" tick={{ fill: '#9fb0d9', fontSize: 11 }} allowDecimals={false} />
            <YAxis type="category" dataKey="nome" width={150} tick={{ fill: '#9fb0d9', fontSize: 10 }} />
            <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(255,255,255,.04)' }} />
            <Legend />
            <Bar dataKey="Acertos" stackId="a" fill="#34d399" animationDuration={1200} />
            <Bar dataKey="Erros" stackId="a" fill="#f87171" radius={[0, 6, 6, 0]} animationDuration={1200} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="glass table-card">
        <h3>Totais por matéria</h3>
        <table className="tbl">
          <thead>
            <tr>
              <th>Matéria</th>
              <th>Acertos</th>
              <th>Erros</th>
              <th>Total</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {porMateria.map((m) => (
              <tr key={m.nome}>
                <td>
                  <span className="dot" style={{ background: m.cor }} /> {m.completo}
                </td>
                <td className="txt-ok">{m.Acertos}</td>
                <td className="txt-err">{m.Erros}</td>
                <td>{m.Acertos + m.Erros}</td>
                <td>
                  <div className="mini-bar">
                    <span style={{ width: `${m.aproveitamento}%`, background: m.cor }} />
                  </div>
                  {m.aproveitamento}%
                </td>
              </tr>
            ))}
            <tr className="total-row">
              <td>Total</td>
              <td className="txt-ok">{tA}</td>
              <td className="txt-err">{tE}</td>
              <td>{tA + tE}</td>
              <td>{fmtPct(ins.geral)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ChartCard({ titulo, children, delay = 0, wide }: { titulo: string; children: React.ReactNode; delay?: number; wide?: boolean }) {
  return (
    <motion.div className={'glass chart-card' + (wide ? ' wide' : '')} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <h3>{titulo}</h3>
      {children}
    </motion.div>
  )
}

// Topo da tela: matérias zeradas (todas as questões do banco acertadas) e quanto falta nas demais
function MateriasZeradas({ questions, correct }: { questions: Parameters<typeof progressoMaterias>[0]; correct: string[] }) {
  const prog = progressoMaterias(questions, correct)
  const zeradas = prog.filter((p) => p.zerada)
  return (
    <motion.div className="glass zeradas-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h3>
        <Trophy size={18} /> Matérias zeradas{' '}
        <span className="muted small">
          ({zeradas.length} de {prog.length})
        </span>
      </h3>
      <p className="muted small">
        Zerar uma matéria = acertar todas as questões dela que existem no banco. A partir daí, qualquer questão da matéria pode voltar a cair nos
        testes. Se entrarem questões novas, o selo sai até você acertá-las também.
      </p>
      {zeradas.length > 0 && (
        <div className="zeradas-selos">
          {zeradas.map((p, i) => {
            const m = MATERIAS.find((x) => x.id === p.id)!
            return (
              <motion.div
                key={p.id}
                className="zerada-medalha"
                style={{ borderColor: m.cor }}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.15 + i * 0.1 }}
              >
                <span className="zerada-emoji">🏆</span>
                <b style={{ color: m.cor }}>{m.curto}</b>
                <small>{p.total} de {p.total}</small>
              </motion.div>
            )
          })}
        </div>
      )}
      <div className="zeradas-barras">
        {prog
          .filter((p) => !p.zerada)
          .map((p) => {
            const m = MATERIAS.find((x) => x.id === p.id)!
            const pc = p.total ? (p.acertadas / p.total) * 100 : 0
            return (
              <div key={p.id} className="ibar">
                <div className="ibar-label">
                  <span>{m.nome}</span>
                  <b>
                    {p.acertadas}/{p.total}
                  </b>
                </div>
                <div className="ibar-track">
                  <motion.div className="ibar-fill" style={{ background: m.cor }} initial={{ width: 0 }} animate={{ width: `${pc}%` }} transition={{ duration: 0.8 }} />
                </div>
              </div>
            )
          })}
      </div>
    </motion.div>
  )
}
