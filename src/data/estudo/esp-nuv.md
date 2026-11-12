# nuv-modelos | Modelos de nuvem: pública, privada, híbrida e multicloud; IaaS, PaaS e SaaS
- **Características essenciais (NIST)**: autoatendimento sob demanda, amplo acesso pela rede, **pool de recursos** (multi-inquilino), **elasticidade rápida** e **serviço medido** (pagamento por uso).
## Modelos de implantação
- **Pública**: infraestrutura do provedor compartilhada entre clientes (AWS, Azure, Google Cloud, OCI).
- **Privada**: dedicada a uma organização (no próprio data center ou hospedada).
- **Híbrida**: combina privada (ou on-premises) e pública, com integração e portabilidade entre elas (ex.: dados sensíveis on-premises e picos na pública — cloud bursting).
- **Comunitária**: compartilhada por organizações com interesses comuns.
- **Multicloud**: uso de **vários provedores** de nuvem pública (evita lock-in, aproveita o melhor de cada um; aumenta a complexidade de gestão).
## Modelos de serviço
- **IaaS**: o provedor entrega infraestrutura (máquinas virtuais, rede, armazenamento); o cliente gerencia SO, middleware, aplicações e dados.
- **PaaS**: o provedor gerencia também SO e plataforma de execução; o cliente cuida da aplicação e dos dados (ex.: serviços de app, bancos gerenciados).
- **SaaS**: aplicação pronta, usada pela internet (e-mail, CRM); o cliente só configura e usa.
- Outros: **FaaS/serverless** (funções executadas sob demanda), CaaS (containers), DBaaS.

# nuv-migracao | Estratégias de migração, governança e controle de custos
## Os "6 Rs" (ou 7) de migração
- **Rehost** ("lift and shift"): mover como está para máquinas virtuais na nuvem — rápido, poucos ganhos.
- **Replatform** ("lift, tinker and shift"): pequenas otimizações (ex.: trocar o banco por um gerenciado).
- **Refactor/Re-architect**: reescrever para ser cloud-native (microsserviços, serverless) — mais esforço, mais benefícios.
- **Repurchase**: trocar por um SaaS. **Retire**: desativar o que não é mais usado. **Retain**: manter onde está por enquanto. **Relocate**: mover a plataforma de virtualização inteira (ex.: VMware na nuvem).
- Etapas: avaliar o portfólio, planejar ondas de migração, prova de conceito, migrar, otimizar.
## Governança de nuvem
Políticas de uso, padrões de arquitetura (**landing zone** com contas/assinaturas organizadas, rede e segurança base), identidades e acessos, **tags** para identificar donos e custos, conformidade (LGPD, regras do BC para contratação de nuvem por instituições financeiras), gestão de riscos de fornecedor e plano de saída.
## Controle de custos (FinOps)
Visibilidade por tags e centros de custo, orçamentos e alertas, **right-sizing** (ajustar tamanho), desligar recursos ociosos, **instâncias reservadas/planos de economia** para carga estável, **instâncias spot** para cargas tolerantes a interrupção, camadas de armazenamento (quente, fria, arquivo), autoescalonamento.

# nuv-disponibilidade | Escalabilidade, alta disponibilidade e resiliência
- **Escalabilidade vertical** (scale up: máquina maior) x **horizontal** (scale out: mais instâncias, exige aplicação sem estado). **Elasticidade**: escalar para cima e para baixo **automaticamente** conforme a demanda.
- **Regiões** (áreas geográficas) e **zonas de disponibilidade** (data centers isolados dentro da região). Distribuir em **várias zonas** protege contra falha de um data center; em várias regiões, contra desastres regionais.
- **Alta disponibilidade**: eliminar pontos únicos de falha, balanceadores de carga, redundância ativa-ativa ou ativa-passiva, health checks, failover automático.
- **Recuperação de desastres**: **RPO** (quanto de dados se aceita perder, em tempo) e **RTO** (em quanto tempo o serviço precisa voltar). Estratégias, da mais barata e lenta à mais cara e rápida: backup e restauração, **pilot light**, **warm standby** e **multi-site ativo-ativo**.
- **Resiliência**: projetar para falhar (retries, circuit breaker, filas, degradação controlada), engenharia do caos, testes de DR.

# nuv-servicos | Serviços gerenciados: banco de dados, mensageria, armazenamento e integração
- **Serviço gerenciado**: o provedor cuida de instalação, patches, backup, replicação e escala; o cliente foca no uso. Reduz trabalho operacional, mas aumenta a dependência do provedor.
- **Bancos de dados gerenciados**: relacionais (PostgreSQL, MySQL, SQL Server, Oracle gerenciados, com réplicas de leitura e failover multizona) e NoSQL (chave-valor, documentos).
- **Mensageria**: filas e tópicos gerenciados (SQS/SNS, Azure Service Bus, Google Pub/Sub, Kafka gerenciado), para desacoplar sistemas.
- **Armazenamento**: de **objetos** (S3, Blob Storage: arquivos acessados por API HTTP, altamente durável, com classes de custo e ciclo de vida), de **blocos** (discos de VMs) e de **arquivos** (compartilhamentos NFS/SMB).
- **Integração**: API gateways gerenciados, serviços de integração e workflows, funções serverless acionadas por eventos, CDN.
## Git, Kubernetes, Rancher e CI/CD na nuvem
O edital também lista, dentro de nuvem: **versionamento com Git**, **clusters Kubernetes** gerenciados com **Rancher** e **CI/CD** — veja os assuntos de Programação e de DevOps (eles valem aqui também). Kubernetes gerenciado nas nuvens: EKS, AKS, GKE, OKE.
- Os temas finais do edital — **levantamento de requisitos, testes, integração, documentação técnica, governança de dados, autenticação e controle de acesso** — estão em Processo de desenvolvimento, Banco de dados e Segurança da informação.
