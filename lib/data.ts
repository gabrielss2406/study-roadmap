// lib/data.ts
export type Topic = { label: string };
export type Month = {
  id: string;
  label: string;
  title: string;
  resource: string;
  deliverable: string;
  topics: Topic[];
};
export type Quarter = {
  id: string;
  label: string;
  title: string;
  months: string;
  color: string;
  dark: string;
  tint: string;
  months_data: Month[];
};

export const QUARTERS: Quarter[] = [
  {
    id: "q1", label: "Q1", title: "Fundamentos Formais", months: "1–3",
    color: "#4F6EF7", dark: "#1e2a6e", tint: "#0f1433",
    months_data: [
      {
        id: "m1", label: "Mês 1", title: "Clean Architecture & SOLID",
        resource: "Clean Architecture — Uncle Bob",
        deliverable: "Refatorar 1 módulo documentando o porquê",
        topics: [
          { label: "Revisitar SOLID com olhar crítico" },
          { label: "Camadas, boundaries e separação de responsabilidades" },
          { label: "Inversão de dependência na prática" },
          { label: "Identificar violações no codebase atual" },
          { label: "Escrever primeiro ADR da semana" },
        ],
      },
      {
        id: "m2", label: "Mês 2", title: "DDD Formal",
        resource: "YouTube: DDD Europe channel",
        deliverable: "Mapa de contextos do sistema atual",
        topics: [
          { label: "Ubiquitous Language e modelagem de domínio" },
          { label: "Bounded Contexts e Anti-Corruption Layer" },
          { label: "Aggregates e Domain Events" },
          { label: "Mapear domínios da Mulher em Forma" },
          { label: "Continuar ADRs semanais" },
        ],
      },
      {
        id: "m3", label: "Mês 3", title: "Event-Driven Architecture",
        resource: "DDIA — Kleppmann (caps. 11–12)",
        deliverable: "Fluxo event-driven com Kafka local",
        topics: [
          { label: "Kafka: producers, consumers, partitions" },
          { label: "Diferença entre mensageria e streaming" },
          { label: "Event Sourcing e CQRS como conceitos" },
          { label: "Saga pattern e Transactional Outbox" },
          { label: "Implementar producer/consumer local" },
        ],
      },
    ],
  },
  {
    id: "q2", label: "Q2", title: "Profundidade Técnica", months: "4–6",
    color: "#10B981", dark: "#064e3b", tint: "#021f17",
    months_data: [
      {
        id: "m4", label: "Mês 4", title: "Sistemas Distribuídos",
        resource: "DDIA — Kleppmann (caps. 8–9)",
        deliverable: "Análise: onde seu sistema aceita inconsistência",
        topics: [
          { label: "CAP Theorem em profundidade e PACELC" },
          { label: "Consistência eventual vs forte" },
          { label: "Paxos e Raft (conceitual)" },
          { label: "Two-Phase Commit e trade-offs" },
          { label: "Ler papers Dynamo (Amazon) e Spanner (Google)" },
        ],
      },
      {
        id: "m5", label: "Mês 5", title: "Kubernetes na Prática",
        resource: "YouTube: TechWorld with Nana + kubernetes.io",
        deliverable: "Deploy de microsserviço em K8s local (minikube)",
        topics: [
          { label: "Pods, Deployments, Services e Ingress" },
          { label: "ConfigMaps, Secrets e resource limits" },
          { label: "HPA e VPA para auto-scaling" },
          { label: "Helm charts e namespaces" },
          { label: "Subir cluster local com minikube" },
        ],
      },
      {
        id: "m6", label: "Mês 6", title: "Resiliência & SRE",
        resource: "sre.google/books (gratuito)",
        deliverable: "Runbook de incident response + SLOs definidos",
        topics: [
          { label: "Circuit Breaker avançado e Bulkhead pattern" },
          { label: "Rate Limiting e Chaos Engineering" },
          { label: "SLOs, SLIs e Error Budgets" },
          { label: "Como K8s e observabilidade se conectam" },
          { label: "Conduzir 1 postmortem formal" },
        ],
      },
    ],
  },
  {
    id: "q3", label: "Q3", title: "Decisão & Documentação", months: "7–9",
    color: "#F59E0B", dark: "#78350f", tint: "#2d1a06",
    months_data: [
      {
        id: "m7", label: "Mês 7", title: "Segurança by Design",
        resource: "owasp.org + YouTube: LiveOverflow",
        deliverable: "Threat model de um serviço crítico do trabalho",
        topics: [
          { label: "Threat modeling com STRIDE" },
          { label: "Zero Trust Architecture" },
          { label: "OAuth2/OIDC em profundidade" },
          { label: "Secrets management no Kubernetes" },
          { label: "OWASP Top 10 para APIs" },
        ],
      },
      {
        id: "m8", label: "Mês 8", title: "Documentação Arquitetural",
        resource: "c4model.com (gratuito)",
        deliverable: "Diagrama C4 completo do backend da Mulher em Forma",
        topics: [
          { label: "Modelo C4: Context, Container, Component, Code" },
          { label: "ADRs profissionais com estrutura" },
          { label: "RFCs como ferramenta de alinhamento" },
          { label: "Criar biblioteca de ADRs retroativa" },
          { label: "Apresentar C4 para alguém não-técnico" },
        ],
      },
      {
        id: "m9", label: "Mês 9", title: "Tech Specs, RFCs & FinOps",
        resource: "staffeng.com + Staff Engineer — Larson",
        deliverable: "RFC real + case study da redução de 5x em infra",
        topics: [
          { label: "Estrutura de RFC que é aprovado" },
          { label: "Como apresentar trade-offs técnicos" },
          { label: "FinOps: cloud cost optimization avançado" },
          { label: "Custo por feature e Reserved Instances" },
          { label: "Documentar case study da redução de custo" },
        ],
      },
    ],
  },
  {
    id: "q4", label: "Q4", title: "Observabilidade & Liderança", months: "10–12",
    color: "#A855F7", dark: "#4c1d95", tint: "#1a0a33",
    months_data: [
      {
        id: "m10", label: "Mês 10", title: "Observabilidade Avançada",
        resource: "opentelemetry.io/docs + YouTube: Honeycomb.io",
        deliverable: "Serviço real instrumentado com tracing ponta a ponta",
        topics: [
          { label: "OpenTelemetry do zero: instrumentação de código" },
          { label: "Traces distribuídos entre microsserviços" },
          { label: "Correlação de traces em produção" },
          { label: "Diferença real entre logs, métricas e traces" },
          { label: "Projetar observabilidade desde o design" },
        ],
      },
      {
        id: "m11", label: "Mês 11", title: "Liderança Técnica Essencial",
        resource: "staffeng.com + Staff Engineer — Larson",
        deliverable: "RFC aprovado + Tech Radar do time",
        topics: [
          { label: "RFCs e tech specs que são aprovados" },
          { label: "Tech Radar: Adopt / Trial / Assess / Hold" },
          { label: "Build vs buy vs open-source como framework" },
          { label: "Como apresentar trade-offs para não-técnicos" },
          { label: "Propor e liderar 1 iniciativa do zero ao deploy" },
        ],
      },
      {
        id: "m12", label: "Mês 12", title: "Portfólio & Posicionamento",
        resource: "Revisão do ano",
        deliverable: "3 case studies publicados + GitHub atualizado",
        topics: [
          { label: "Montar portfólio de decisões arquiteturais" },
          { label: "Case study de observabilidade como peça central" },
          { label: "Preparar 3 case studies completos" },
          { label: "GitHub com narrativa de arquiteto" },
          { label: "Publicar 1 artigo técnico no LinkedIn ou dev.to" },
        ],
      },
    ],
  },
];

export const ALL_MONTHS = QUARTERS.flatMap((q) => q.months_data);
export const getMonth = (id: string) => ALL_MONTHS.find((m) => m.id === id);
export const getQuarterByMonth = (monthId: string) =>
  QUARTERS.find((q) => q.months_data.some((m) => m.id === monthId));
