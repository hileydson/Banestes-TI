# srv-servicos | Serviços de rede: e-mail, DHCP, proxy e servidores de aplicação
## E-mail
- Componentes: **MUA** (cliente), **MTA** (transfere entre servidores, via SMTP: Postfix, Exchange), **MDA** (entrega na caixa). Leitura por POP3 ou IMAP.
- Autenticidade do domínio: **SPF** (quais servidores podem enviar pelo domínio, registro TXT), **DKIM** (assinatura digital das mensagens) e **DMARC** (política para quando SPF/DKIM falham e relatórios). Evitar **open relay**.
## DHCP
Escopos (faixas), exclusões, **reservas** por MAC, tempo de concessão (lease), opções (gateway, DNS); relay para outras sub-redes; failover entre servidores.
## Web proxy
- **Proxy direto (forward)**: intermediário dos usuários internos para a internet; faz **cache**, **filtragem de conteúdo**, autenticação e logs (Squid).
- **Proxy transparente**: intercepta o tráfego sem configuração no cliente.
- **Proxy reverso**: fica na frente dos servidores (Nginx, Apache): balanceamento, terminação TLS, cache, proteção.
## Servidores de aplicação
- **WildFly** (comunitário) e **JBoss EAP** (versão comercial da Red Hat, com suporte): servidores **Jakarta EE/Java EE**. Configuração em standalone.xml ou domain.xml; modos **standalone** e **domain** (gerencia vários servidores a partir de um controlador); **subsistemas** (datasources, mensageria, segurança Elytron, undertow para web); console de administração e **jboss-cli**; deploy de .war/.ear.
- **Apache HTTP Server**: servidor web modular (mod_ssl, mod_proxy, mod_rewrite), **virtual hosts**, MPMs (prefork, worker, event), .htaccess; logs access_log e error_log.
- **IIS** (Microsoft): sites, **pools de aplicativos** (isolam aplicações em processos w3wp), bindings (protocolo, IP, porta e host header), certificados, ASP.NET, gerenciador do IIS e logs em formato W3C.

# srv-gerenciamento | Gerenciamento de usuários, logs, VPN e acesso remoto
- **Gerenciamento de usuários**: contas nominais, grupos e perfis, ciclo de vida (admissão, mudança, desligamento), menor privilégio, revisão periódica de acessos, diretório centralizado (AD/LDAP).
- **Logs de serviços**: centralizar (syslog, rsyslog, Windows Event Log/encaminhamento), padronizar horário com **NTP**, definir retenção, proteger contra alteração. **Syslog**: severidades de 0 (emergência) a 7 (debug); usa UDP 514 (ou TCP/TLS).
- **Configuração e administração**: gestão de mudanças, backups de configuração, documentação, hardening dos serviços.
## VPN corporativa e acesso remoto seguro
- **Site a site**: liga redes de filiais (normalmente IPsec). **Acesso remoto (cliente a site)**: usuário em casa conectado à rede da empresa (IPsec ou SSL/TLS).
- **Split tunneling**: só o tráfego corporativo passa pela VPN (o resto vai direto à internet) — reduz carga, mas diminui o controle de segurança. **Full tunnel**: tudo passa pela VPN.
- Acesso remoto seguro: **MFA**, **jump server/bastion host**, RDP/SSH somente via VPN, gravação de sessões privilegiadas, **ZTNA** como evolução da VPN.

# srv-qos | QoS para voz, vídeo e dados
- **QoS**: tratar tráfegos de forma diferenciada para garantir desempenho. Parâmetros: **largura de banda**, **atraso (latência)**, **variação do atraso (jitter)** e **perda de pacotes**.
- Voz é muito sensível a atraso e jitter (recomendação: atraso de ida **até ~150 ms**, jitter **< 30 ms** e perda **< 1%**); vídeo é sensível e consome mais banda; dados toleram atraso, mas não perda (TCP retransmite).
## Modelos
- **Best effort** (sem QoS), **IntServ** (reserva por fluxo com **RSVP**; pouco escalável) e **DiffServ** (marca os pacotes por classe e cada roteador trata conforme a marca; escalável).
- Marcação: **DSCP** (6 bits no cabeçalho IP; **EF — Expedited Forwarding** para voz, AF para classes garantidas, BE padrão) e **CoS** (802.1p, camada 2).
## Mecanismos
- Classificação e marcação, **filas** (FIFO, Priority Queuing, WFQ, **CBWFQ**, **LLQ** — fila de prioridade estrita para voz), descarte (**WRED** evita congestionamento), **policing** (descarta ou remarca o excesso, sem buffer) x **shaping** (atrasa o excesso em buffer, suavizando o tráfego), fragmentação de pacotes em enlaces lentos.

# srv-snmp | SNMP: agentes, gerentes e MIBs
- **SNMP**: protocolo de gerenciamento de rede. O **gerente** (NMS) consulta e configura; o **agente** (no equipamento) responde e envia alertas.
- **MIB**: base de informações de gerenciamento, estrutura hierárquica de objetos identificados por **OID** (ex.: 1.3.6.1.2.1...).
- Portas: **UDP 161** (consultas ao agente) e **UDP 162** (traps para o gerente).
## Operações
**Get**, **GetNext**, **GetBulk** (v2c, várias de uma vez), **Set** (altera), **Response**, **Trap** (alerta não confirmado, do agente ao gerente) e **Inform** (alerta **confirmado**, v2c/v3).
## Versões
- **v1** e **v2c**: autenticação por **community string** em texto claro ("public"/"private") — inseguras.
- **v3**: modelo de segurança por usuário (**USM**) com **autenticação** e **criptografia**; níveis **noAuthNoPriv**, **authNoPriv** (autentica, sem criptografia) e **authPriv** (autentica e criptografa).

# srv-desempenho | Desempenho de redes, níveis de serviço e RFC 2544/2889
- **Métricas**: vazão (throughput), latência, jitter, perda de pacotes, disponibilidade, utilização de enlaces. Disponibilidade 99,9% ≈ 8,76 h de indisponibilidade por ano; 99,99% ≈ 52,6 min.
- **Métodos de avaliação**: medição **ativa** (injeta tráfego de teste: ping, iperf, testes sintéticos) x **passiva** (observa o tráfego real: NetFlow/sFlow, SPAN/espelhamento de porta, SNMP); baseline para comparação; testes de carga.
- **Níveis de serviço**: definir SLAs com metas mensuráveis e monitorá-las (disponibilidade, tempo de resposta, MTTR, MTBF).
## RFCs de benchmarking
- **RFC 2544**: metodologia de testes de desempenho de **dispositivos de interconexão** (e serviços Ethernet): **throughput**, **latência**, **taxa de perda de quadros** e **back-to-back** (rajadas), com quadros de vários tamanhos (64 a 1518 bytes).
- **RFC 2889**: metodologia específica para **switches LAN**: encaminhamento em malha completa (full mesh), congestionamento, **aprendizado e capacidade da tabela de endereços MAC**, encaminhamento de broadcast, tratamento de erros.
- **Y.1564** (ITU) complementa testando múltiplos serviços simultâneos com SLA.

# srv-voip | VoIP, ToIP, videoconferência, SIP, H.323 e multicast
- **VoIP**: voz sobre IP. **ToIP**: telefonia completa sobre IP (PABX IP, ramais). Mídia transportada por **RTP** (sobre UDP) e controlada por RTCP; **SRTP** para criptografia.
- **Codecs**: G.711 (64 kbps, sem compressão, ótima qualidade), G.729 (8 kbps, comprimido), Opus (adaptativo). Qualidade medida por **MOS** (1 a 5).
## SIP
- Protocolo de **sinalização** baseado em texto (parecido com HTTP), da IETF, porta **5060** (5061 com TLS). Estabelece, modifica e encerra sessões.
- Métodos: **INVITE** (inicia), **ACK**, **BYE** (encerra), **CANCEL**, **REGISTER** (registra o usuário), OPTIONS. Respostas: 1xx (180 Ringing), 2xx (200 OK), 4xx, 5xx.
- Elementos: user agents, **proxy**, **registrar**, redirect server; **SDP** descreve a mídia (codecs, portas).
## H.323
Conjunto de padrões da **ITU-T** (mais antigo e binário) para multimídia: **terminais**, **gateway** (liga à telefonia tradicional), **gatekeeper** (controle de admissão e tradução de endereços) e **MCU** (conferências multiponto). Usa H.225 e H.245.
## Multicast e IGMP
- **Multicast**: um emissor para um **grupo** de receptores interessados (IPv4 classe D, **224.0.0.0/4**), economizando banda em vídeo e IPTV.
- **IGMP**: hosts informam ao roteador local a quais grupos querem se juntar (join/leave); o **IGMP snooping** nos switches evita inundar todas as portas. Entre roteadores, **PIM**. No IPv6, o equivalente é o **MLD**.

# srv-monitoramento | Monitoramento e logs: Zabbix, ELK, Grafana, Prometheus e Fluentd
- **Zabbix**: monitoramento de infraestrutura open source. **Zabbix server** + banco de dados + frontend web; **agentes** (ativo: o agente envia; passivo: o servidor consulta), também SNMP, IPMI, JMX, verificações sem agente. Conceitos: **hosts**, **itens** (o que coletar), **triggers** (condições de problema), **ações** (notificações e comandos), **templates**, descoberta automática (LLD). **Zabbix proxy** coleta em locais remotos e repassa ao servidor, aliviando a carga.
- **Pilha ELK/Elastic**: **Elasticsearch** (armazena e pesquisa, índice invertido, distribuído), **Logstash** (coleta, transforma e envia; pipeline input → filter → output) e **Kibana** (visualização e dashboards); **Beats** (coletores leves como Filebeat).
- **Fluentd**: coletor e roteador unificado de logs (projeto da CNCF), muito usado em Kubernetes; **Fluent Bit** é a versão leve. Alternativa ao Logstash (pilha **EFK**).
- **Prometheus**: monitoramento de **métricas** em **séries temporais**, modelo **pull** (raspa endpoints /metrics via HTTP), linguagem de consulta **PromQL**, **exporters** para expor métricas de sistemas (node_exporter), **Alertmanager** para alertas; Pushgateway para jobs curtos.
- **Grafana**: plataforma de **visualização** e dashboards que consulta várias fontes (Prometheus, Elasticsearch, Zabbix, bancos), com alertas. Não armazena as métricas por si só.
