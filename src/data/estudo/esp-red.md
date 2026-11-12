# red-fundamentos | Tipos de rede, meios de transmissão e comutação
## Por abrangência
**PAN/WPAN** (pessoal, Bluetooth), **LAN/WLAN** (local, Ethernet e Wi-Fi), **MAN/WMAN** (metropolitana), **WAN/WWAN** (longa distância, inclusive redes celulares 4G/5G).
## Meios de transmissão
- **Guiados**: par trançado (UTP sem blindagem, STP/FTP blindados), cabo coaxial, **fibra óptica**.
- **Não guiados**: rádio (Wi-Fi), micro-ondas, satélite, infravermelho.
- Transmissão **simplex** (um sentido), **half-duplex** (dois sentidos alternados) e **full-duplex** (simultâneos).
## Comutação
- **De circuitos**: caminho dedicado reservado durante toda a comunicação (telefonia tradicional); banda garantida, mas desperdiça quando ociosa.
- **De pacotes**: dados divididos em pacotes que compartilham os enlaces (internet); datagrama (sem conexão) ou circuito virtual.
- **De células**: pacotes de **tamanho fixo** (ATM: células de 53 bytes), baixa variação de atraso.
## Topologias e equipamentos de interconexão
- Topologias: barramento, anel, **estrela** (mais comum), malha.
- **Hub** (camada 1, repete para todas as portas, um domínio de colisão), **switch** (camada 2, encaminha por endereço **MAC**, cada porta é um domínio de colisão), **roteador** (camada 3, encaminha por **IP** entre redes, separa domínios de broadcast), **switch camada 3**, **access point**, gateway, bridge.
## Modelos de referência
- **OSI (7 camadas)**: física, enlace, rede, transporte, sessão, apresentação, aplicação.
- **TCP/IP**: acesso à rede (enlace/física), internet (IP), transporte (TCP/UDP) e aplicação.
- Unidades: bit (física), quadro (enlace), pacote (rede), segmento/datagrama (transporte).

# red-tcpip | Arquitetura TCP/IP, IPv4, IPv6, TCP e UDP
## IPv4
- Endereço de **32 bits** em notação decimal pontuada. Máscara define rede e hosts (CIDR /24 = 255.255.255.0).
- Hosts utilizáveis por sub-rede = 2^(bits de host) − 2 (rede e broadcast). /24 → 254; /26 → 62; **/30 → 2** (enlaces ponto a ponto).
- **Privados (RFC 1918)**: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. Loopback 127.0.0.0/8; APIPA 169.254.0.0/16. **NAT** traduz endereços privados em públicos.
- Classes (histórico): A (1-126), B (128-191), C (192-223), D (multicast), E.
## IPv6
- Endereço de **128 bits** em hexadecimal, 8 grupos de 16 bits; zeros à esquerda podem ser omitidos e **::** substitui **uma única** sequência de grupos zerados.
- **Não tem broadcast** (usa multicast e **anycast**). Tipos: global unicast (2000::/3), **link-local (fe80::/10)**, unique local (fc00::/7), loopback ::1, multicast (ff00::/8).
- **SLAAC** (autoconfiguração sem estado) e **NDP** (descoberta de vizinhos, substitui o ARP). Cabeçalho simplificado, com cabeçalhos de extensão; IPsec nativo no projeto; transição por **pilha dupla**, túneis e NAT64.
## TCP x UDP
- **TCP**: orientado a conexão (**three-way handshake: SYN, SYN-ACK, ACK**), confiável (confirmações, retransmissão, ordenação), controle de fluxo (janela deslizante) e de congestionamento. Encerramento com FIN.
- **UDP**: sem conexão, sem garantia de entrega nem ordem, cabeçalho de 8 bytes, baixa latência. Uso: DNS, DHCP, VoIP, streaming, SNMP.
## Portas conhecidas
FTP 20/21, **SSH 22**, Telnet 23, **SMTP 25** (587 submissão), **DNS 53**, **DHCP 67/68**, **HTTP 80**, POP3 110, NTP 123, **IMAP 143**, **SNMP 161/162**, **LDAP 389** (LDAPS 636), **HTTPS 443**, IMAPS 993, POP3S 995, RDP 3389.

# red-protocolos | Protocolos: ARP, DNS, DHCP, HTTP, FTP, SSH, e-mail, LDAP e IPsec
- **ARP**: descobre o endereço **MAC** a partir do IP na rede local (requisição em broadcast). Ataque: ARP spoofing.
- **DNS**: traduz nomes em endereços. Hierarquia: raiz → TLD → autoritativo; resolução recursiva e iterativa; cache com TTL. Registros: **A** (IPv4), **AAAA** (IPv6), **CNAME** (apelido), **MX** (servidor de e-mail), **NS**, **PTR** (reverso), **TXT** (SPF, DKIM), SOA, SRV. Usa UDP 53 (TCP para respostas grandes e transferência de zona). DNSSEC assina as respostas.
- **DHCP**: atribui IP e configurações automaticamente. Processo **DORA**: **Discover, Offer, Request, Ack**. Relay agent encaminha entre redes; reservas por MAC.
- **HTTP**: sem estado; versões 1.1 (conexões persistentes), **2** (binário, multiplexação) e **3** (sobre **QUIC/UDP**). **HTTPS** = HTTP sobre TLS.
- **FTP**: transferência de arquivos com conexão de **controle (21)** e de **dados (20 no modo ativo)**; modo passivo facilita firewalls; inseguro (texto claro) — usar SFTP (sobre SSH) ou FTPS.
- **SSH**: acesso remoto seguro e criptografado (porta 22), autenticação por senha ou **chave pública**, túneis (port forwarding), SCP e SFTP.
- **E-mail**: **SMTP** envia e transfere entre servidores; **POP3** baixa as mensagens (normalmente remove do servidor); **IMAP** sincroniza e mantém as mensagens no servidor (pastas, vários dispositivos).
- **LDAP**: protocolo de acesso a **serviços de diretório** (estrutura hierárquica com DN, OU, CN); usado pelo Active Directory e OpenLDAP; operações bind, search, add, modify.
- **IPsec**: segurança na **camada de rede**. **AH** (autenticação e integridade, sem confidencialidade) e **ESP** (com criptografia); modos **transporte** (protege o conteúdo) e **túnel** (encapsula o pacote inteiro, usado em VPNs); **IKE** negocia as chaves.

# red-roteamento | Roteamento: OSPF, BGP e MPLS
- **Roteamento estático** (configurado manualmente) x **dinâmico** (protocolos trocam informações).
- **IGP** (dentro de um sistema autônomo) x **EGP** (entre sistemas autônomos).
- **Vetor de distância** (RIP: métrica de saltos, máximo 15) x **estado de enlace** (OSPF, IS-IS) x **vetor de caminho** (BGP).
## OSPF
- IGP de **estado de enlace**: cada roteador conhece a topologia (LSAs) e calcula o menor caminho com o algoritmo de **Dijkstra (SPF)**.
- Métrica: **custo** (baseado na largura de banda). Convergência rápida, suporta VLSM/CIDR.
- **Áreas**: a **área 0 (backbone)** conecta as demais; roteadores ABR (borda de área) e ASBR (borda de sistema autônomo). Em redes multiacesso elege **DR e BDR**.
## BGP
- Protocolo de roteamento **entre sistemas autônomos** da internet (EGP), **vetor de caminho**, usa **TCP porta 179**.
- **eBGP** (entre ASs diferentes) e **iBGP** (dentro do mesmo AS).
- Decisão por **políticas e atributos** (AS_PATH, LOCAL_PREF, MED, NEXT_HOP), não por menor custo técnico.
## MPLS
- Encaminha pacotes por **rótulos (labels)** curtos inseridos entre as camadas 2 e 3 ("camada 2,5"), em vez de consultar o IP a cada salto.
- **LSR** (comuta rótulos) e **LER** (insere e remove na borda); caminhos **LSP**; FEC (classe de encaminhamento).
- Usos: **VPNs de camada 3 (MPLS VPN)** de operadoras, **engenharia de tráfego** e QoS.
## Sumarização de rotas
Agrupar várias redes contíguas em um prefixo maior (ex.: 192.168.0.0/24 a 192.168.3.0/24 → **192.168.0.0/22**), reduzindo tabelas de roteamento.

# red-cabeamento | Cabeamento estruturado (NBR 14565:2019) e fibras ópticas
## Cabeamento estruturado
- **ABNT NBR 14565:2019**: norma brasileira de cabeamento estruturado para edifícios e data centers.
- Subsistemas: **cabeamento horizontal** (do armário de telecomunicações até a tomada da área de trabalho; **até 90 m** de cabo permanente, com cordões totalizando **100 m** no canal), **backbone** (vertical, entre armários e salas de equipamentos), área de trabalho, sala de equipamentos e entrada de facilidades.
- Categorias de par trançado: **Cat 5e** (até 100 MHz, 1 Gbps), **Cat 6** (250 MHz; 10 Gbps só até ~55 m), **Cat 6A** (500 MHz, **10 Gbps a 100 m**), **Cat 7** (600 MHz, blindado). Classes correspondentes: D, E, EA, F.
- Padrões de crimpagem T568A e T568B; cabo **direto** (mesmo padrão nas pontas) e **crossover** (um em cada).
## Fibras ópticas
- Imunes a interferência eletromagnética, grande banda e distância, segurança contra grampo.
- **Monomodo (SMF)**: núcleo fino (~9 µm), um único modo de propagação, laser, **longas distâncias** (dezenas de km), mais cara nos transceptores.
- **Multimodo (MMF)**: núcleo maior (50 ou 62,5 µm), vários modos, LED/VCSEL, **distâncias curtas** (centenas de metros, dentro de prédios e data centers), sofre **dispersão modal**. Tipos OM1 a OM5.
- Conectores: LC, SC, ST, MPO. Perdas por atenuação, emendas e conectores.

# red-ieee | Padrões IEEE 802: Ethernet, VLAN, Spanning Tree, 802.1X e Wi-Fi
## Ethernet (802.3)
- **802.3**: Ethernet, acesso **CSMA/CD** (em half-duplex). **802.3u**: Fast Ethernet (**100 Mbps**). **802.3z**: Gigabit Ethernet em **fibra** (802.3ab é o Gigabit em par trançado). **802.3ae**: **10 Gigabit** Ethernet (fibra). **802.3af**: **PoE** — alimentação elétrica pelo cabo de rede (até ~15,4 W; o 802.3at/PoE+ chega a ~30 W).
## Switching
- **802.1D**: bridges e **Spanning Tree Protocol (STP)**, que evita **loops** em camada 2 bloqueando portas redundantes; elege uma **root bridge** (menor bridge ID). **802.1D-2004** incorporou o **RSTP** (802.1w, convergência rápida).
- **802.1Q**: **VLANs** — tag de 4 bytes no quadro com o **VLAN ID (12 bits, até 4094 VLANs)**; portas **access** (uma VLAN, sem tag) e **trunk** (várias VLANs, com tag); VLAN nativa sem tag. **802.1Q-2005** incorporou o **MSTP** (múltiplas instâncias de spanning tree). **802.1p**: **prioridade** (QoS) com 3 bits (classes 0 a 7) no mesmo tag.
- **802.1X**: **controle de acesso à rede baseado em porta**: **suplicante** (dispositivo), **autenticador** (switch/AP) e **servidor de autenticação** (geralmente **RADIUS**), usando **EAP**.
## Wi-Fi (802.11)
- **802.11n (Wi-Fi 4)**: 2,4 e 5 GHz, **MIMO**, até 600 Mbps. **802.11ac (Wi-Fi 5)**: **somente 5 GHz**, MU-MIMO (downlink), canais de até 160 MHz. **802.11ax (Wi-Fi 6/6E)**: 2,4, 5 e **6 GHz (6E)**, **OFDMA**, MU-MIMO nos dois sentidos, **Target Wake Time**, melhor em ambientes densos.
- Em 2,4 GHz, os canais sem sobreposição são **1, 6 e 11**. Acesso ao meio por **CSMA/CA**.

# red-modernas | SDN, NFV, VLAN, VXLAN e redes de data center
- **VLAN**: segmenta logicamente uma rede física em domínios de broadcast separados (segurança e organização); a comunicação entre VLANs exige roteamento (roteador ou switch L3).
- **VXLAN**: estende redes de **camada 2 sobre camada 3** encapsulando quadros Ethernet em **UDP (porta 4789)**; identificador **VNI de 24 bits** (cerca de **16 milhões** de segmentos, contra 4094 VLANs); os pontos de encapsulamento são os **VTEPs**. Muito usado em data centers e nuvens multi-inquilino, com **EVPN** (BGP) como plano de controle.
- **SDN (Redes Definidas por Software)**: **separa o plano de controle do plano de dados**, centralizando a inteligência em um **controlador** programável. **Interface southbound** (controlador ↔ equipamentos, ex.: **OpenFlow**) e **northbound** (controlador ↔ aplicações, APIs REST).
- **NFV (Virtualização de Funções de Rede)**: funções antes feitas por hardware dedicado (firewall, roteador, balanceador) rodam como **software** em servidores comuns (VNFs), orquestradas pelo framework **ETSI NFV MANO**. SDN e NFV são complementares.
- **Data center moderno**: topologia **spine-leaf** (cada leaf liga a todos os spines; latência previsível, escala horizontal) no lugar da tradicional de três camadas (núcleo, agregação, acesso); tráfego predominante **leste-oeste** (entre servidores); ECMP para múltiplos caminhos.
