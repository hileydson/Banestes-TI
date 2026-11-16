import { Stamp } from 'lucide-react'
import { ehReal, type Question } from '../lib/questions'

// Selo das questões reais, já aplicadas em provas da FCC. No teste prova real, as questões
// inéditas que entram só para completar o teste ganham o selo “Questão de treino”.
export default function SeloReal({ q, modoReal, curto }: { q: Question; modoReal?: boolean; curto?: boolean }) {
  if (ehReal(q))
    return (
      <span className="badge selo-real" title={`Questão real de prova FCC${q.rc ? ` – ${q.rc}` : ''} (${q.r})`}>
        <Stamp size={13} /> {curto ? 'Prova real' : `Prova real · ${q.r}`}
      </span>
    )
  if (modoReal)
    return (
      <span className="badge subtle" title="Questão inédita no estilo FCC, usada para completar o teste">
        Questão de treino
      </span>
    )
  return null
}
