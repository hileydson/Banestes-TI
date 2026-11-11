# Estudo Banestes TI

PWA de estudo para o concurso **Banestes 01/2027 (FCC)** – cargo **Analista de TI – Desenvolvimento de Sistemas**.

- Teste rápido de 12 questões (2 Português, 2 Raciocínio Lógico, 1 Estatística, 1 Atualidades, 1 Ética/ESG, 5 Específicas)
- Simulado com metade da prova real (40 questões, 5 seções, cronômetro com pausa)
- Correção comentada de cada alternativa, análise de rendimento por matéria, gráficos e ranking
- Login com Google ou usuário/senha (Firebase), instalável no celular

As questões são **inéditas, no estilo FCC**, escritas a partir do conteúdo programático do edital (não são cópias de provas anteriores).

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:5173 (sem Firebase configurado roda em modo local)
npm run validate   # valida o banco de questões
npm run build
```

Banco de questões: `src/data/questoes/*.json`. Configuração do Firebase: `src/lib/firebaseConfig.ts`.
Regras do Firestore: `firestore.rules`. Função de redefinição de senha: `netlify/functions/reset-password.mts`
(variáveis `FIREBASE_SERVICE_ACCOUNT` e `MASTER_RESET_PASSWORD` no Netlify).
