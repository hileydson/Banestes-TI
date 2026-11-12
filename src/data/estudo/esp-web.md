# web-html-css | HTML5, CSS3, Bootstrap 5 e design responsivo
## HTML5
- Tags **semânticas**: header, nav, main, section, article, aside, footer, figure. Melhoram acessibilidade e SEO.
- Formulários com novos tipos (email, date, number, range) e validação nativa (required, pattern). Mídia nativa com **audio** e **video**; **canvas** e SVG para gráficos.
- APIs: **localStorage/sessionStorage**, IndexedDB, geolocalização, Web Workers, WebSocket, Service Workers (base dos **PWA**, que funcionam offline e podem ser instalados).
- Doctype simplificado: `<!DOCTYPE html>`.
## CSS3
- **Especificidade**: inline > id > classe/atributo/pseudoclasse > elemento; com empate, vale a regra que vem por último; !important sobrepõe.
- **Box model**: content + padding + border + margin; box-sizing: border-box inclui padding e borda na largura.
- Layout: **Flexbox** (uma dimensão; justify-content no eixo principal, align-items no transversal) e **Grid** (duas dimensões). position: static, relative, absolute, fixed, sticky.
- **Media queries** para responsividade; unidades relativas (rem, em, %, vw, vh); variáveis CSS (--cor); transições e animações.
## Mobile-first e Bootstrap 5
- **Mobile-first**: estilos base para telas pequenas e media queries com min-width para ampliar.
- **Bootstrap 5**: grid de **12 colunas** com container, row e col; breakpoints **sm, md, lg, xl, xxl**; componentes prontos (navbar, modal, cards); utilitários. A versão 5 **removeu a dependência do jQuery** e o suporte ao Internet Explorer.

# web-js-ts | JavaScript, TypeScript, frameworks e Node.js
## JavaScript
- **var** (escopo de função, hoisting) x **let/const** (escopo de bloco; const impede reatribuição, não torna o objeto imutável).
- == (com coerção) x **===** (estrita). Valores falsy: false, 0, "", null, undefined, NaN.
- Funções arrow (não têm this próprio), closures, desestruturação, spread (...), template strings, módulos (import/export).
- Assíncrono: **event loop**, callbacks, **Promises** (then/catch), **async/await**. JavaScript é single-thread.
- **DOM** e eventos; fetch para chamadas HTTP; JSON.parse e JSON.stringify.
## TypeScript
Superconjunto do JavaScript com **tipagem estática** opcional, verificada na compilação (transpila para JS). Recursos: interfaces e type aliases, **generics**, union types (string | number), enums, any x **unknown** (unknown obriga verificação), tipos utilitários (Partial, Readonly, Pick).
## Frameworks
- **React**: biblioteca de componentes com **JSX**, **virtual DOM**, fluxo de dados unidirecional via **props**, estado com **hooks** (useState, useEffect, useContext, useMemo); estado deve ser tratado como imutável; listas precisam de key. **React Native**: apps móveis nativos com React.
- **Angular**: framework completo (Google) em TypeScript: componentes, módulos/standalone, **injeção de dependência**, serviços, RxJS, two-way binding.
- **Vue.js**: progressivo, templates com diretivas (**v-if**, **v-for**, **v-model** para two-way binding, v-bind, v-on), reatividade.
## Node.js
Ambiente de execução JavaScript no servidor, baseado no motor **V8**, com **I/O não bloqueante orientado a eventos** (event loop). Gerenciador de pacotes **npm** (package.json); frameworks como **Express** e NestJS. Ideal para APIs e aplicações com muitas conexões; não é indicado para tarefas pesadas de CPU sem worker threads.

# web-apis | APIs RESTful: design, versionamento, OpenAPI e governança
## REST
Estilo arquitetural (Roy Fielding) com restrições: **cliente-servidor**, **sem estado (stateless)**, **cacheável**, **interface uniforme** (recursos identificados por URI, manipulação por representações, mensagens autodescritivas, **HATEOAS**), **sistema em camadas** e código sob demanda (opcional).
## Métodos HTTP
- **GET** (ler; seguro e idempotente), **POST** (criar; não idempotente), **PUT** (substituir o recurso inteiro; idempotente), **PATCH** (alteração parcial), **DELETE** (idempotente), HEAD, OPTIONS.
- **Idempotente**: repetir a requisição produz o mesmo efeito no servidor. Para POST seguro contra repetição, use uma **chave de idempotência**.
## Códigos de status
- **2xx** sucesso: 200 OK, **201 Created** (com cabeçalho Location), 204 No Content.
- **3xx** redirecionamento: 301, 302, 304 Not Modified.
- **4xx** erro do cliente: 400 Bad Request, **401 Unauthorized** (não autenticado), **403 Forbidden** (autenticado sem permissão), 404 Not Found, 405, 409 Conflict, 422 (validação), **429 Too Many Requests** (limite de taxa).
- **5xx** erro do servidor: 500, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout.
## Boas práticas de design
- Recursos como **substantivos no plural** (/clientes/123/contas); filtros e **paginação** por query string (limit/offset ou cursor); respostas em **JSON**; erros padronizados.
- **Versionamento**: na URL (/v1/), em cabeçalho ou media type; manter compatibilidade e anunciar descontinuação (deprecation).
- **Autenticação e autorização**: tokens (OAuth 2.0, JWT), HTTPS sempre; **rate limiting**.
- **Contrato de API — OpenAPI (antigo Swagger)**: especificação em YAML/JSON dos endpoints, parâmetros, esquemas e respostas; gera documentação e código; permite abordagem **contract-first**.
- **Governança de APIs**: padrões de design, catálogo, ciclo de vida, segurança, **API Gateway**, monitoramento e gestão de versões.
- Integração com serviços externos: timeouts, retries com backoff, circuit breaker, tratamento de JSON de APIs públicas.

# web-xml | XML e XML Schema
- **XML**: linguagem de marcação extensível para dados. **Bem formado**: um único elemento raiz, todas as tags fechadas e corretamente aninhadas, case-sensitive, valores de atributos entre aspas. **Válido**: bem formado **e** conforme um esquema (DTD ou XSD).
- **Declaração**: `<?xml version="1.0" encoding="UTF-8"?>`.
- **Elementos** (podem conter texto e outros elementos) x **atributos** (dados simples dentro da tag de abertura).
- **Namespaces** (xmlns) evitam conflitos de nomes.
- Caracteres especiais: `&lt;` `&gt;` `&amp;` `&quot;` `&apos;`; **CDATA** para texto não interpretado.
## XML Schema (XSD)
- Escrito em XML; define elementos, atributos e **tipos de dados** (xs:string, xs:integer, xs:date, xs:boolean...).
- **simpleType** (só texto, com restrições/facets: minLength, pattern, enumeration) e **complexType** (elementos filhos e atributos), com **sequence** (ordem fixa), **choice** (um entre vários) e **all**.
- **minOccurs** e **maxOccurs** (padrão 1; unbounded = ilimitado); atributos com use="required".
- Vantagens sobre DTD: tipos de dados, namespaces, sintaxe XML.
## Outras tecnologias
**XPath** (navegar e selecionar nós: /raiz/item[@id='1']), **XSLT** (transformar XML), DOM (árvore em memória) e SAX (leitura por eventos, mais leve).

# web-servidores | Servidores web e de aplicação; internet, intranet e extranet
- **Servidor web**: entrega conteúdo HTTP estático e faz proxy reverso (Apache HTTP Server, Nginx, IIS).
- **Servidor de aplicação**: executa a lógica de negócio e oferece serviços como transações, pools de conexão, segurança e mensageria (WildFly/JBoss EAP para Java EE/Jakarta EE; IIS com ASP.NET; Tomcat é um contêiner de servlets).
- **Internet**: rede pública mundial. **Intranet**: rede **privada** da organização usando tecnologias da internet (acesso interno). **Extranet**: parte da intranet aberta de forma controlada a **parceiros externos** (fornecedores, clientes). **Portal**: ponto de acesso unificado a conteúdos e serviços, com personalização.
- **Sessão e estado**: cookies, sessões no servidor, tokens. Balanceamento de carga e sessões "pegajosas" (sticky).

# web-ux | Usabilidade, UX e acessibilidade (WCAG e ABNT NBR 17225)
## Usabilidade e UX
- **Usabilidade** (ISO 9241-11): eficácia, eficiência e satisfação em um contexto de uso.
- **Heurísticas de Nielsen**: visibilidade do status, correspondência com o mundo real, controle e liberdade do usuário, consistência e padrões, prevenção de erros, reconhecer em vez de lembrar, flexibilidade e eficiência, design estético e minimalista, ajudar a reconhecer e recuperar erros, ajuda e documentação.
- **UX**: experiência como um todo (pesquisa com usuários, personas, jornadas, protótipos, testes de usabilidade).
## WCAG 2.1 e 2.2
- Princípios **POUR**: **Perceptível**, **Operável**, **Compreensível** e **Robusto**.
- Níveis de conformidade: **A** (mínimo), **AA** (o mais exigido em leis e contratos) e **AAA**.
- Exemplos: texto alternativo em imagens, legendas em vídeos, contraste mínimo de **4,5:1** para texto normal (AA), navegação completa por teclado, foco visível, não depender só de cor, rótulos em formulários, tempo ajustável.
- **WCAG 2.2** (2023) acrescentou critérios como **foco não obscurecido**, **tamanho mínimo do alvo de toque** (24 × 24 px), alternativas a **movimentos de arrastar**, **autenticação acessível** (sem teste cognitivo, como decorar ou transcrever) e **ajuda consistente**; removeu o critério 4.1.1 (Parsing).
- **WAI-ARIA**: atributos (role, aria-label, aria-live) para tornar componentes dinâmicos acessíveis a leitores de tela.
## ABNT NBR 17225:2025
Norma brasileira de **acessibilidade em conteúdo e aplicações web**, alinhada às WCAG, com requisitos organizados por níveis de conformidade para orientar o desenvolvimento e a avaliação de sites e aplicações no Brasil.
