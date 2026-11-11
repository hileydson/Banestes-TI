// Configuração pública do app web do Firebase (não é segredo; a segurança fica nas regras do Firestore).
// Enquanto estiver null, o app roda em "modo local" (dados só neste navegador) — útil para desenvolvimento.
export const firebaseConfig: Record<string, string> | null = null
