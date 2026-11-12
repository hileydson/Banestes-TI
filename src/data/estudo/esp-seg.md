# seg-iso27001 | ISO/IEC 27001:2022 e 27002:2022
- Pilares (tríade **CID**): **Confidencialidade** (só quem pode acessa), **Integridade** (sem alteração indevida) e **Disponibilidade** (acessível quando preciso). Complementares: autenticidade, não repúdio, responsabilização.
## ISO/IEC 27001 (ABNT 2022, com emenda de 2024 sobre clima)
- Requisitos para estabelecer, implementar, manter e melhorar um **SGSI** (Sistema de Gestão de Segurança da Informação). É a norma **certificável**.
- Estrutura de alto nível: cláusulas **4 a 10** (contexto, liderança, planejamento, apoio, operação, avaliação de desempenho, melhoria), ciclo **PDCA**.
- Exige **avaliação e tratamento de riscos** e a **Declaração de Aplicabilidade (SoA)**, que justifica quais controles do Anexo A são aplicados ou excluídos.
- A emenda de 2024 incluiu considerar se as **mudanças climáticas** são uma questão relevante no contexto da organização.
## ISO/IEC 27002:2022
- **Guia de boas práticas** com os controles (não certificável). Na versão 2022 são **93 controles** em **4 temas**: **Organizacionais (37)**, **Pessoas (8)**, **Físicos (14)** e **Tecnológicos (34)** (antes eram 114 controles em 14 domínios).
- **11 controles novos**, como inteligência de ameaças, segurança da informação no uso de **serviços em nuvem**, prontidão de TIC para continuidade, monitoramento de segurança física, gestão de configuração, **exclusão de informações**, **mascaramento de dados**, **prevenção de vazamento de dados (DLP)**, atividades de monitoramento, filtragem web e **codificação segura**.
- Atributos para classificar controles: tipo (preventivo, detectivo, corretivo), propriedades CID, conceitos de cibersegurança (identificar, proteger, detectar, responder, recuperar) etc.

# seg-protecao | Firewall, WAF, UTM, DMZ, proxy, NAC, IDS e IPS
- **Firewall de filtro de pacotes** (stateless: regras por IP, porta, protocolo), **stateful** (acompanha o estado das conexões), **de aplicação/proxy** e **NGFW** (próxima geração: identifica aplicações e usuários, inspeção profunda, IPS integrado). Regra final recomendada: **negar tudo** que não foi permitido.
- **WAF**: firewall de **aplicação web** (camada 7), protege contra SQL injection, XSS e ataques do OWASP Top 10, inspecionando HTTP/HTTPS.
- **UTM**: appliance que unifica firewall, IPS, antivírus, antispam, filtro de conteúdo e VPN.
- **DMZ**: zona desmilitarizada, rede intermediária entre a internet e a rede interna, onde ficam servidores expostos (web, e-mail); a internet acessa a DMZ, mas não a rede interna diretamente.
- **NAC**: controle de admissão à rede; verifica identidade e **conformidade** do dispositivo (antivírus, patches) antes de liberar o acesso (com 802.1X), podendo colocar em quarentena.
- **Antivírus/antimalware** (assinaturas, heurística, comportamento) e **antispam** (listas, reputação, filtros, SPF/DKIM/DMARC).
## IDS x IPS
- **IDS** (detecção): **monitora e alerta**, de forma **passiva** (cópia do tráfego). **IPS** (prevenção): fica **em linha** e **bloqueia** o tráfego malicioso.
- **Baseado em rede (NIDS/NIPS)** ou **em host (HIDS)**. Detecção por **assinatura** (conhecidos; poucos falsos positivos) ou por **anomalia/comportamento** (detecta ataques novos, mais falsos positivos).
- **Monitoramento de tráfego**: NetFlow, espelhamento de porta (SPAN/TAP), análise de pacotes (Wireshark, tcpdump).

# seg-wireless-vpn | Segurança em redes sem fio, VPN, VPN-SSL e ZTNA
## Wi-Fi
- **WEP**: obsoleto e quebrável (RC4 com IV curto). **WPA**: transição, usava **TKIP**. **WPA2**: **AES-CCMP**; modo **Personal (PSK)** com senha compartilhada e **Enterprise** com **802.1X/EAP** e servidor RADIUS (credencial por usuário). Vulnerável ao ataque KRACK e a dicionário offline na PSK.
- **WPA3**: **SAE** (Simultaneous Authentication of Equals) no lugar da PSK, resistente a ataques de dicionário offline e com **sigilo direto (forward secrecy)**; modo Enterprise de 192 bits; **OWE/Enhanced Open** cifra redes abertas; frames de gerenciamento protegidos (PMF) obrigatórios.
- **EAP**: framework de autenticação; métodos **EAP-TLS** (certificados nos dois lados, o mais seguro), **PEAP** e EAP-TTLS (túnel TLS com senha interna).
- Boas práticas: desativar WPS, segregar rede de visitantes, detectar APs falsos (rogue/evil twin).
## VPN
- **IPsec** (camada de rede) e **VPN-SSL/TLS** (camada de aplicação/transporte, acesso por navegador ou cliente leve, atravessa firewalls com facilidade pela porta 443).
- Garantem confidencialidade, integridade e autenticação no túnel sobre a rede pública.
## ZTNA (Zero Trust Network Access)
- Concede acesso **a aplicações específicas**, não à rede inteira, após verificar **identidade, dispositivo e contexto** a cada sessão; aplicações ficam invisíveis para quem não tem permissão.
- Diferença da VPN tradicional: a VPN costuma dar acesso amplo à rede depois de conectar (confiança implícita); o ZTNA aplica **menor privilégio** e reduz o movimento lateral. Integra o modelo **SASE**.

# seg-ataques | Ataques e ameaças: malware, DoS e DDoS
## Malware
- **Vírus** (precisa de um hospedeiro e da ação do usuário), **worm** (**se propaga sozinho** pela rede), **cavalo de Troia** (parece legítimo e traz função maliciosa), **ransomware** (criptografa dados e pede resgate; defesa: backups offline/imutáveis), **spyware** e **keylogger**, **adware**, **rootkit** (esconde a presença no sistema), **backdoor**, **bot/botnet** (máquinas zumbis controladas por um C&C), **fileless** (roda só em memória).
## Ataques de rede
- **DoS**: esgota recursos de um alvo a partir de uma origem. **DDoS**: de **muitas origens** (botnets). Tipos: volumétricos (inundação UDP, **amplificação** por DNS/NTP/memcached com IP falsificado), de protocolo (**SYN flood** — explora o handshake; defesa com SYN cookies) e de aplicação (camada 7, HTTP flood). Defesas: serviços de mitigação/scrubbing, CDN, rate limiting, anycast.
- **Man-in-the-middle**, **spoofing** (IP, ARP, DNS), **sniffing**, sequestro de sessão, força bruta e credential stuffing, **zero-day**.
## Engenharia social
**Phishing** (e-mail), **spear phishing** (direcionado), **whaling** (alta direção), **smishing** (SMS), **vishing** (voz), pretexting, **BEC** (comprometimento de e-mail corporativo). A melhor defesa é **conscientização** + MFA.
- **APT**: ameaça persistente avançada (atacante sofisticado que permanece longo tempo na rede).

# seg-cripto | Criptografia, hashes, certificados, assinatura digital e TLS
## Simétrica x assimétrica
- **Simétrica**: **mesma chave** para cifrar e decifrar; rápida; problema: distribuir a chave. Algoritmos: **AES** (padrão atual; blocos de 128 bits, chaves de 128/192/256), 3DES, ChaCha20 (fluxo). DES está obsoleto.
- **Assimétrica**: **par de chaves** (pública e privada); mais lenta. **RSA**, **ECC** (curvas elípticas, chaves menores), Diffie-Hellman (troca de chaves).
- **Confidencialidade**: cifra-se com a **chave pública do destinatário**; só a privada dele decifra.
- Na prática, sistemas **híbridos**: a assimétrica troca uma chave de sessão simétrica.
## Hash
- Função de mão única, saída de tamanho fixo; propriedades: resistência à pré-imagem e a **colisões**; efeito avalanche. Garante **integridade**.
- **MD5** e **SHA-1**: inseguros (colisões). Usar **SHA-256/SHA-3**. **HMAC**: hash com chave secreta (integridade + autenticidade).
- Senhas: armazenar com hash lento e **salt** (bcrypt, scrypt, **Argon2**, PBKDF2), nunca em texto claro nem só com hash simples.
## Assinatura digital
O emissor faz o hash da mensagem e o **cifra com sua chave privada**; o receptor verifica com a **chave pública** do emissor. Garante **autenticidade, integridade e não repúdio** (não garante confidencialidade).
## Certificados digitais e PKI
- Certificado **X.509**: vincula uma chave pública a uma identidade, **assinado por uma Autoridade Certificadora (AC)**. Cadeia de confiança até a AC raiz. No Brasil, **ICP-Brasil** (AC raiz: ITI); tipos A1 (arquivo, 1 ano) e A3 (token/cartão).
- **Revogação**: **LCR/CRL** (lista publicada periodicamente) e **OCSP** (consulta online do status).
## SSL/TLS
- SSL e TLS 1.0/1.1 estão **obsoletos**; usar **TLS 1.2** e **TLS 1.3**.
- Handshake: negocia versão e cifras, o servidor apresenta o certificado, troca de chaves (ECDHE) gera a chave de sessão simétrica.
- **TLS 1.3**: handshake mais rápido (**1-RTT**, 0-RTT opcional), removeu algoritmos fracos (RSA estático, SHA-1, RC4, CBC), **sigilo direto obrigatório**. HSTS força HTTPS; **mTLS** autentica os dois lados.

# seg-acesso | Controle de acesso, IAM, MFA, RBAC, SSO, OAuth 2.0 e OIDC
- **AAA**: **Autenticação** (quem é você), **Autorização** (o que pode fazer) e **Auditoria/Accounting** (o que fez). Antes vem a **identificação**.
- Fatores de autenticação: algo que você **sabe** (senha), **tem** (token, celular) e **é** (biometria). **MFA**: dois ou mais fatores **de categorias diferentes** (senha + PIN não é MFA). Preferir aplicativos autenticadores e **chaves FIDO2/passkeys** (resistentes a phishing) a SMS.
## Modelos de controle de acesso
- **DAC** (discricionário: o dono decide), **MAC** (obrigatório: rótulos de classificação definidos pelo sistema, como SELinux), **RBAC** (por **papéis/funções**: permissões atribuídas a papéis e usuários a papéis; facilita a **segregação de funções**), **ABAC** (por atributos do usuário, recurso e contexto).
- Princípios: **menor privilégio**, necessidade de conhecer, **segregação de funções**, revisão periódica de acessos.
## IAM e PAM
**IAM**: gestão de identidades e acessos ao longo do ciclo de vida (provisionamento e desprovisionamento, federação). **PAM**: gestão de contas **privilegiadas** (cofre de senhas, acesso just-in-time, gravação de sessões).
## SSO e federação
- **SSO**: um login dá acesso a várias aplicações. **SAML 2.0**: federação baseada em **XML** com asserções entre o **IdP** (provedor de identidade) e o **SP** (provedor de serviço), comum em aplicações corporativas web. Kerberos no ambiente Windows.
- **OAuth 2.0**: framework de **autorização delegada** — permite que uma aplicação acesse recursos em nome do usuário **sem receber sua senha**, usando **access tokens**. Papéis: **resource owner**, **client**, **authorization server**, **resource server**. Fluxos: **authorization code com PKCE** (recomendado para apps web, móveis e SPAs), **client credentials** (máquina a máquina), device code. Os fluxos implícito e password estão desaconselhados.
- **OpenID Connect (OIDC)**: camada de **autenticação** sobre o OAuth 2.0; adiciona o **ID token** (um **JWT** com informações do usuário), o escopo openid e o endpoint userinfo.
- **JWT**: header.payload.signature em Base64URL; assinado (não cifrado por padrão): não colocar dados sensíveis no payload; validar assinatura, expiração (exp) e audiência.
> Dica: OAuth = autorização; OIDC = autenticação (identidade).

# seg-lgpd | LGPD aplicada à TI: princípios, bases legais, direitos, agentes e ANPD
- **Lei 13.709/2018**. Aplica-se a qualquer tratamento de dados pessoais de pessoa natural, on-line ou off-line, por pessoa física ou jurídica, pública ou privada. Não se aplica a fins exclusivamente particulares, jornalísticos, artísticos, acadêmicos, de segurança pública e defesa nacional.
- **Dado pessoal**, **dado sensível** (origem racial ou étnica, religião, opinião política, filiação sindical ou religiosa, saúde, vida sexual, **genético e biométrico**), **dado anonimizado** e **tratamento** (toda operação: coleta, armazenamento, uso, compartilhamento, eliminação).
- **Fundamentos**: respeito à privacidade, **autodeterminação informativa**, liberdade de expressão, inviolabilidade da intimidade, desenvolvimento econômico e tecnológico, livre iniciativa, defesa do consumidor e direitos humanos.
- **Princípios**: boa-fé + finalidade, adequação, **necessidade**, livre acesso, qualidade dos dados, transparência, **segurança**, **prevenção**, não discriminação e **responsabilização e prestação de contas**.
- **Bases legais (art. 7º)**: consentimento (livre, informado e inequívoco, revogável), cumprimento de obrigação legal ou regulatória, execução de **políticas públicas** pela administração, estudos por órgão de pesquisa, execução de contrato, exercício regular de direitos, proteção da vida, tutela da saúde, **legítimo interesse** e **proteção do crédito**. Para dados sensíveis, as hipóteses são mais restritas (art. 11).
- **Tratamento pelo Poder Público**: para atender à **finalidade pública** e ao interesse público, executando competências legais, com transparência (informar as hipóteses de tratamento) e indicação de encarregado.
- **Direitos do titular (art. 18)**: confirmação da existência de tratamento, acesso, correção, anonimização, bloqueio ou eliminação de dados desnecessários, **portabilidade**, eliminação dos dados tratados com consentimento, informação sobre compartilhamento e sobre a possibilidade de não consentir, revogação do consentimento; e **revisão de decisões automatizadas** (art. 20).
- **Agentes de tratamento**: **controlador** (toma as decisões) e **operador** (trata em nome do controlador); o **encarregado (DPO)** é o canal com titulares e a ANPD.
- **ANPD**: autarquia de natureza especial, fiscaliza e aplica **sanções**: advertência, **multa simples de até 2% do faturamento no Brasil, limitada a R$ 50 milhões por infração**, multa diária, publicização, bloqueio e eliminação dos dados, suspensão.
- **Incidentes**: comunicar à ANPD e aos titulares quando houver risco ou dano relevante (regulamento da ANPD: prazo de **3 dias úteis**).
- **RIPD**: relatório de impacto à proteção de dados, para tratamentos de alto risco.
## Anonimização x pseudonimização
- **Anonimização**: o dado **perde a possibilidade de associação** a um indivíduo por meios técnicos razoáveis; deixa de ser dado pessoal (fora da LGPD, salvo se o processo for revertido). Técnicas: generalização, supressão, agregação, k-anonimato.
- **Pseudonimização**: o dado só pode ser associado ao indivíduo com uma **informação adicional mantida separadamente** (tokenização, chaves substitutas); **continua sendo dado pessoal**.

# seg-riscos-incidentes | Riscos (27005), incidentes (27035 e NIST 800-61) e nuvem (27017)
## ISO/IEC 27005:2022 (ABNT 2023)
Diretrizes para a **gestão de riscos de segurança da informação**, alinhada à ISO 31000 e à 27001: estabelecimento do contexto, **identificação** (abordagem baseada em **eventos** ou em **ativos**), **análise** (probabilidade e consequência), **avaliação**, **tratamento** (modificar/mitigar, reter, evitar, compartilhar), aceitação, comunicação e monitoramento. **Risco residual** = o que sobra após o tratamento.
## ISO/IEC 27035-1:2023
Princípios e processo de **gestão de incidentes de segurança da informação**, em fases: **planejar e preparar** → **detectar e relatar** → **avaliar e decidir** (é incidente?) → **responder** (conter, erradicar, recuperar) → **aprender lições**. **Evento** ≠ **incidente**: o incidente é um ou mais eventos indesejados com probabilidade significativa de comprometer o negócio.
## NIST SP 800-61 Rev. 3 (2025)
Reorganizou as recomendações de resposta a incidentes alinhando-as às **funções do NIST Cybersecurity Framework (CSF) 2.0**: **Governar, Identificar, Proteger, Detectar, Responder e Recuperar** — a resposta a incidentes passa a ser parte da gestão de riscos de cibersegurança como um todo (a Rev. 2 usava o ciclo preparação; detecção e análise; contenção, erradicação e recuperação; atividades pós-incidente). Preservação de evidências e **cadeia de custódia** continuam essenciais.
## ISO/IEC 27017:2015 (ABNT 2016)
Código de prática com controles de segurança para **serviços em nuvem**, complementando a 27002 com orientações para **cliente** e **provedor**: papéis e responsabilidades compartilhadas, remoção e devolução de ativos ao fim do contrato, **segregação** entre ambientes de clientes (multi-inquilino), proteção das máquinas virtuais, segurança operacional do administrador, monitoramento do serviço. (A 27018 trata de dados pessoais na nuvem.)
## Modelo de responsabilidade compartilhada
O provedor protege a nuvem (infraestrutura física e virtualização); o cliente protege o que coloca nela. Em **IaaS** o cliente cuida de mais coisas (SO, aplicação, dados); em **SaaS**, principalmente de dados, identidades e configurações de acesso.

# seg-zerotrust | Defesa em profundidade, Zero Trust, SOC, SIEM e EDR
- **Defesa em profundidade**: **várias camadas** de controles (físicos, rede, host, aplicação, dados, pessoas e políticas), de modo que a falha de uma não comprometa tudo.
- **Zero Trust** ("nunca confie, sempre verifique"; NIST SP 800-207): não existe rede interna confiável por padrão; cada acesso é **autenticado, autorizado e criptografado** com base em identidade, dispositivo e contexto; **menor privilégio**; **microssegmentação**; monitoramento contínuo; assumir que a violação já ocorreu. Componentes: PDP (ponto de decisão) e PEP (ponto de aplicação da política).
- **SOC**: centro de operações de segurança — equipe, processos e ferramentas que monitoram, detectam e respondem a incidentes 24×7 (níveis de analistas, threat hunting).
- **SIEM**: **coleta e correlaciona logs** de várias fontes, normaliza, gera **alertas** por regras de correlação, guarda para auditoria e investigação (Splunk, QRadar, Microsoft Sentinel, Wazuh). **SOAR** automatiza a resposta com playbooks.
- **Gestão e correlação de logs**: fontes sincronizadas por NTP, integridade e retenção, correlação de eventos distintos que juntos indicam um ataque.
- **EDR**: detecção e resposta nos **endpoints** — monitora o comportamento de processos, detecta ameaças além das assinaturas, permite **isolar a máquina**, investigar e reverter. **XDR**: amplia para rede, nuvem e e-mail. **Segurança de endpoints**: antivírus de nova geração, criptografia de disco, controle de dispositivos, patches, MDM.

# seg-owasp | Segurança de APIs e aplicações web: OWASP Top 10:2021
- **A01 Quebra de controle de acesso** (subiu para o 1º lugar): usuário acessa o que não deveria (IDOR, elevação de privilégio). Negar por padrão e checar no servidor.
- **A02 Falhas criptográficas**: dados sensíveis sem criptografia adequada, algoritmos fracos.
- **A03 Injeção**: SQL, NoSQL, comandos de SO, LDAP — e agora inclui o **XSS**. Defesa: **consultas parametrizadas**, validação de entrada, codificação de saída.
- **A04 Design inseguro** (nova): falhas de projeto; usar modelagem de ameaças e padrões seguros.
- **A05 Configuração incorreta de segurança**: padrões inseguros, mensagens de erro detalhadas, serviços desnecessários (inclui XXE).
- **A06 Componentes vulneráveis e desatualizados**: bibliotecas com CVEs (usar SCA).
- **A07 Falhas de identificação e autenticação**: senhas fracas, sessão mal gerida, sem MFA.
- **A08 Falhas de integridade de software e dados** (nova): atualizações e pipelines sem verificação, desserialização insegura.
- **A09 Falhas de registro e monitoramento de segurança**: ataques não detectados.
- **A10 SSRF** (Server-Side Request Forgery, nova): o servidor é induzido a fazer requisições para destinos internos.
## Outros pontos
- **XSS** (refletido, armazenado, baseado em DOM): defesa com codificação de saída e **CSP**. **CSRF**: tokens anti-CSRF e cookies **SameSite**.
- Cookies de sessão com **HttpOnly**, **Secure** e SameSite.
- **Segurança de APIs** (OWASP API Security Top 10): autorização em nível de objeto (BOLA), autenticação forte, limitação de taxa, validação de esquema, não expor dados demais, inventário de APIs e uso de **API Gateway**.
