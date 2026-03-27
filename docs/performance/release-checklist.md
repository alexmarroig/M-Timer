# Checklist de Release - Performance

## Thresholds mínimos aceitáveis

| Métrica | Android (mínimo aceitável) | iOS (mínimo aceitável) |
|---|---:|---:|
| Cold start | <= 2200 ms | <= 2000 ms |
| Tempo até primeira interação | <= 3200 ms | <= 2800 ms |
| Uso de memória (JS + app) | <= 160 MB | <= 140 MB |
| FPS médio na tela do timer | >= 55 FPS | >= 57 FPS |
| FPS mínimo na tela do timer | >= 42 FPS | >= 46 FPS |

## Checklist obrigatório

- [ ] Coletar métricas em build Release (não usar Debug).
- [ ] Validar cold start após reinstalação (app sem cache local).
- [ ] Validar primeira interação navegando para Sessão e Histórico.
- [ ] Coletar uso de memória após `navigation_ready`.
- [ ] Coletar FPS na tela `Player` por janela mínima de 4 segundos.
- [ ] Gerar relatório comparativo (`baseline` vs `current`) e anexar ao release notes.
- [ ] Bloquear release caso qualquer threshold mínimo seja violado.

## Evidências esperadas

- Captura dos logs `[perf:event]` e `[perf:metric]`.
- Arquivo `docs/performance/current.sample.json` atualizado com medições reais.
- Relatório Markdown gerado em `docs/performance/report.md`.
