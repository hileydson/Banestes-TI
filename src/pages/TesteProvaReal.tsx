import { TesteCurto } from './Inicio'

// Teste prova real: igual ao teste rápido (12 questões), priorizando questões reais de provas da FCC.
// Se faltar questão real em alguma matéria, completa com as questões inéditas (sem o selo).
export default function TesteProvaReal() {
  return <TesteCurto modo="real" />
}
