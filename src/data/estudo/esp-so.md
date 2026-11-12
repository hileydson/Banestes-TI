# so-processos | Processos, threads e escalonamento de CPU
- **Processo**: programa em execução, com espaço de endereçamento próprio, contexto (registradores, contador de programa) e recursos. **Thread**: fluxo de execução dentro do processo; threads do mesmo processo **compartilham memória** e recursos, mas cada uma tem sua pilha e registradores. Criar e trocar threads é mais barato que processos.
- **Estados**: novo → **pronto** → **executando** → **bloqueado/espera** (aguardando E/S) → pronto ... → terminado.
- **Troca de contexto**: salvar o contexto de um processo e carregar o de outro (custo sem trabalho útil).
- **Processo zumbi**: terminou, mas o pai ainda não leu o status (wait). **Órfão**: o pai terminou antes; é adotado pelo init/systemd.
## Escalonamento (alocação de CPU)
- **Preemptivo** (o SO pode tirar a CPU) x **não preemptivo** (cooperativo).
- **FCFS/FIFO**: ordem de chegada, não preemptivo; sofre efeito comboio.
- **SJF**: o job mais curto primeiro (menor tempo médio de espera, mas exige prever a duração; pode causar starvation). **SRTF**: versão preemptiva.
- **Round Robin**: cada processo recebe um **quantum** em fila circular; quantum muito grande vira FCFS, muito pequeno gera trocas de contexto demais. Bom para sistemas interativos.
- **Prioridades** (pode causar **starvation**, resolvida com **envelhecimento/aging**); **múltiplas filas** com realimentação.
- Métricas: utilização da CPU, throughput, tempo de retorno (turnaround), tempo de espera e tempo de resposta.

# so-sincronizacao | Sincronização, deadlock e starvation
- **Condição de corrida**: o resultado depende da ordem de execução de processos que acessam dados compartilhados. **Região crítica**: trecho que acessa o recurso compartilhado.
- Requisitos de uma boa solução: **exclusão mútua**, **progresso** e **espera limitada** (sem starvation), sem supor velocidades.
- Mecanismos: **mutex/lock**, **semáforos** (Dijkstra: contador com operações P/wait/down e V/signal/up; binário ou contador), **monitores** (exclusão mútua automática com variáveis de condição), variáveis atômicas e spinlocks (espera ocupada).
- Problemas clássicos: produtor-consumidor, leitores-escritores, jantar dos filósofos.
## Deadlock (impasse)
Quatro condições **necessárias e simultâneas** (Coffman):
- **Exclusão mútua**; **posse e espera** (segura um recurso e espera outro); **não preempção** (o recurso não pode ser tomado); **espera circular**.
- Tratamento: **prevenir** (negar uma das condições, ex.: ordenar recursos para evitar espera circular), **evitar** (algoritmo do **banqueiro**, só concede se o sistema ficar em **estado seguro**), **detectar e recuperar** (grafo de alocação, matar processos ou preemptar) ou **ignorar** (algoritmo do avestruz).
## Starvation (inanição)
Um processo **espera indefinidamente** porque outros sempre são escolhidos antes (ex.: baixa prioridade). Diferente do deadlock, o sistema continua andando. Solução: envelhecimento (aging). **Livelock**: processos mudam de estado o tempo todo sem progredir.

# so-memoria | Gerenciamento de memória: paginação, segmentação e memória virtual
- **Endereço lógico** (gerado pelo programa) é traduzido em **físico** pela **MMU**.
- **Fragmentação externa**: espaço livre total suficiente, mas espalhado (ocorre na alocação contígua e na segmentação). **Fragmentação interna**: sobra dentro do bloco alocado (ocorre na paginação, na última página).
- Algoritmos de alocação contígua: first-fit, best-fit, worst-fit.
## Paginação
Memória lógica dividida em **páginas** e física em **quadros (frames)** de **mesmo tamanho**; a **tabela de páginas** mapeia uma na outra; a **TLB** é um cache dessas traduções. Elimina a fragmentação externa.
## Segmentação
Divide o programa em **segmentos** de tamanhos variáveis com significado lógico (código, dados, pilha), endereço = segmento + deslocamento. Pode ser combinada com paginação.
## Memória virtual
- Permite executar programas maiores que a memória física, mantendo no disco (área de **swap**/arquivo de paginação) as páginas não usadas. **Paginação sob demanda**: só carrega a página quando acessada; se não está na memória, ocorre **page fault**.
- **Substituição de páginas**: **FIFO** (sofre a **anomalia de Belady**: mais quadros podem gerar mais faltas), **Ótimo** (substitui a que demorará mais a ser usada; teórico, referência), **LRU** (menos recentemente usada), **relógio/segunda chance**, NRU, LFU.
- **Thrashing**: o sistema passa mais tempo trocando páginas do que executando, por falta de quadros (solução: reduzir o grau de multiprogramação, modelo do working set).

# so-es | Entrada e saída e armazenamento secundário e terciário
## E/S
- Técnicas: **E/S programada** (polling, a CPU espera em laço), **por interrupção** (o dispositivo avisa quando termina) e **DMA** (o controlador transfere blocos direto para a memória sem ocupar a CPU).
- Camadas: drivers de dispositivo, subsistema de E/S independente de dispositivo, **buffering**, **cache** e **spooling** (fila para dispositivos dedicados, como impressoras).
- Dispositivos de **bloco** (discos) x de **caractere** (teclado, terminal).
## Armazenamento secundário
- **HDD**: tempo de acesso = busca (seek) + latência rotacional + transferência. Escalonamento de disco: FCFS, **SSTF** (menor busca primeiro), **SCAN** (elevador), C-SCAN, LOOK.
- **SSD**: sem partes móveis, acesso muito mais rápido; desgaste por escrita (wear leveling, TRIM). NVMe usa PCIe.
- **RAID**: **0** (striping, desempenho, sem redundância), **1** (espelhamento), **5** (paridade distribuída, tolera 1 disco), **6** (dupla paridade, tolera 2), **10** (espelhamento + striping).
- Sistemas de arquivos: ext4 e **XFS** (padrão no Red Hat), Btrfs; **NTFS** e ReFS no Windows; journaling para recuperação após falhas.
- Armazenamento em rede: **NAS** (arquivos via NFS/SMB) e **SAN** (blocos via Fibre Channel ou iSCSI).
## Armazenamento terciário
Mídias removíveis de grande capacidade e baixo custo, para **backup e arquivamento**: **fitas magnéticas** (LTO, acesso sequencial), bibliotecas robotizadas, discos ópticos. Estratégia de backup **3-2-1**: 3 cópias, 2 mídias diferentes, 1 fora do local. Tipos: completo, incremental e diferencial.

# so-linux | Linux (Red Hat e Oracle Linux): administração e comandos
- **Red Hat Enterprise Linux (RHEL)** e **Oracle Linux** (compatível com o RHEL, com o kernel UEK opcional). Pacotes **RPM**, gerenciados por **dnf** (antigo yum). Debian/Ubuntu usam apt e .deb.
- Inicialização com **systemd**: systemctl start, stop, restart, enable (iniciar no boot), status; journalctl para logs; targets (multi-user, graphical).
## Comandos essenciais
- Arquivos: ls, cd, pwd, cp, mv, rm, mkdir, find, locate, cat, less, head, tail -f, grep, sed, awk, ln -s (link simbólico), tar, gzip.
- Permissões: **chmod** (r=4, w=2, x=1; 755 = rwxr-xr-x), **chown** (dono e grupo), umask; bits especiais SUID, SGID e sticky bit (no /tmp).
- Usuários: useradd, usermod, passwd, groupadd, id, **sudo**; arquivos /etc/passwd, /etc/shadow (senhas criptografadas), /etc/group.
- Processos: ps, top/htop, kill (SIGTERM 15, SIGKILL 9), nice/renice, jobs, bg, fg, nohup.
- Disco e sistema: df, du, free, mount, lsblk, fdisk/parted, LVM (pvcreate, vgcreate, lvcreate), uname, uptime.
- Rede: ip addr, ip route, ss, ping, traceroute, nmcli, curl, firewall-cmd (**firewalld**).
- Agendamento: **cron** (crontab: minuto hora dia mês dia-da-semana) e systemd timers.
## Diretórios
/etc (configurações), /var (dados variáveis e logs em /var/log), /home, /root, /tmp, /bin e /usr/bin, /boot, /dev, /proc (informações do kernel).
## Segurança
**SELinux** (controle de acesso obrigatório; modos enforcing, permissive e disabled; getenforce, setenforce, rótulos de contexto), firewalld, SSH com chave e sem login de root.

# so-windows | Windows 11, Windows Server, Active Directory e PowerShell
- **Windows 11**: exige **TPM 2.0**, **Secure Boot**/UEFI, CPU compatível, 4 GB de RAM e 64 GB de armazenamento. Recursos: BitLocker, Windows Hello, Defender.
- **Windows Server 2019 e 2022**: edições Standard e Datacenter; **Server Core** (sem interface gráfica, menor superfície de ataque, administrado por PowerShell e ferramentas remotas) e Desktop Experience; Windows Admin Center; **funções (roles)** como AD DS, DNS, DHCP, IIS, Hyper-V, File Server. O 2022 trouxe Secured-core server, TLS 1.3 por padrão e SMB over QUIC.
## Active Directory (AD DS)
- Serviço de diretório: **domínio** (limite administrativo e de segurança), **árvore**, **floresta** (limite de segurança maior), **OUs** (unidades organizacionais, para organizar e aplicar políticas), controladores de domínio (DCs) com replicação multimestre.
- Autenticação **Kerberos** (padrão; NTLM legado). Depende de **DNS**.
- **GPOs** (políticas de grupo) aplicadas na ordem **LSDOU**: Local, Site, Domínio, OU (a última vence).
- Grupos de **segurança** x de **distribuição**; escopos local de domínio, global e universal. Funções **FSMO** (mestre de esquema, de nomes de domínio, RID, PDC emulator, infraestrutura).
- Permissões NTFS x de compartilhamento: vale a **mais restritiva** entre as duas.
## PowerShell
- Shell orientado a **objetos** (o pipeline passa objetos, não texto). Comandos (**cmdlets**) no padrão **Verbo-Substantivo**: Get-Process, Get-Service, Stop-Service, Get-ChildItem, Set-Item, Get-Help, Get-Command.
- Filtro e seleção: Where-Object, Select-Object, Sort-Object; módulo ActiveDirectory (Get-ADUser, New-ADUser). Remoting com Enter-PSSession/Invoke-Command; política de execução de scripts (Set-ExecutionPolicy).

# so-virtualizacao | Virtualização, containers no SO, automação e hardening
## Virtualização de servidores
- **Hipervisor tipo 1 (bare-metal)**: roda direto no hardware (VMware ESXi, Hyper-V, KVM, Xen). **Tipo 2 (hospedado)**: roda sobre um SO (VirtualBox, VMware Workstation).
- **Virtualização total** (SO convidado sem modificação, com apoio de hardware Intel VT-x/AMD-V) x **paravirtualização** (SO convidado modificado, mais eficiente).
- Recursos: snapshots, **migração a quente** (vMotion/Live Migration), alta disponibilidade, overcommit de memória, templates.
## Containers no sistema operacional
Isolamento no nível do SO (namespaces e cgroups no Linux; containers Windows com isolamento de processo ou Hyper-V). Podman (sem daemon, rootless) no Red Hat; Docker.
## Automação de tarefas administrativas
Scripts shell (bash) e PowerShell, cron e Agendador de Tarefas, Ansible para configurar muitos servidores de forma idempotente.
## Hardening
Reduzir a superfície de ataque: remover serviços e pacotes desnecessários, aplicar **patches**, **menor privilégio**, desabilitar contas padrão e login remoto de root/administrador, senhas fortes e MFA, firewall local, SELinux/AppArmor, criptografia de disco, auditoria e logs centralizados, seguir **benchmarks CIS** e baselines de segurança.
