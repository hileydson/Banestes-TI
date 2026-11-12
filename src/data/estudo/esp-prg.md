# prg-fundamentos | Fundamentos: sintaxe, compilação, tipos e operadores
## Compilação e execução
- **Compiladas para código nativo**: C (gera executável para a plataforma).
- **Bytecode + máquina virtual**: **Java** (javac gera .class, executado pela **JVM**, com compilação JIT) e **C#** (compila para **IL/CIL**, executado pelo **CLR** do .NET, com JIT).
- **Interpretadas**: **Python** (CPython compila para bytecode .pyc e interpreta) e **PHP** (interpretado pelo Zend Engine, com OPcache).
- **Tipagem**: estática (C, Java, C#: tipo verificado na compilação) x dinâmica (Python, PHP: no tempo de execução); forte (Python, Java) x fraca (C, PHP com coerções).
## Tipos primitivos
- Java: byte (8 bits), short (16), **int (32)**, long (64), float (32), double (64), char (**16 bits, Unicode**), boolean. String **não** é primitivo (é classe, imutável).
- C#: tipos de valor (int, double, bool, char, struct, enum) x de referência (class, string, arrays); tipos anuláveis (int?).
- C: char (1 byte), int, float, double; sem boolean nativo antes do C99 (0 é falso); strings são vetores de char terminados em '\0'.
- Python: int (precisão arbitrária), float, complex, bool, str, e coleções list, tuple (imutável), dict, set.
## Operadores e precedência
- Ordem geral: unários (!, ++, −) → multiplicativos (*, /, %) → aditivos → deslocamento → relacionais → igualdade → E lógico (&&) → OU lógico (||) → ternário → atribuição.
- **Curto-circuito**: em && e ||, o segundo operando só é avaliado se necessário.
- Divisão inteira: 7 / 2 = 3 em Java, C e C# com inteiros; em Python 3, 7 / 2 = 3.5 e 7 // 2 = 3.
- Pré-incremento (++i: incrementa e usa) x pós-incremento (i++: usa e incrementa).
- Java: == compara referência em objetos; equals compara conteúdo. Python: **is** compara identidade, **==** compara valor.
## Estruturas de controle
if/else, switch (Java 14+ e C# têm expressões switch), while, do-while (executa ao menos uma vez), for, for-each, break e continue. Python usa indentação, for sobre iteráveis, e tem else em laços.

# prg-oo | Orientação a objetos
- **Classe**: molde; **objeto**: instância. **Atributos** (estado) e **métodos** (comportamento). **Construtor** inicializa o objeto.
## Pilares
- **Encapsulamento**: esconder o estado interno e expor operações (modificadores private, protected, public; getters/setters; propriedades em C#).
- **Herança**: subclasse reaproveita e especializa a superclasse ("é um"). Java e C# têm **herança simples de classes** e múltipla de interfaces; Python e C++ permitem herança múltipla.
- **Polimorfismo**: o mesmo método com comportamentos diferentes. **Sobrescrita (override)**: mesma assinatura na subclasse, decidida em **tempo de execução** (ligação dinâmica). **Sobrecarga (overload)**: mesmo nome, **parâmetros diferentes** na mesma classe, decidida em **tempo de compilação**.
- **Abstração**: classes abstratas (não instanciáveis, podem ter implementação) e **interfaces** (contratos; Java 8+ e C# 8+ permitem métodos default).
## Detalhes por linguagem
- Java: **final** (classe não herdável, método não sobrescrevível, variável constante), **static** (pertence à classe), **packages** organizam classes e controlam acesso (visibilidade padrão = pacote).
- C#: **virtual/override**, **sealed**, **namespaces**, propriedades, LINQ, **async/await**, delegates e eventos.
- Python: **self**, __init__, sem modificadores reais (convenção _privado e __ "name mangling"), @staticmethod, @classmethod, @property, tipagem pato (duck typing).
- PHP: classes com public/private/protected, interfaces, **traits** (reuso horizontal), namespaces.
## Outros conceitos
**Coesão** alta e **acoplamento** baixo; composição preferível à herança; associação, agregação e composição; classe x instância (membros static).

# prg-solid | Princípios SOLID e padrões de projeto
- **S — Responsabilidade Única (SRP)**: uma classe deve ter **um só motivo para mudar**.
- **O — Aberto/Fechado (OCP)**: aberta para extensão, fechada para modificação (estender por herança/composição sem mexer no código existente).
- **L — Substituição de Liskov (LSP)**: subclasses devem poder substituir a classe base sem quebrar o comportamento esperado (ex. clássico: Quadrado herdando de Retângulo viola o LSP).
- **I — Segregação de Interfaces (ISP)**: muitas interfaces específicas são melhores que uma interface "gorda"; o cliente não deve depender de métodos que não usa.
- **D — Inversão de Dependência (DIP)**: módulos de alto nível não dependem de baixo nível; ambos dependem de **abstrações**. Viabilizado por **injeção de dependência**.
## Padrões GoF (resumo)
- **Criacionais**: Singleton (uma instância), Factory Method, Abstract Factory, Builder, Prototype.
- **Estruturais**: Adapter (compatibiliza interfaces), Facade (interface simplificada), Decorator (acrescenta comportamento dinamicamente), Proxy, Composite, Bridge, Flyweight.
- **Comportamentais**: Strategy (troca algoritmos), Observer (notifica dependentes), Command, Template Method, State, Iterator, Chain of Responsibility, Mediator, Memento, Visitor.
- Outros princípios: **DRY** (não se repita), **KISS**, **YAGNI**, Lei de Demeter.

# prg-excecoes | Tratamento de exceções e acesso a banco de dados
## Exceções
- Blocos **try / catch (except) / finally**: o finally sempre executa (liberar recursos).
- **Java**: exceções **verificadas (checked)** (subclasses de Exception, exceto RuntimeException) precisam ser tratadas ou declaradas com **throws**; **não verificadas** (RuntimeException: NullPointerException, ArithmeticException) não. **Error** indica problemas graves da JVM (OutOfMemoryError). **try-with-resources** fecha recursos AutoCloseable.
- **C#**: todas as exceções são não verificadas; **using** descarta recursos IDisposable; throw; preserva a pilha.
- **Python**: try/except/else/finally; raise; exceções derivam de BaseException/Exception; with para gerenciadores de contexto.
- Boas práticas: capturar a exceção mais específica primeiro, não "engolir" exceções, não usar exceções para controle de fluxo normal, registrar (log) com contexto.
## Acesso a banco de dados
- Java: **JDBC** (DriverManager/DataSource, Connection, **PreparedStatement**, ResultSet) e **JPA/Hibernate** (ORM, entidades com anotações).
- .NET: **ADO.NET** (SqlConnection, SqlCommand) e **Entity Framework Core** (ORM, LINQ, migrations).
- Python: DB-API (cursor, execute, commit), SQLAlchemy, Django ORM. PHP: **PDO** com prepared statements.
- Sempre usar **consultas parametrizadas** (evita **SQL injection**), pool de conexões, transações e fechar recursos.

# prg-linguagens | PHP, Python, C, Java, C# e .NET
- **Java**: "escreva uma vez, rode em qualquer lugar"; JDK (ferramentas) ⊃ JRE ⊃ JVM; coleções (List, Set, Map; ArrayList, HashMap), generics, streams e lambdas (Java 8+), records (16+), interfaces funcionais, Spring como framework comum.
- **C# e .NET**: .NET moderno (antigo .NET Core) é **multiplataforma e open source**; CLR, **BCL**, NuGet (pacotes), **ASP.NET Core** (web/APIs, MVC, Razor, Minimal APIs), Entity Framework Core, LINQ, async/await, garbage collector. Versões LTS a cada dois anos.
- **Python**: indentação significativa, listas (mutáveis) x tuplas (imutáveis), dicionários, **list comprehension** ([x*2 for x in lista if x > 0]), fatiamento (lista[1:3], lista[::-1]), funções como objetos, *args e **kwargs, decorators, geradores (yield). Pegadinha: argumento padrão mutável (def f(x=[]) é compartilhado entre chamadas).
- **PHP**: variáveis com $, arrays associativos, tipagem opcional (declare(strict_types=1)), Composer (pacotes), frameworks Laravel e Symfony; == compara com coerção e === compara valor e tipo.
- **C**: ponteiros (*p conteúdo, &x endereço), alocação manual (malloc/free), aritmética de ponteiros, structs, passagem por valor (simula referência com ponteiros), pré-processador (#include, #define).
> Dica: em Java e C#, String é imutável; concatenação em laço deve usar StringBuilder.

# prg-testes-git | Testes automatizados, TDD, BDD e Git
## Testes automatizados
- **Unitários** (JUnit, NUnit/xUnit, pytest, PHPUnit): rápidos, isolados, com dublês (mocks/stubs). **Integração**: componentes reais juntos (banco em memória como H2, Testcontainers).
- **Pirâmide de testes**: muitos unitários na base, menos integração, poucos testes ponta a ponta (E2E) no topo.
- Padrão **AAA**: Arrange, Act, Assert. Cobertura de código ajuda, mas não garante qualidade.
## TDD e BDD
- **TDD**: ciclo **Red → Green → Refactor**: escreva um teste que falha, faça o mínimo para passar, depois refatore.
- **BDD**: comportamento descrito em linguagem de negócio, formato **Gherkin**: **Given** (dado), **When** (quando), **Then** (então). Ferramentas: Cucumber, SpecFlow, Behave.
## Git
- Distribuído: cada clone tem o histórico completo. Áreas: diretório de trabalho → **staging (index)** → repositório local → remoto.
- Comandos: init, clone, add, commit, status, log, diff, branch, checkout/switch, merge, **rebase** (reaplica commits, reescreve histórico), fetch (baixa sem integrar), **pull** (fetch + merge), push, stash, tag, revert (desfaz criando novo commit), reset (move o ponteiro; --hard descarta alterações), cherry-pick.
## Fluxos de trabalho
- **GitFlow**: branches **main** (produção), **develop** (integração), **feature/** (saem de develop), **release/** (preparação, saem de develop e vão para main e develop), **hotfix/** (saem de main e voltam para main e develop).
- **Trunk-based**: integração frequente em um tronco único com branches curtas e feature flags.
- **Pull request / merge request**: propor a mudança, revisão de código, pipeline de CI e aprovação antes de integrar.
## Assistentes de código com IA
Uso responsável: revisar todo código gerado, não colar segredos, dados pessoais ou código sigiloso em ferramentas não autorizadas, verificar licenças e segurança (vulnerabilidades, dependências inventadas), manter testes e responsabilidade humana pelo resultado.
