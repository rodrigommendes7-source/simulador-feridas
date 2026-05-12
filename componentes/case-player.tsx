"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import {
  construirRegistoTentativa,
  construirRevisaoTentativa,
  avaliarTentativaCaso,
  obterModeloCaso,
  type IdAplicacao,
  type IdDialogo,
  type IdObservacao,
  carregarHistoricoTentativas,
  guardarRegistoTentativa,
  obterMelhorPontuacaoAnteriorCaso,
} from "@/lib/clinico/indice";
import {
  VISUAL_TISSUE_OPTIONS,
  VISUAL_EXUDATE_OPTIONS,
  VISUAL_EDGE_OPTIONS,
} from "@/data/clinico/visualOptions";
import { PainelDialogoCaso } from "@/componentes/reprodutor-caso/painel-dialogo-caso";
import { IntroducaoCaso } from "@/componentes/reprodutor-caso/introducao-caso";
import { PainelJustificacaoCaso } from "@/componentes/reprodutor-caso/painel-justificacao-caso";
import { PainelObservacaoCaso } from "@/componentes/reprodutor-caso/painel-observacao-caso";
import { ResumoResultadoCaso } from "@/componentes/reprodutor-caso/resumo-resultado-caso";
import { PlaneadorTratamentoCaso } from "@/componentes/reprodutor-caso/planeador-tratamento-caso";
import { IdentificacaoVisualCaso } from "@/componentes/reprodutor-caso/identificacao-visual-caso";
import { gerarTodasPerguntasJustificacao } from "@/lib/clinico/motor-justificacao";
import type { RespostaJustificacao, MarcadorTecido, SubmissaoIdentificacaoVisual } from "@/lib/clinico/types";

type Etapa = "observacao" | "identificacao" | "dialogo" | "tratamento" | "justificacao" | "resultado";

export function SimuladorCaso({ idModelo }: { idModelo: string }) {
  const modelo = obterModeloCaso(idModelo);

  const [iniciado, setIniciado] = useState(false);
  const [etapa, setEtapa] = useState<Etapa>("observacao");
  const [modoRevisao, setModoRevisao] = useState(false);
  const [mostrarTutorial, setMostrarTutorial] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("tutorial-visto");
  });
  const [iniciadoEm, setIniciadoEm] = useState<number | null>(null);
  const [idsObservacao, setIdsObservacao] = useState<IdObservacao[]>([]);
  const [submissaoVisual, setSubmissaoVisual] = useState<SubmissaoIdentificacaoVisual>({ tecidos: [], exsudado: [], bordos: [] });
  const [marcadoresTecido, setMarcadoresTecido] = useState<MarcadorTecido[]>([]);
  const [idsDialogo, setIdsDialogo] = useState<IdDialogo[]>([]);
  const [idDialogoAtivo, setIdDialogoAtivo] = useState<IdDialogo | null>(null);
  const [idsTratamento, setIdsTratamento] = useState<string[]>([]);
  const [idsAplicacao, setIdsAplicacao] = useState<IdAplicacao[]>([]);
  const [respostasJustificacao, setRespostasJustificacao] = useState<RespostaJustificacao[]>([]);
  const [melhorPontuacaoAnterior, setMelhorPontuacaoAnterior] = useState<number | null>(null);
  const [mostrarNotificacao, setMostrarNotificacao] = useState(false);
  const temporizadorNotificacao = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tentativa = useMemo(
    () => ({
      idsObservacao,
      submissaoVisual,
      marcadoresTecido,
      idsDialogo,
      idsTratamento,
      idsAplicacao,
      respostasJustificacao,
    }),
    [idsObservacao, submissaoVisual, marcadoresTecido, idsDialogo, idsTratamento, idsAplicacao, respostasJustificacao]
  );

  // Todos os hooks têm de ser chamados antes de qualquer early return
  const avaliacao = useMemo(
    () => modelo ? avaliarTentativaCaso(modelo, tentativa) : null,
    [modelo, tentativa]
  );
  const revisao = useMemo(
    () => modelo ? construirRevisaoTentativa(modelo, tentativa) : null,
    [modelo, tentativa]
  );

  if (!modelo) throw new Error(`Modelo de caso não encontrado: ${idModelo}`);
  // Narrowing explícito para uso em closures — useMemo retorna null só se modelo é undefined (já guardado acima)
  const modeloSeguro = modelo;
  const avaliacaoSegura = avaliacao as NonNullable<typeof avaliacao>;
  const revisaoSegura = revisao as NonNullable<typeof revisao>;

  const observacaoConcluida = idsObservacao.includes("imagem") && idsObservacao.length >= 3;
  const identificacaoVisualConcluida = etapa !== "observacao" || idsObservacao.includes("imagem");
  const dialogoConcluido = idsDialogo.length >= 2;
  const tratamentoConcluido = idsTratamento.length >= 1;
  const aplicacaoConcluida = idsAplicacao.length >= 1;
  const prontoParaSubmeter =
    observacaoConcluida && dialogoConcluido && tratamentoConcluido && aplicacaoConcluida;

  function reiniciarCaso() {
    setIniciado(false);
    setEtapa("observacao");
    setModoRevisao(false);
    setIniciadoEm(null);
    setIdsObservacao([]);
    setSubmissaoVisual({ tecidos: [], exsudado: [], bordos: [] });
    setMarcadoresTecido([]);
    setIdsDialogo([]);
    setIdDialogoAtivo(null);
    setIdsTratamento([]);
    setIdsAplicacao([]);
    setRespostasJustificacao([]);
    setMelhorPontuacaoAnterior(null);
  }

  function iniciarCaso() {
    setIniciado(true);
    setModoRevisao(false);
    setIniciadoEm(Date.now());
  }

  function revelarObservacao(id: IdObservacao) {
    if (modoRevisao) return;
    setIdsObservacao((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function fazerPergunta(id: IdDialogo) {
    if (!modoRevisao) {
      setIdsDialogo((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }
    setIdDialogoAtivo(id);
  }

  function alternarTratamento(id: string) {
    if (modoRevisao) return;
    setIdsTratamento((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function alternarAplicacao(id: IdAplicacao) {
    if (modoRevisao) return;
    setIdsAplicacao((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function adicionarMarcadorTecido(pin: MarcadorTecido) {
    if (modoRevisao) return;
    setMarcadoresTecido((prev) => [...prev, pin]);
  }

  function removerMarcadorTecido(id: string) {
    if (modoRevisao) return;
    setMarcadoresTecido((prev) => prev.filter((p) => p.id !== id));
  }

  const perguntasJustificacao = useMemo(
    () => gerarTodasPerguntasJustificacao(idsTratamento, modelo),
    [idsTratamento]
  );

  const todasJustificacoesRespondidas =
    perguntasJustificacao.length === 0 ||
    perguntasJustificacao.every((q) =>
      respostasJustificacao.some((a) => a.idTratamento === q.idTratamento)
    );

  function responderJustificacao(idTratamento: string, optionId: string) {
    setRespostasJustificacao((prev) => {
      const filtered = prev.filter((a) => a.idTratamento !== idTratamento);
      return [...filtered, { idTratamento, idOpcaoSelecionada: optionId }];
    });
  }

  function avancarParaJustificacao() {
    if (!prontoParaSubmeter) return;
    setEtapa("justificacao");
  }

  function submeterFinal() {
    if (!todasJustificacoesRespondidas) return;

    const historico = carregarHistoricoTentativas();
    const priorBestScore = obterMelhorPontuacaoAnteriorCaso(historico, modeloSeguro.id);

    guardarRegistoTentativa(
      construirRegistoTentativa({
        avaliacao: avaliacaoSegura,
        historico,
        idModelo: modeloSeguro.id,
        tentativa,
        duracaoSegundos: iniciadoEm ? Math.round((Date.now() - iniciadoEm) / 1000) : 0,
      })
    );

    setMelhorPontuacaoAnterior(priorBestScore);
    setModoRevisao(false);
    setEtapa("resultado");
    setMostrarNotificacao(true);
    if (temporizadorNotificacao.current) clearTimeout(temporizadorNotificacao.current);
    temporizadorNotificacao.current = setTimeout(() => setMostrarNotificacao(false), 3000);
  }

  function abrirRevisao() {
    setModoRevisao(true);
    setEtapa("observacao");
    setIdDialogoAtivo(idsDialogo[0] ?? revisaoSegura.tentativaIdeal.idsDialogo[0] ?? null);
  }

  const orientacaoEtapa = modoRevisao
    ? "Estás em modo de revisão. As escolhas corretas aparecem a verde, as incorretas a vermelho e as que faltaram a azul claro."
    : etapa === "observacao"
      ? observacaoConcluida
        ? "Já tens observação mínima suficiente. Avança para identificar os tecidos e o exsudado visíveis."
        : idsObservacao.includes("imagem")
          ? "Agora confirma os achados-chave do leito para definires o problema dominante."
          : "Começa por observar a imagem e por recolher pelo menos dois achados clínicos essenciais."
      : etapa === "identificacao"
        ? "Com base na imagem, seleciona os tecidos, o exsudado e as características dos bordos que identificas."
        : etapa === "dialogo"
          ? dialogoConcluido
            ? "Já recolheste dados suficientes para justificar a decisão terapêutica."
            : idsDialogo.length === 0
              ? "Explora primeiro a dor e o contexto funcional para enquadrar o risco e o conforto."
              : "Falta consolidar o diálogo com mais uma pergunta clinicamente relevante."
          : etapa === "justificacao"
            ? todasJustificacoesRespondidas
              ? "Justificaste todos os materiais. Podes submeter o caso."
              : "Indica a razão clínica principal para cada material que selecionaste."
            : tratamentoConcluido && aplicacaoConcluida
              ? "O plano e a técnica já estão completos para receberes o feedback final."
              : tratamentoConcluido
                ? "Já tens materiais escolhidos, mas ainda falta definir a técnica de aplicação."
                : "Escolhe um material principal e confirma como o vais aplicar de forma segura.";

  const etapaVisualConcluida =
    submissaoVisual.tecidos.length > 0 ||
    submissaoVisual.exsudado.length > 0 ||
    submissaoVisual.bordos.length > 0;

  const listaProgresso = [
    {
      rotulo: "Observação mínima",
      done: observacaoConcluida,
      detalhe: observacaoConcluida
        ? `${idsObservacao.length} achados observados`
        : "Revê a imagem e recolhe pelo menos três achados clínicos",
    },
    {
      rotulo: "Identificação visual",
      done: etapaVisualConcluida,
      detalhe: etapaVisualConcluida
        ? "Tecidos, exsudado e bordos identificados"
        : "Seleciona pelo menos uma característica visual",
    },
    {
      rotulo: "Avaliação e diálogo",
      done: dialogoConcluido,
      detalhe: dialogoConcluido
        ? `${idsDialogo.length} perguntas feitas`
        : "Faz pelo menos duas perguntas clinicamente relevantes",
    },
    {
      rotulo: "Plano terapêutico",
      done: tratamentoConcluido,
      detalhe: tratamentoConcluido
        ? `${idsTratamento.length} ${idsTratamento.length === 1 ? "material selecionado" : "materiais selecionados"}`
        : "Seleciona pelo menos um material principal",
    },
    {
      rotulo: "Técnica de aplicação",
      done: aplicacaoConcluida,
      detalhe: aplicacaoConcluida
        ? `${idsAplicacao.length} decisões de aplicação`
        : "Escolhe pelo menos uma decisão técnica",
    },
  ];

  function fecharTutorial() {
    localStorage.setItem("tutorial-visto", "1");
    setMostrarTutorial(false);
  }

  return (
    <>
    {mostrarTutorial && (
      <div
        className="modal-overlay"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(0,0,0,0.65)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-2xl)",
        }}
        onClick={fecharTutorial}
      >
        <div
          className="modal-content"
          style={{
            background: "var(--color-surface)",
            border: "var(--border-default)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-3xl)",
            maxWidth: "480px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-lg)",
            boxShadow: "var(--shadow-lifted)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <p className="text-label" style={{ color: "var(--color-accent)", marginBottom: "var(--space-xs)" }}>
              Como funciona
            </p>
            <h2 className="text-h2">Simulador de Feridas</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            {[
              { step: "1", title: "Observa a ferida", body: "Começa por rever a imagem clínica e recolhe os achados essenciais: exsudado, tecidos e pele perilesional." },
              { step: "2", title: "Identifica o que vês", body: "Classifica os tecidos, o exsudado e as características dos bordos com base na imagem observada." },
              { step: "3", title: "Faz perguntas e define o plano", body: "Usa o diálogo para completar a leitura clínica, depois escolhe materiais e técnica de aplicação." },
              { step: "4", title: "Recebe feedback detalhado", body: "Cada escolha é avaliada com base nos objetivos clínicos do caso e nos princípios de decisão." },
            ].map(({ step: s, title, body }) => (
              <div key={s} style={{ display: "flex", gap: "var(--space-md)" }}>
                <div
                  style={{
                    flexShrink: 0,
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "var(--color-accent-subtle)",
                    border: "var(--border-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "var(--text-label)",
                    fontWeight: "var(--weight-medium)",
                    color: "var(--color-accent)",
                  }}
                >
                  {s}
                </div>
                <div>
                  <p style={{ fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)", fontSize: "var(--text-body)" }}>{title}</p>
                  <p className="text-body" style={{ marginTop: "2px" }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={fecharTutorial}
          >
            Começar
          </button>
        </div>
      </div>
    )}
    <main className="case-shell">
      {!iniciado ? (
        <div className="h-full w-full overflow-y-auto">
          <IntroducaoCaso modelo={modelo} aoIniciar={iniciarCaso} />
        </div>
      ) : etapa === "resultado" ? (
        <div className="h-full w-full overflow-y-auto">
          <ResumoResultadoCaso
            modelo={modelo}
            avaliacao={avaliacaoSegura}
            tentativa={tentativa}
            melhorPontuacaoAnterior={melhorPontuacaoAnterior}
            aoRever={abrirRevisao}
            aoReiniciar={reiniciarCaso}
          />
        </div>
      ) : (
        <>
          {/* ── Sidebar ─────────────────────────────────────────────────────── */}
          <aside className="case-sidebar">
            {/* Identidade do caso */}
            <div
              style={{
                background: "var(--color-surface)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-md)",
              }}
            >
              <p className="text-label" style={{ color: "var(--color-accent)" }}>
                Caso ativo
              </p>
              <h1
                style={{
                  marginTop: "var(--space-xs)",
                  fontSize: "var(--text-h3)",
                  fontWeight: "var(--weight-medium)",
                  color: "var(--color-text-primary)",
                }}
              >
                {modelo.tituloAbreviado}
              </h1>
              <p
                className="text-body"
                style={{ marginTop: "2px", color: "var(--color-text-secondary)" }}
              >
                {modelo.titulo}
              </p>
              <div
                style={{
                  marginTop: "var(--space-xs)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--space-xs)",
                }}
              >
                <span className="badge badge-info">{modelo.dificuldade}</span>
                <span className="badge badge-info">{modelo.minutosEstimados} min</span>
              </div>
            </div>

            {/* Navegação */}
            <div
              style={{
                background: "var(--color-surface)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-md)",
              }}
            >
              <p className="text-label" style={{ color: "var(--color-warning)" }}>
                Navegação
              </p>
              <div
                style={{
                  marginTop: "var(--space-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-xs)",
                }}
              >
                {([
                  ["observacao", "Observação", observacaoConcluida],
                  ["identificacao", "Identificação", etapaVisualConcluida],
                  ["dialogo", "Diálogo", dialogoConcluido],
                  ["tratamento", "Tratamento", tratamentoConcluido && aplicacaoConcluida],
                  ["justificacao", "Justificação", perguntasJustificacao.length > 0 && todasJustificacoesRespondidas],
                ] as [Etapa, string, boolean][]).map(([id, label, done]) => {
                  const isActive = etapa === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setEtapa(id)}
                      style={
                        isActive
                          ? {
                              width: "100%",
                              textAlign: "left",
                              padding: "var(--space-xs) var(--space-sm)",
                              borderRadius: "var(--radius-md)",
                              border: "0.5px solid var(--color-accent)",
                              background: "var(--color-elevated)",
                              color: "var(--color-accent)",
                              fontWeight: "var(--weight-medium)",
                              fontSize: "var(--text-body)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--space-xs)",
                            }
                          : done
                            ? {
                                width: "100%",
                                textAlign: "left",
                                padding: "var(--space-xs) var(--space-sm)",
                                borderRadius: "var(--radius-md)",
                                border: "0.5px solid var(--color-success-border)",
                                background: "var(--color-success-subtle)",
                                color: "var(--color-success)",
                                fontSize: "var(--text-body)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--space-xs)",
                                transition: "border-color var(--transition-fast), background var(--transition-fast)",
                              }
                            : {
                                width: "100%",
                                textAlign: "left",
                                padding: "var(--space-xs) var(--space-sm)",
                                borderRadius: "var(--radius-md)",
                                border: "var(--border-default)",
                                background: "transparent",
                                color: "var(--color-text-secondary)",
                                fontSize: "var(--text-body)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--space-xs)",
                              }
                      }
                    >
                      {done && !isActive ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : null}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progresso */}
            <div
              style={{
                background: "var(--color-surface)",
                border: "var(--border-default)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-md)",
              }}
            >
              <p className="text-label" style={{ color: "var(--color-info)" }}>
                Progresso
              </p>
              <div
                style={{
                  marginTop: "var(--space-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-xs)",
                }}
              >
                {listaProgresso.map((item) => (
                  <div
                    key={item.rotulo}
                    className={`progress-item ${item.done ? "progress-item-done" : "progress-item-pending"}`}
                  >
                    <p className="text-label" style={{ color: item.done ? "var(--color-success)" : "var(--color-text-primary)" }}>
                      {item.rotulo}
                    </p>
                    <p style={{ marginTop: "1px", fontSize: "var(--text-label)", color: "var(--color-text-secondary)", lineHeight: 1.4 }}>
                      {item.detalhe}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leitura visual — só aparece a partir do diálogo */}
            {(etapa === "dialogo" || etapa === "tratamento" || etapa === "justificacao") && (() => {
              const tissueLabels = submissaoVisual.tecidos
                .map((id) => VISUAL_TISSUE_OPTIONS.find((o) => o.id === id)?.rotulo)
                .filter(Boolean).join(", ") || "—";
              const exudateLabels = submissaoVisual.exsudado
                .map((id) => VISUAL_EXUDATE_OPTIONS.find((o) => o.id === id)?.rotulo)
                .filter(Boolean).join(", ") || "—";
              const edgeLabels = submissaoVisual.bordos
                .map((id) => VISUAL_EDGE_OPTIONS.find((o) => o.id === id)?.rotulo)
                .filter(Boolean).join(", ") || "—";
              const odorLabels: Record<string, string> = {
                ausente: "Ausente", ligeiro: "Ligeiro", moderado: "Moderado", fetido: "Fétido", presente: "Presente", intenso: "Intenso",
              };
              const odorValue = idsObservacao.includes("cheiro")
                ? (odorLabels[modelo.estadoFerida.odor] ?? modelo.estadoFerida.odor)
                : "—";

              const rows: { label: string; value: string }[] = [
                { label: "Exsudado", value: exudateLabels },
                { label: "Odor", value: odorValue },
                { label: "Tecido", value: tissueLabels },
                { label: "Pele perilesional", value: edgeLabels },
              ];

              return (
                <div
                  style={{
                    background: "var(--color-surface)",
                    border: "var(--border-default)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-md)",
                  }}
                >
                  <p className="text-label" style={{ color: "var(--color-warning)" }}>
                    A tua leitura
                  </p>
                  <div
                    style={{
                      marginTop: "var(--space-sm)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-xs)",
                    }}
                  >
                    {rows.map(({ label, value }) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: "var(--space-sm)",
                          borderRadius: "var(--radius-md)",
                          border: "var(--border-default)",
                          background: "var(--color-elevated)",
                          padding: "2px var(--space-sm)",
                        }}
                      >
                        <span style={{ fontSize: "var(--text-label)", color: "var(--color-text-secondary)", flexShrink: 0 }}>
                          {label}
                        </span>
                        <span style={{ fontSize: "var(--text-label)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)", textAlign: "right" }}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </aside>

          {/* ── Área principal ──────────────────────────────────────────────── */}
          <div className="case-main-area">
            {/* Banner contextual + guidance — linha única */}
            <div className="case-banner-row">
              <div
                style={{
                  flex: 1,
                  background: "var(--color-surface)",
                  border: "var(--border-default)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-xs) var(--space-md)",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "var(--space-sm)",
                }}
              >
                <span className="text-label" style={{ color: "var(--color-info)", flexShrink: 0 }}>Contexto</span>
                <span style={{ fontSize: "var(--text-label)", color: "var(--color-text-secondary)" }}>{modelo.bannerPaciente}</span>
              </div>
              <div
                style={{
                  flex: 1,
                  background: "var(--color-elevated)",
                  border: "var(--border-default)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-xs) var(--space-md)",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "var(--space-sm)",
                }}
              >
                <span className="text-label" style={{ color: "var(--color-warning)", flexShrink: 0 }}>
                  {modoRevisao ? "Revisão" : "Orientação"}
                </span>
                <span style={{ fontSize: "var(--text-label)", color: "var(--color-text-secondary)" }}>{orientacaoEtapa}</span>
              </div>
            </div>

            {/* Painel do passo atual */}
            <div className="case-active-panel">
              {etapa === "observacao" ? (
                <PainelObservacaoCaso
                  modelo={modelo}
                  observationIds={idsObservacao}
                  estadoRevisaoPorId={modoRevisao ? revisaoSegura.estadoObservacao : undefined}
                  modoRevisao={modoRevisao}
                  aoRevelar={modoRevisao ? () => undefined : revelarObservacao}
                />
              ) : etapa === "identificacao" ? (
                <IdentificacaoVisualCaso
                  submission={submissaoVisual}
                  onChange={setSubmissaoVisual}
                  imageSrc={modelo.srcImagem}
                  tissuePins={marcadoresTecido}
                  onAddPin={adicionarMarcadorTecido}
                  onRemovePin={removerMarcadorTecido}
                  hasTissueZones={(modelo.zonasTecido?.length ?? 0) > 0}
                />
              ) : etapa === "dialogo" ? (
                <PainelDialogoCaso
                  modelo={modelo}
                  dialogueIds={idsDialogo}
                  activeDialogueId={idDialogoAtivo}
                  estadoRevisaoPorId={modoRevisao ? revisaoSegura.estadoDialogo : undefined}
                  modoRevisao={modoRevisao}
                  aoPerguntar={fazerPergunta}
                />
              ) : etapa === "justificacao" ? (
                <PainelJustificacaoCaso
                  questions={perguntasJustificacao}
                  answers={respostasJustificacao}
                  aoResponder={responderJustificacao}
                />
              ) : (
                <PlaneadorTratamentoCaso
                  modelo={modelo}
                  treatmentIds={idsTratamento}
                  applicationIds={idsAplicacao}
                  estadoTratamentoPorId={modoRevisao ? revisaoSegura.estadoTratamento : undefined}
                  estadoAplicacaoPorId={modoRevisao ? revisaoSegura.estadoAplicacao : undefined}
                  modoRevisao={modoRevisao}
                  aoAlternarTratamento={alternarTratamento}
                  aoAlternarAplicacao={alternarAplicacao}
                />
              )}
            </div>

            {/* Barra de ações */}
            <div className="case-action-bar">
              <p style={{ fontSize: "var(--text-label)", color: "var(--color-text-secondary)" }}>
                {modoRevisao
                  ? "Navega pelas etapas para comparar a tua resolução."
                  : prontoParaSubmeter
                    ? "Já reuniste informação suficiente para receber a avaliação final."
                    : "Conclui a observação, o diálogo, o plano e a técnica para desbloquear o resultado."}
              </p>
              <div style={{ display: "flex", flexShrink: 0, gap: "var(--space-sm)" }}>
                {modoRevisao ? (
                  <button
                    type="button"
                    onClick={() => setEtapa("resultado")}
                    className="btn btn-ghost"
                  >
                    Voltar ao resultado
                  </button>
                ) : null}
                {!modoRevisao && etapa === "observacao" ? (
                  <button
                    type="button"
                    onClick={() => setEtapa("identificacao")}
                    className="btn btn-primary"
                  >
                    Continuar para identificação
                  </button>
                ) : null}
                {!modoRevisao && etapa === "identificacao" ? (
                  <button
                    type="button"
                    onClick={() => setEtapa("dialogo")}
                    className="btn btn-primary"
                  >
                    Continuar para diálogo
                  </button>
                ) : null}
                {!modoRevisao && etapa === "dialogo" ? (
                  <button
                    type="button"
                    onClick={() => setEtapa("tratamento")}
                    className="btn btn-primary"
                  >
                    Continuar para tratamento
                  </button>
                ) : null}
                {!modoRevisao && etapa === "tratamento" ? (
                  <button
                    type="button"
                    onClick={avancarParaJustificacao}
                    disabled={!prontoParaSubmeter}
                    className="btn btn-primary"
                    title={!prontoParaSubmeter ? "Conclui observação, diálogo, plano e técnica para avançar" : undefined}
                  >
                    Avançar para justificação
                  </button>
                ) : null}
                {!modoRevisao && etapa === "justificacao" ? (
                  <button
                    type="button"
                    onClick={submeterFinal}
                    disabled={!todasJustificacoesRespondidas}
                    className="btn btn-primary"
                    title={!todasJustificacoesRespondidas ? "Justifica todos os materiais selecionados para submeter" : undefined}
                  >
                    Submeter caso
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
    </main>

    {mostrarNotificacao && (
      <div className="toast toast-success">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Caso submetido com sucesso
      </div>
    )}
    </>
  );
}
