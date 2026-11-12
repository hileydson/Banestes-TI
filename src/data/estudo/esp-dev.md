# dev-cicd | Integração contínua, entrega contínua e pipelines
- **DevOps**: cultura e práticas que unem desenvolvimento e operação para entregar software com rapidez e estabilidade. Modelo **CALMS**: Cultura, Automação, Lean, Medição e Compartilhamento (Sharing).
- **Integração contínua (CI)**: integrar o código ao repositório principal com frequência (várias vezes ao dia); cada integração dispara **build e testes automatizados**. Objetivo: achar erros cedo.
- **Entrega contínua (Continuous Delivery)**: todo commit aprovado gera um artefato **pronto para produção**; o deploy em produção é uma decisão manual (um clique).
- **Implantação contínua (Continuous Deployment)**: vai além — cada mudança aprovada no pipeline vai **automaticamente** para produção.
## Pipeline
Estágios típicos: checkout → build/compilação → testes unitários → análise estática e de segurança (SAST, dependências) → empacotamento (imagem de container) → publicação no **repositório de artefatos** (Nexus, Artifactory, registry) → deploy em homologação → testes de integração, regressão e aceitação → deploy em produção.
- **Quality gates**: critérios que barram o avanço (cobertura mínima, zero vulnerabilidades críticas, SonarQube).
- **Build uma vez, implante muitas**: o mesmo artefato passa por todos os ambientes; só a configuração muda.
- Ferramentas: Jenkins, GitLab CI, GitHub Actions, Azure DevOps, Tekton, ArgoCD (GitOps).
- **Automação de testes de regressão**: suíte executada a cada mudança para garantir que nada antigo quebrou.
- Métricas **DORA**: frequência de deploy, lead time de mudanças, taxa de falha de mudanças e tempo de recuperação (MTTR).

# dev-iac | Infraestrutura como código e GitOps
- **IaC**: provisionar e configurar infraestrutura por **arquivos versionados**, em vez de processos manuais. Benefícios: repetibilidade, revisão de código, menos erro humano, ambientes idênticos.
- **Declarativa** (descreve o estado desejado: Terraform, CloudFormation, Kubernetes YAML) x **imperativa** (descreve os passos: scripts).
- **Terraform**: linguagem HCL, multi-provedor, ciclo **init → plan → apply** (destroy), **estado (state)** que mapeia recursos reais (guardar remoto e com lock), módulos.
- **Gerência de configuração**: **Ansible** (sem agente, via SSH, playbooks em YAML, idempotente), Puppet e Chef (com agente).
- **Idempotência**: aplicar várias vezes leva ao mesmo resultado. **Drift**: diferença entre o estado real e o código.
- **Infraestrutura imutável**: em vez de alterar servidores, substitui-os por novos a partir de imagens.
- **GitOps**: o Git é a fonte da verdade do estado desejado; um agente (ArgoCD, Flux) sincroniza o cluster com o repositório.

# dev-devsecops | DevSecOps: segurança no pipeline
- **DevSecOps**: segurança integrada em todo o ciclo, de forma automatizada e compartilhada ("**shift-left**": tratar segurança desde o início).
- **SAST**: análise **estática** do código-fonte (sem executar), encontra falhas como SQL injection no código.
- **DAST**: análise **dinâmica**, testa a aplicação **em execução** pelo lado de fora (como um atacante).
- **IAST**: instrumenta a aplicação durante os testes. **RASP**: proteção em tempo de execução.
- **SCA**: análise de **dependências de terceiros** (bibliotecas com vulnerabilidades conhecidas — CVEs — e licenças). **SBOM**: lista de componentes do software.
- **Varredura de containers e IaC** (imagens com vulnerabilidades, configurações inseguras).
- **Gestão de segredos**: nunca colocar senhas e chaves no código; usar cofres (HashiCorp Vault, secrets managers) e detecção de segredos no repositório.
- Assinatura de artefatos e proteção da **cadeia de suprimentos** de software; princípio do menor privilégio no pipeline.
- Modelagem de ameaças (STRIDE) e testes de intrusão (pentest) complementam.

# dev-observabilidade | Observabilidade e monitoramento contínuo
- **Monitoramento**: acompanhar métricas e alertas conhecidos ("está funcionando?"). **Observabilidade**: capacidade de entender o estado interno a partir das saídas, inclusive problemas novos ("por que não está funcionando?").
## Três pilares
- **Logs**: registros de eventos (de preferência estruturados, em JSON, centralizados; ELK, Loki).
- **Métricas**: valores numéricos ao longo do tempo (CPU, latência, taxa de erros; Prometheus).
- **Traces (rastreamento distribuído)**: o caminho de uma requisição entre vários serviços, com spans e um **trace ID** propagado (Jaeger, Zipkin, Tempo).
- **OpenTelemetry**: padrão aberto para coletar logs, métricas e traces.
## Métodos de análise
- **Golden signals** (Google SRE): **latência, tráfego, erros e saturação**.
- **RED** (serviços): Rate, Errors, Duration. **USE** (recursos): Utilization, Saturation, Errors.
- **APM** (monitoramento de desempenho de aplicações), dashboards (Grafana), alertas com base em SLOs, **health checks**.
- SRE: SLI, SLO, error budget, postmortem sem culpa (blameless).

# dev-containers | Containers, imagens e Docker
- **Container**: processo isolado que compartilha o **kernel** do sistema hospedeiro (isolamento por **namespaces** e limites por **cgroups**). Mais leve e rápido que uma **máquina virtual**, que emula hardware e tem sistema operacional completo.
- **Imagem**: modelo **imutável**, em **camadas** (cada instrução do Dockerfile gera uma camada), a partir da qual se criam containers. **Registry**: repositório de imagens (Docker Hub, Harbor, registries de nuvem).
## Dockerfile
- FROM (imagem base), RUN (executa no build), COPY/ADD, WORKDIR, ENV, EXPOSE (documenta a porta), **CMD** (comando padrão, pode ser sobrescrito) e **ENTRYPOINT** (executável fixo), USER (evitar root).
- **Multi-stage build**: compila em uma etapa e copia só o resultado para uma imagem final menor e mais segura.
## Comandos
docker build, run (-d em segundo plano, -p porta host:container, -v volume, -e variável), ps, logs, exec, stop, rm, images, pull, push. **Docker Compose**: vários containers definidos em YAML (docker compose up).
- **Dados persistentes**: volumes (gerenciados pelo Docker) e bind mounts; o sistema de arquivos do container é efêmero.
- Boas práticas: imagens pequenas (alpine/distroless), não rodar como root, um processo por container, não guardar segredos na imagem, fixar versões das tags.

# dev-kubernetes | Kubernetes, clusters e orquestração
- **Orquestração de containers**: agendar, escalar, recuperar e conectar containers em um **cluster** de máquinas. Kubernetes (K8s) é o padrão; outros: Docker Swarm, OpenShift (Kubernetes da Red Hat), Nomad.
## Arquitetura
- **Plano de controle**: **kube-apiserver** (porta de entrada, API REST), **etcd** (armazena o estado do cluster, chave-valor), **kube-scheduler** (decide em qual nó o pod roda) e **controller-manager** (laços de controle que levam o estado real ao desejado).
- **Nós (workers)**: **kubelet** (agente que garante os pods do nó), **kube-proxy** (regras de rede dos Services) e o **container runtime** (containerd, CRI-O).
## Objetos
- **Pod**: menor unidade, um ou mais containers que compartilham rede e volumes.
- **Deployment** (gerencia ReplicaSets, réplicas e **rolling updates**/rollback), **StatefulSet** (identidade e armazenamento estáveis, para bancos), **DaemonSet** (um pod por nó, para agentes), **Job/CronJob**.
- **Service**: IP e DNS estáveis para um conjunto de pods (**ClusterIP** interno, **NodePort**, **LoadBalancer**). **Ingress**: roteamento HTTP/HTTPS externo por host e caminho.
- **ConfigMap** (configuração) e **Secret** (dados sensíveis, codificados em base64 — não é criptografia por padrão). **Namespace** (isolamento lógico), **PersistentVolume/PersistentVolumeClaim** (armazenamento).
- **HPA** (escala horizontal automática por CPU/métricas); probes de **liveness** (reinicia se travar), **readiness** (só recebe tráfego quando pronto) e startup; **requests e limits** de CPU e memória.
- **RBAC** e NetworkPolicies para segurança. kubectl é a ferramenta de linha de comando; manifests em YAML (modelo declarativo).
## Rancher
Plataforma da SUSE para **gerenciar vários clusters Kubernetes** (em nuvem, on-premises ou na borda) a partir de uma interface única: criação e importação de clusters, autenticação centralizada e RBAC, **projetos** (agrupam namespaces), catálogo de aplicações (Helm), monitoramento e **Fleet** (GitOps em escala). Distribuições: **RKE2** (foco em segurança) e **K3s** (leve, para borda e IoT).

# dev-deploy | Estratégias de deploy: blue/green e canary
- **Recreate**: derruba a versão antiga e sobe a nova (há indisponibilidade).
- **Rolling update**: substitui as instâncias aos poucos (padrão do Kubernetes); as duas versões convivem durante a troca.
- **Blue/green**: dois ambientes idênticos; o **blue** (atual) atende os usuários enquanto o **green** recebe a nova versão; testado, o tráfego é **chaveado de uma vez** para o green. **Rollback rápido** (volta o chaveamento), mas exige o dobro de recursos e cuidado com o banco de dados.
- **Canary**: a nova versão recebe primeiro uma **pequena fração do tráfego** (ex.: 5%), monitorada; se estiver tudo bem, a fração aumenta até 100%. Reduz o impacto de falhas.
- **A/B testing**: versões diferentes para grupos de usuários para comparar resultados de negócio.
- **Shadow (dark launch)**: a nova versão recebe cópia do tráfego sem responder ao usuário.
- **Feature flags (toggles)**: ativar ou desativar funcionalidades sem novo deploy, separando **deploy** de **release**.
