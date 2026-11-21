# Migrador de Dados para ERP

> **Demonstração:** https://hey-pablo.github.io/migrador-dados-erp/

> **Status: em desenvolvimento.** O código entra aos poucos; abaixo está o planejamento do projeto.

## O que é

Ferramenta web que lê planilhas de clientes e produtos de um sistema antigo, mapeia as colunas para um leiaute de destino, valida e normaliza os dados e entrega arquivo limpo, script SQL de carga e relatório de linhas rejeitadas.

## O que prova

Tratamento e qualidade de dados, TypeScript com testes e o problema que você resolveu em cerca de 30 implantações.

## Stack

React, TypeScript, Vite, PapaParse (CSV), SheetJS (XLSX), Zod, Web Worker e Vitest. Todo o processamento acontece no navegador.

## Estrutura

```
migrador-dados-erp/
├─ src/
│  ├─ core/
│  │  ├─ leitura.ts
│  │  ├─ mapeamento.ts        # sugere a coluna de destino pelo nome
│  │  ├─ validadores/         # cpf.ts, cnpj.ts, cep.ts, uf.ts, ncm.ts, email.ts
│  │  ├─ normalizadores.ts    # máscara, maiúsculas, datas
│  │  └─ exportadores/        # csv.ts, sql.ts, rejeitados.ts
│  ├─ layouts/                # clientes.ts, produtos.ts
│  ├─ ui/                     # Upload, Mapear, Validar, Exportar
│  └─ worker.ts
├─ exemplos/                  # planilhas fictícias com sujeira
├─ tests/
└─ README.md
```

## Plano

1. Defina os leiautes de destino: campo, tipo, obrigatório e tamanho.
2. Validadores com testes. CPF e CNPJ com dígito verificador. Inclua o CNPJ alfanumérico, formato previsto para valer a partir de julho de 2026; confira a regra oficial da Receita Federal antes de implementar.
3. Leitura de CSV e XLSX com detecção de separador e codificação.
4. Mapeamento de colunas com sugestão automática e ajuste manual.
5. Motor de validação por linha, que acumula todos os erros da linha.
6. Detecção de duplicados por documento.
7. Interface em 4 passos com pré-visualização e contadores (válidas, com aviso, rejeitadas).
8. Exportação: CSV limpo, `INSERT` em lotes e CSV de rejeitados com o motivo.
9. Web Worker para arquivos grandes, com meta de 10 mil linhas em até 5 segundos.
10. Publicação e README com um caso de antes e depois.

## Como deve funcionar

- O usuário envia a planilha, confere o mapeamento sugerido e vê quantas linhas passam.
- Cada linha rejeitada mostra todos os motivos, por exemplo "CNPJ com dígito inválido; UF inexistente".
- O arquivo limpo sai sem máscara, com datas no padrão ISO e texto normalizado.
- Nada é enviado a servidor.

## Prazo

2 semanas.

## Execução local

Requisitos: Node.js 22.12 ou superior e npm. Instale e execute:

```sh
npm ci
npm run dev
```

Execute `npm test` para os testes, `npm run lint` para análise estática e `npm run build` para gerar `dist/`. O site atual é uma tela inicial; a importação e a interface de migração ainda serão implementadas.

## Regras disponíveis

Os módulos em `src/core/validadores` retornam booleanos. CPF e CNPJ verificam formato e dígitos verificadores; CNPJ aceita letras minúsculas e maiúsculas e preserva compatibilidade com números. CEP e NCM verificam somente o formato, sem consultar existência em cadastro oficial. UF aceita as 27 siglas brasileiras. E-mail verifica sintaxe básica, sem confirmar entrega ou existência da caixa postal. Entradas inválidas não são reparadas silenciosamente.

`removerMascara` remove pontos, barras, hífens e espaços; `normalizarTexto` remove espaços excedentes e converte para maiúsculas; `normalizarData` aceita `DD/MM/AAAA` ou `AAAA-MM-DD`, valida o calendário e retorna ISO ou `null`. Os dados de teste são fictícios, exceto o exemplo público de cálculo da Receita.

O CNPJ alfanumérico usa módulo 11 e valor ASCII menos 48 para cada caractere, conforme o [manual da Receita Federal](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf) e a [IN RFB 2.229/2024](https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2024/outubro/cnpj-tera-letras-e-numeros-a-partir-de-julho-de-2026). Validar dígitos não prova que um documento foi emitido.

A publicação no GitHub Pages ocorre por GitHub Actions após push na `main`. A demonstração está publicada e acessível no link abaixo do título.

## Autor

Pablo Dilio · [Portfólio](https://hey-pablo.github.io/pablo-dilio-portfolio/) · [LinkedIn](https://www.linkedin.com/in/pablo-dilio-4063991b2)
