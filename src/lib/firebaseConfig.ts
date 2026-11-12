// Configuração pública do app web do Firebase (não é segredo; a segurança fica nas regras do Firestore).
// Se for null, o app roda em "modo local" (dados só neste navegador) — útil para desenvolvimento.
export const firebaseConfig: Record<string, string> | null = {
  apiKey: 'AIzaSyCpIAgH80osHum8QXimv4oidBLAEeOHVAU',
  authDomain: 'banestes-ti-estudos.firebaseapp.com',
  projectId: 'banestes-ti-estudos',
  storageBucket: 'banestes-ti-estudos.firebasestorage.app',
  messagingSenderId: '698773196231',
  appId: '1:698773196231:web:5eb4e1ab373101b9d9dde2'
}
