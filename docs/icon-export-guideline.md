# Android Icon Export Guideline (M-Timer)

Este projeto usa **Expo Adaptive Icons** em `app.json`:
- `icon`: `assets/icon.png` (launcher legacy/fallback)
- `android.adaptiveIcon.foregroundImage`: `assets/android-icon-foreground.png`
- `android.adaptiveIcon.backgroundImage`: `assets/android-icon-background.png`
- `android.adaptiveIcon.monochromeImage`: `assets/android-icon-monochrome.png`

## Dimensões obrigatórias

- `icon.png`: **1024x1024 px** (sem transparência, recomendado).
- `android-icon-foreground.png`: **512x512 px** com transparência.
- `android-icon-background.png`: **512x512 px** (pode ser sólido/ilustração full-bleed).
- `android-icon-monochrome.png`: **512x512 px** com transparência.

## Safe area e padding (evitar corte)

Para adaptive icon Android, considere viewport de **108dp** e safe area visual de **66dp central**.

- Razão do safe area: `66 / 108 = 61.11%`.
- Em canvas de 512 px, o diâmetro seguro ≈ **313 px**.
- Recomendação prática:
  - mantenha o conteúdo principal do `foreground` e `monochrome` dentro de um círculo central de ~**313 px**;
  - use **padding mínimo de 99 px** por lado (`(512 - 313) / 2`).

> Conteúdo fora dessa área pode aparecer cortado em launchers com máscaras mais agressivas ou com animação/parallax.

## Workflow recomendado (sem binários no repositório)

1. Exporte `foreground` e `monochrome` em 512x512 com fundo transparente.
2. Exporte `background` em 512x512 cobrindo todo canvas.
3. Rode validação local:

```bash
node scripts/validate-icons.js
```

4. Revise o relatório em `.artifacts/icon-validation/report.json` (**arquivo local, não versionado**).

## Critérios de aceite para próximo update

- Todos os assets Android com 512x512.
- `foreground` e `monochrome` sem conteúdo crítico fora do safe area.
- Sem clipping relevante nas métricas de máscara do `report.json`.
- Atualização validada pelo script e anexada no PR com resumo textual (sem arquivos binários).
