# 🩺 Simulador de Tratamento de Feridas

Simulador interativo desenvolvido no âmbito da Licenciatura em Enfermagem da Universidade dos Açores, com o objetivo de apoiar a aprendizagem prática na avaliação e tratamento de feridas em contexto clínico.

---

## 🎯 Objetivo

Este projeto tem como finalidade permitir aos estudantes de enfermagem:

- Desenvolver raciocínio clínico na abordagem à ferida
- Treinar a seleção adequada de materiais de tratamento
- Compreender a evolução de uma ferida ao longo do tempo
- Receber feedback sobre decisões clínicas

---

## 🧠 Funcionalidades

- 📂 Casos clínicos interativos (aleatórios ou selecionáveis)
- 📝 Contextualização inicial do utente e da ferida
- 🖼️ Visualização da ferida (imagem clínica)
- 🔍 Consulta de dados clínicos (exsudado, tecido, odor, dimensões)
- ✍️ Identificação de tecidos (interface interativa)
- 🧴 Seleção de materiais de tratamento
- 📊 Sistema de avaliação com feedback automático
- 📜 Histórico de casos resolvidos

---

## 🏗️ Estrutura do Projeto


simulador-feridas/
│
├── src/
│ ├── app/
│ │ ├── page.tsx (menu principal)
│ │ ├── casos/
│ │ ├── aprender/
│ │ └── historico/
│ │
│ ├── components/
│ ├── data/ (casos clínicos em JSON)
│ └── styles/
│
├── public/
├── package.json
└── README.md


---

## ⚙️ Tecnologias Utilizadas

- React / Next.js
- TypeScript
- CSS / Tailwind (se aplicável)
- Estrutura baseada em componentes reutilizáveis

---

## 🧪 Estado Atual

✔ Interface base funcional  
✔ Sistema de casos clínicos implementado  
✔ Lógica de seleção de materiais  
✔ Sistema de feedback em desenvolvimento  

---

## 🚧 Próximos Passos

- Melhorar sistema de avaliação (evitar conflitos de feedback)
- Implementar página "Aprender" com conteúdo teórico
- Criar histórico persistente de casos
- Otimizar UI/UX (design mais minimalista e responsivo)
- Adaptar totalmente para mobile (iPhone)

---

## 👨‍⚕️ Contexto Académico

Projeto desenvolvido por **Rodrigo Marques Mendes**, estudante do 4.º ano da Licenciatura em Enfermagem na Universidade dos Açores, no âmbito do Ensino Clínico em Unidade de Tratamentos.

Este contexto foca-se particularmente no tratamento de feridas, área central da prática em cuidados de saúde primários :contentReference[oaicite:0]{index=0}.

---

## 📚 Enquadramento

A prática de enfermagem em contexto de tratamento de feridas exige:

- Avaliação clínica rigorosa
- Seleção adequada de materiais
- Adaptação contínua do plano de cuidados

Este simulador pretende funcionar como ferramenta complementar ao ensino clínico, facilitando a consolidação destas competências.

---

## 📌 Nota

Este projeto encontra-se em desenvolvimento ativo e poderá sofrer alterações frequentes.

---

## 📬 Contacto

Rodrigo Marques Mendes  
📧 2022108118@uac.pt  