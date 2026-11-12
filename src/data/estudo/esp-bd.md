# bd-modelagem | Modelo entidade-relacionamento e normalização
## MER
- **Entidade** (forte ou **fraca**, que depende de outra para ser identificada), **atributo** (simples, composto, multivalorado, derivado, **chave**) e **relacionamento** (com **cardinalidade** 1:1, 1:N, N:N e participação total ou parcial).
- Mapeamento para o relacional: N:N vira **tabela associativa** com as duas chaves estrangeiras; 1:N leva a chave do lado 1 para o lado N; atributo multivalorado vira tabela própria.
- **Chaves**: superchave, candidata (mínima), **primária**, alternativa, **estrangeira** (integridade referencial).
- Restrições de integridade: de domínio, de entidade (PK não nula e única), referencial e semântica.
## Normalização
- **1FN**: atributos **atômicos**, sem grupos repetidos nem multivalorados.
- **2FN**: está na 1FN e **nenhum atributo não chave depende de parte da chave** composta (sem dependência parcial).
- **3FN**: está na 2FN e **não há dependência transitiva** (atributo não chave dependendo de outro não chave).
- **FNBC (Boyce-Codd)**: todo determinante é chave candidata.
- **4FN**: sem dependências multivaloradas; **5FN**: sem dependências de junção.
- **Desnormalização**: introduzir redundância de propósito para ganhar desempenho de leitura (comum em data warehouse).
> Dica: "a chave, toda a chave e nada além da chave" (1FN, 2FN, 3FN).

# bd-sql | SQL: DDL, DML, DCL e transações
## Categorias
- **DDL** (definição): CREATE, ALTER, DROP, TRUNCATE, RENAME.
- **DML** (manipulação): SELECT, INSERT, UPDATE, DELETE, MERGE. (Algumas bancas separam SELECT em **DQL**.)
- **DCL** (controle): **GRANT** e **REVOKE**.
- **TCL** (transação): COMMIT, ROLLBACK, SAVEPOINT.
## Detalhes que caem
- **DELETE** remove linhas (com WHERE, gera log por linha, dispara triggers, pode ser desfeito); **TRUNCATE** esvazia a tabela inteira (DDL, rápido, sem WHERE; no Oracle faz commit implícito); **DROP** remove a tabela.
- Ordem **lógica** do SELECT: FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT/FETCH. Por isso o WHERE não enxerga aliases do SELECT, e **HAVING** filtra grupos (pode usar agregação).
- **NULL**: compare com IS NULL / IS NOT NULL (= NULL nunca é verdadeiro). COUNT(*) conta todas as linhas; **COUNT(coluna)** ignora NULLs; SUM, AVG, MIN e MAX ignoram NULLs. COALESCE devolve o primeiro valor não nulo.
- Junções: **INNER** (só correspondentes), **LEFT/RIGHT OUTER** (mantém todas de um lado, com NULL no outro), **FULL OUTER**, **CROSS** (produto cartesiano), self join.
- **UNION** remove duplicatas; **UNION ALL** mantém (mais rápido). INTERSECT e EXCEPT (MINUS no Oracle).
- **Views** (consultas armazenadas), **índices** (aceleram busca; B-tree é o padrão), **stored procedures**, **functions** e **triggers** (executados em eventos de INSERT/UPDATE/DELETE).
## Transações: ACID
**Atomicidade** (tudo ou nada), **Consistência** (de um estado válido a outro), **Isolamento** (transações concorrentes não interferem) e **Durabilidade** (confirmado não se perde).
## Níveis de isolamento (do menor ao maior)
- **Read Uncommitted** (permite leitura suja), **Read Committed** (padrão no PostgreSQL e no Oracle; evita leitura suja), **Repeatable Read** (evita leitura não repetível), **Serializable** (evita também **leitura fantasma**).

# bd-sql-avancado | Subconsultas, CTEs e funções analíticas
## Subconsultas
- **Escalar** (devolve um valor), de **lista** (com IN, ANY, ALL), **correlacionada** (referencia a consulta externa; executada para cada linha), no FROM (tabela derivada).
- **EXISTS** testa se a subconsulta retorna linhas (costuma ser eficiente). Atenção: **NOT IN** com subconsulta que contém NULL não retorna nada.
## CTE (Common Table Expression)
- WITH nome AS (SELECT ...) SELECT ... FROM nome. Melhora a legibilidade e permite reutilizar o resultado na consulta.
- **CTE recursiva** (WITH RECURSIVE no PostgreSQL): parte âncora UNION ALL parte recursiva; usada para hierarquias (organogramas, árvores).
## Funções de janela (window functions)
- Calculam sobre um conjunto de linhas relacionadas **sem agrupar** (cada linha continua no resultado): função() OVER (PARTITION BY ... ORDER BY ... frame).
- **ROW_NUMBER** (1, 2, 3, 4 — sem empates), **RANK** (1, 2, 2, 4 — pula posições após empate), **DENSE_RANK** (1, 2, 2, 3 — não pula), NTILE.
- **LAG** (valor da linha anterior) e **LEAD** (da próxima); FIRST_VALUE, LAST_VALUE.
- Agregações acumuladas: SUM(valor) OVER (ORDER BY data) = soma corrente. **Frame**: ROWS BETWEEN 2 PRECEDING AND CURRENT ROW (média móvel).
> Dica: window functions não podem ir no WHERE; filtre numa subconsulta ou CTE.

# bd-sgbds | PostgreSQL, Oracle, H2, PL/SQL e PL/pgSQL
## PostgreSQL 14 e 15
- Objeto-relacional, open source, **MVCC** (cada transação vê um snapshot; versões antigas de linhas são limpas pelo **VACUUM**/autovacuum).
- Tipos ricos: **JSONB** (JSON binário, indexável com GIN), arrays, UUID, intervalos; extensões (PostGIS).
- **EXPLAIN / EXPLAIN ANALYZE**: mostra o plano de execução (Seq Scan, Index Scan, joins).
- Versão 15: comando **MERGE**; o schema **public** deixou de dar permissão de CREATE a todos os usuários (mais seguro); melhorias de desempenho em ordenação e replicação lógica.
- Versão 14: melhorias de desempenho com muitas conexões, multirange types.
## Oracle 19c
- Versão de suporte de longo prazo. Arquitetura: **instância** (memória SGA/PGA + processos) e **banco** (datafiles, control files, redo logs). **Multitenant**: CDB (contêiner) e PDBs (bancos plugáveis).
- Objetos: tablespaces, sequences, synonyms; tabela DUAL; ROWNUM e FETCH FIRST n ROWS ONLY; recursos como Data Guard e RAC (alta disponibilidade).
## H2 Database
Banco **Java** leve, open source, que roda **em memória** ou embarcado; muito usado em **testes** e protótipos; tem modos de compatibilidade (PostgreSQL, Oracle, MySQL).
## PL/SQL e PL/pgSQL
- Linguagens procedurais que estendem o SQL com variáveis, condições, laços e tratamento de exceções.
- **PL/SQL** (Oracle): blocos **DECLARE / BEGIN / EXCEPTION / END**; procedures, functions, **packages** (especificação + corpo), triggers, cursores (explícitos e implícitos), exceções como NO_DATA_FOUND e TOO_MANY_ROWS.
- **PL/pgSQL** (PostgreSQL): CREATE FUNCTION ... LANGUAGE plpgsql; RETURNS TABLE/SETOF; desde a versão 11 existem PROCEDURES (com CALL) que podem fazer COMMIT; RAISE para mensagens e erros; triggers usam funções que retornam TRIGGER (NEW e OLD).

# bd-dw | Data warehouse, modelagem dimensional, OLAP e data lake
- **OLTP**: sistemas transacionais (muitas operações curtas, normalizados). **OLAP**: análise (consultas complexas sobre grandes volumes, dados históricos).
- **Data warehouse**: repositório **integrado, orientado a assunto, não volátil e variante no tempo** (Inmon) para apoiar decisões. **Data mart**: subconjunto por área/departamento.
- Abordagens: **Inmon** (top-down, DW corporativo normalizado primeiro) x **Kimball** (bottom-up, data marts dimensionais integrados por dimensões conformadas).
- **ETL** (extrair, transformar, carregar) x **ELT** (carrega e transforma no destino, comum em nuvem).
## Modelagem dimensional
- **Fato**: eventos mensuráveis com **métricas** numéricas (valor da venda, quantidade) e chaves para as dimensões. Métricas aditivas, semiaditivas (saldo) e não aditivas (percentuais).
- **Dimensão**: contexto descritivo (tempo, cliente, produto, agência).
- **Esquema estrela**: fato no centro e dimensões **desnormalizadas** ao redor (consultas mais simples e rápidas).
- **Floco de neve (snowflake)**: dimensões **normalizadas** em subtabelas.
- **Granularidade**: o nível de detalhe de cada linha do fato. **Dimensões de mudança lenta (SCD)**: tipo 1 sobrescreve, tipo 2 cria nova linha com histórico.
## OLAP
Operações: **drill-down** (mais detalhe), **roll-up** (mais agregado), **slice** (fixa uma dimensão), **dice** (subcubo), **pivot** (gira os eixos). Tipos: MOLAP, ROLAP, HOLAP.
## Data lake
Armazena dados **brutos** de qualquer formato (estruturados, semi e não estruturados) a baixo custo; esquema na leitura (**schema-on-read**). **Lakehouse** une data lake e recursos de DW. Risco: virar "pântano de dados" sem governança.

# bd-nosql | NoSQL e governança de dados
## Tipos de bancos NoSQL
- **Chave-valor**: acesso por chave, muito rápido (Redis, DynamoDB). Uso: cache, sessões.
- **Documentos**: documentos JSON/BSON com esquema flexível (MongoDB, Couchbase). Uso: catálogos, perfis.
- **Colunas largas (wide-column)**: famílias de colunas, grande escala de escrita (Cassandra, HBase).
- **Grafos**: nós e arestas para relacionamentos (Neo4j). Uso: redes sociais, detecção de fraude, recomendações.
## Conceitos
- **Teorema CAP**: em caso de partição de rede, um sistema distribuído escolhe entre **Consistência** e **Disponibilidade** (não dá para ter C, A e P ao mesmo tempo).
- **BASE**: Basically Available, Soft state, **Eventual consistency** (contraponto ao ACID).
- Escalabilidade **horizontal** (sharding) e replicação.
## Governança e qualidade de dados
- Governança: políticas, papéis (**dono dos dados**, **custodiante**, **data steward**), padrões, catálogo e metadados, linhagem, segurança e privacidade (LGPD). Referência: DAMA-DMBOK.
- Dimensões de qualidade: **integridade**, **consistência**, **completude**, **acurácia**, **atualidade (tempestividade)**, **unicidade** e **validade**.
- **Rastreabilidade (linhagem)**: saber de onde o dado veio e por quais transformações passou. **MDM** (gestão de dados mestres): fonte única e confiável de entidades como cliente e produto.
