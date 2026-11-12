# arq-estilos | Camadas, cliente-servidor, objetos distribuídos e SOA
- **Cliente-servidor**: o cliente pede, o servidor atende. **Duas camadas** (cliente gordo + banco) x **três camadas** (apresentação, lógica de negócio, dados) x **n camadas**. Camadas facilitam manutenção, escalabilidade e segurança.
- **Objetos distribuídos**: objetos em máquinas diferentes que se comunicam como se fossem locais, via middleware: **CORBA**, **Java RMI**, DCOM/.NET Remoting. Usam stubs/proxies e skeletons; problemas: acoplamento e dificuldade de atravessar firewalls.
- **SOA** (Arquitetura Orientada a Serviços): funcionalidades expostas como **serviços** reutilizáveis, com contratos padronizados, baixo acoplamento, abstração, autonomia, **sem estado**, descoberta e composição. Tecnologias clássicas: **SOAP** (mensagens XML), **WSDL** (descrição do serviço), UDDI e o **ESB** (barramento de serviços, que faz roteamento, transformação e orquestração).
- **Orquestração** (um coordenador central controla o fluxo) x **coreografia** (cada serviço reage a eventos, sem coordenador).

# arq-microsservicos | Microsserviços e arquitetura cloud-native
- **Microsserviços**: aplicação dividida em serviços pequenos, **independentes**, organizados por **capacidade de negócio**, cada um com seu **próprio banco de dados**, implantados de forma independente, comunicando-se por APIs leves (REST, gRPC) ou mensagens.
- Vantagens: deploy e escala independentes, autonomia das equipes, tecnologias diferentes por serviço, falhas isoladas.
- Desvantagens: complexidade de sistema distribuído, consistência eventual, observabilidade e testes mais difíceis.
- **SOA x microsserviços**: SOA tende a compartilhar recursos e usar ESB "inteligente"; microsserviços preferem "endpoints inteligentes e canais simples" e dados descentralizados.
- **Monólito** (uma unidade de deploy) e **monólito modular** como alternativa.
## Padrões de microsserviços
- **Database per service**; transações distribuídas com **Saga** (sequência de transações locais com **ações compensatórias**, por orquestração ou coreografia) em vez de two-phase commit.
- **CQRS** (separa comandos de escrita e consultas de leitura) e **Event Sourcing** (estado guardado como sequência de eventos).
- **Strangler Fig** (estrangulamento): substituir um legado aos poucos, redirecionando funcionalidades para novos serviços.
- **Sidecar** e **service mesh** (Istio, Linkerd): um proxy ao lado de cada serviço cuida de rede, mTLS, retries e telemetria.
## Cloud-native
Aplicações feitas para a nuvem: **containers**, **microsserviços**, **orquestração** (Kubernetes), **DevOps/CI-CD**, infraestrutura imutável e declarativa, APIs. **12-Factor App**: base de código única, dependências declaradas, **configuração no ambiente**, serviços de apoio como recursos, processos sem estado, logs como fluxo de eventos, paridade entre ambientes. **Serverless** (funções como serviço, cobrança por execução).

# arq-eventos | Arquitetura orientada a eventos, filas e mensageria
- **EDA**: componentes produzem e consomem **eventos** (fatos que ocorreram), com baixo acoplamento e comunicação **assíncrona**.
- **Fila (ponto a ponto)**: cada mensagem é consumida por **um** consumidor (distribui trabalho). **Publish/subscribe (tópicos)**: cada mensagem vai para **todos** os assinantes.
- Ferramentas: **RabbitMQ** (broker AMQP, filas e exchanges: direct, topic, fanout), **Apache Kafka** (log distribuído e particionado, alta vazão, mensagens retidas e relidas por offset, grupos de consumidores), ActiveMQ, serviços gerenciados de nuvem (SQS, SNS, Service Bus, Pub/Sub).
- Garantias de entrega: **at-most-once**, **at-least-once** (pode duplicar: consumidor deve ser **idempotente**) e exactly-once.
- **Dead letter queue**: guarda mensagens que falharam repetidamente. **Outbox pattern**: grava o evento na mesma transação do dado e publica depois, evitando inconsistência.
- Vantagens: desacoplamento, absorção de picos (buffer), resiliência. Desafios: ordenação, duplicidade, rastreio.

# arq-padroes | MVC, DDD e arquitetura hexagonal
## MVC
- **Model** (dados e regras), **View** (apresentação) e **Controller** (recebe a entrada e coordena). Variações: MVP e **MVVM** (ViewModel com data binding, comum em frameworks front-end).
## DDD (Domain-Driven Design, Eric Evans)
- **Linguagem ubíqua**: mesmo vocabulário entre especialistas do negócio e desenvolvedores, usado no código.
- **Contextos delimitados (bounded contexts)**: cada modelo vale dentro de um limite; integrados por **mapa de contextos** (camada anticorrupção, kernel compartilhado, cliente-fornecedor...).
- Blocos táticos: **Entidade** (tem identidade), **Objeto de valor** (definido pelos atributos, imutável), **Agregado** (grupo consistente com uma **raiz** que é o único ponto de acesso), **Repositório**, **Serviço de domínio**, **Evento de domínio**, Fábrica.
- Subdomínios: **principal (core)**, de suporte e genérico.
## Arquitetura hexagonal (portas e adaptadores, Alistair Cockburn)
- O **domínio** fica no centro, isolado de tecnologia. **Portas** são interfaces; **adaptadores** conectam o mundo externo: de entrada/primários (REST, CLI, testes) e de saída/secundários (banco, mensageria).
- Facilita testes e troca de tecnologias. Parentes: **Clean Architecture** e Onion — dependências sempre apontam para dentro.

# arq-resiliencia | API Gateway, service discovery e padrões de resiliência
- **API Gateway**: ponto único de entrada para os clientes; faz roteamento, autenticação, **rate limiting**, agregação de respostas, TLS, cache e logs. Variante **BFF** (Backend for Frontend): um gateway por tipo de cliente.
- **Service Discovery**: os serviços se registram em um **registro** (Consul, Eureka, DNS do Kubernetes) e são encontrados dinamicamente. Lado do cliente (o cliente consulta o registro) ou do servidor (um balanceador consulta).
- **Circuit breaker**: após muitas falhas, o circuito **abre** e as chamadas falham rápido (sem sobrecarregar o serviço com problema); depois de um tempo fica **meio aberto** e testa algumas chamadas; se der certo, **fecha**.
- **Retries** com **backoff exponencial** e **jitter** (variação aleatória), só para operações idempotentes e falhas transitórias.
- **Timeouts**: sempre limitar o tempo de espera, para não prender recursos.
- **Bulkhead** (anteparas): isolar recursos (pools separados) para que a falha de uma parte não derrube tudo. **Fallback**: resposta alternativa. **Rate limiting** e **load shedding**.
## Integração legado-moderno
APIs de fachada sobre sistemas legados, **camada anticorrupção**, Strangler Fig, ESB/integração via mensageria, CDC (captura de mudanças de dados), ETL e arquivos em lote quando necessário.
