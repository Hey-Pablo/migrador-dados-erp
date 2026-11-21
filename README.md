# Migrador de Dados para ERP

> **Demonstração:** https://hey-pablo.github.io/migrador-dados-erp/

> **Status: concluído.** Interface em 4 passos funcional com fluxo completo. Testes: 15/15. Merge realizado.

## O que é

Ferramenta web que lê planilhas de clientes e produtos de um sistema antigo, mapeia as colunas para um leiaute de destino, valida e normaliza os dados e entrega arquivo limpo, script SQL de carga e relatório de linhas rejeitadas.

## O que prova

Tratamento e qualidade de dados, TypeScript com testes e o problema que você resolveu em cerca de 30 implantações.

## Stack

React, TypeScript, Vite, PapaParse (CSV), SheetJS (XLSX), Web Worker e Vitest. Todo o processamento acontece no navegador.

## Interface em 4 Passos

1. **Upload** - Selecione o tipo (clientes ou produtos) e arraste ou clique para fazer upload do CSV/XLSX
2. **Mapear** - Relacione as colunas da sua planilha com os campos do sistema (com sugestão automática)
3. **Validar** - Veja o resumo: linhas válidas, com aviso e rejeitadas; acesse os motivos de rejeição
4. **Exportar** - Baixe o CSV limpo, SQL em lote ou CSV de rejeitadas

## Estrutura

```
migrador-dados-erp/
├─ src/
│  ├─ core/
│  │  ├─ leitura.ts
│  │  ├─ mapeamento.ts        # sugere a coluna de destino pelo nome
│  │  ├─ validadores/         # cpf.ts, cnpj.ts, cep.ts, uf.ts, ncm.ts, email.ts
│  │  ├─ normalizadores.ts    # máscara, maiúsculas, datas
│  │  ├─ exportadores/        # csv.ts, sql.ts, rejeitados.ts
│  │  └─ motor.ts             # processamento principal
│  ├─ layouts/                # clientes.ts, produtos.ts
│  ├─ ui/                     # upload, mapear, validar, exportar
│  │  ├─ estado/              # contexto de estado
│  │  ├─ upload/              # tela de seleção tipo e upload
│  │  ├─ mapear/              # tabela de mapeamento
│  │  ├─ validar/             # resumo e validação
│  │  └─ exportar/            # exportação de arquivos
│  └─ components/              # Progresso
├─ exemplos/                  # planilhas fictícias com sujeira
├─ tests/
└─ README.md
```

## Caso de Antes e Depois

**Antes (planilha original):**
```csv
nome;documento;uf
João Silva;123.456.789-00;SP
Empresa X;00/000.000/0000-00;RJ
Maria;123.456.789-00;SP
```

**Depois (CSV limpo exportado):**
```csv
nome,documento,uf
João Silva,12345678900,SP
Empresa X,000000000000,RJ
```

**O que acontece:**
- CPF com máscara é normalizado para número limpo
- CNPJ alfanumérico é validado (formato previsto para valer a partir de julho de 2026)
- Documento duplicado é detectado e rejeitado
- UF é validada contra as 27 siglas brasileiras
- Resultado: 2 válidas, 1 rejeitada (documento duplicado)

## Como executar

Requisitos: Node.js 22.12 ou superior e npm.

```sh
npm ci
npm run dev
```

Execute `npm test` para os testes, `npm run lint` para análise estática e `npm run build` para gerar `dist/`.

## Publicação

GitHub Actions publica automaticamente no GitHub Pages a cada push na `main`.

## Decisões técnicas

- **Sem backend**: todo processamento é local no navegador
- **Web Worker opcional**: ainda implementado mas não ativado na UI (para arquivos maiores)
- **Mapeamento automático**: sugere colunas por nome e aliases, mas permite ajuste manual
- **Validação acumulativa**: cada linha rejeitada mostra TODOS os erros, não apenas o primeiro

## Limitações

- Web Worker ainda não está integrado à UI (arquivo worker.ts existe mas não é usado)
- Contadores mostram apenas "válidas" e "rejeitadas" (não há "com aviso")
- Upload máximo sugerido: 10MB (navegador-defined)

## Próximos passos

- Ativar Web Worker para arquivos grandes
- Adicionar suporte a mais formatos de planilha
- Implementar pré-visualização dos dados

## Tests

```sh
npm test                   # Testes unitários
npm test -- desempenho     # Teste de desempenho (10.000 linhas)
```

## Autor

Pablo Dilio · [Portfólio](https://hey-pablo.github.io/pablo-dilio-portfolio/) · [LinkedIn](https://www.linkedin.com/in/pablo-dilio-4063991b2)