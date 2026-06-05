\# Simulador de Feridas



Ferramenta pedagógica interativa desenvolvida para apoiar o ensino do raciocínio clínico na avaliação, decisão terapêutica e tratamento de feridas.



Projeto desenvolvido no contexto da Licenciatura em Enfermagem da Universidade dos Açores.



> Exclusivamente para fins educativos. Não substitui avaliação clínica, orientação profissional ou tomada de decisão em contexto real.



\---



\## Objetivo



O Simulador de Feridas procura reduzir a distância entre aprendizagem teórica e prática clínica através de:



\- Simulação de casos clínicos realistas

\- Treino do raciocínio clínico

\- Feedback estruturado sobre decisões tomadas

\- Identificação de áreas de melhoria

\- Aprendizagem personalizada



\---



\## Funcionalidades Principais



\### Casos Clínicos Interativos



\- Casos com diferentes etiologias e apresentações clínicas

\- Variantes clínicas para aumentar diversidade

\- Navegação guiada ao longo do caso

\- Interpretação de imagens clínicas

\- Construção de plano terapêutico



\### Sistema de Avaliação Clínica



\- Correção automática

\- Avaliação multidimensional

\- Feedback estruturado

\- Penalização de raciocínio inconsistente

\- Pontuação global e por domínio



Domínios avaliados:



\- Observação clínica

\- Interpretação

\- Escolha terapêutica

\- Aplicação prática



\### Aprendizagem Personalizada



\- Histórico de desempenho

\- Recomendações automáticas

\- Sugestão do próximo caso

\- Identificação de fragilidades



\### Área Teórica



Conteúdos organizados por temas:



\- Identificação de tecidos

\- Gestão do exsudado

\- Desbridamento

\- Antimicrobianos

\- Seleção de coberturas

\- Pele peri-ferida

\- Processo de decisão clínica



\---



\## Tecnologias Utilizadas



\### Frontend



\- Next.js 16

\- React 19

\- TypeScript

\- Tailwind CSS 4



\### Arquitetura



\- App Router

\- Componentização modular

\- Motor clínico separado da interface

\- Sistema de validação de dados clínicos



\---



\## Estrutura do Projeto



```text

app/                    → páginas e routing

componentes/            → componentes reutilizáveis

data/clinico/           → casos e dados clínicos

lib/clinical/           → lógica clínica e scoring

scripts/                → validação de dados

public/                 → recursos estáticos

```



\---



\## Instalação



Clonar o repositório:



```bash

git clone <repo-url>

cd simulador-feridas

```



Instalar dependências:



```bash

npm install

```



Executar localmente:



```bash

npm run dev

```



Abrir:



```text

http://localhost:3000

```



\---



\## Scripts Disponíveis



Executar ambiente local:



```bash

npm run dev

```



Build produção:



```bash

npm run build

```



Executar testes clínicos:



```bash

npm run test:clinical

```



Validar dados clínicos:



```bash

npm run validate:data

```



Lint:



```bash

npm run lint

```



\---



\## Filosofia Educativa



O simulador foi desenvolvido com foco em:



\- Aprendizagem ativa

\- Segurança pedagógica

\- Feedback imediato

\- Desenvolvimento do raciocínio clínico

\- Transferência teoria-prática



\---



\## Limitações



\- Não substitui prática supervisionada

\- Não substitui guidelines institucionais

\- Não constitui ferramenta diagnóstica

\- Destinado exclusivamente a treino



\---



\## Autor



Rodrigo Marques Mendes  

Licenciatura em Enfermagem — Universidade dos Açores

