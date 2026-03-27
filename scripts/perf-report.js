const fs = require('fs');
const path = require('path');

const METRICS = [
  'cold_start_ms',
  'time_to_first_interaction_ms',
  'memory_used_mb',
  'timer_fps_avg',
  'timer_fps_min',
];

const LOWER_IS_BETTER = new Set(['cold_start_ms', 'time_to_first_interaction_ms', 'memory_used_mb']);

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function pctChange(base, current) {
  if (!base || Number.isNaN(base) || Number.isNaN(current)) {
    return null;
  }

  return ((current - base) / base) * 100;
}

function formatDelta(metric, base, current) {
  const delta = current - base;
  const pct = pctChange(base, current);
  const direction = LOWER_IS_BETTER.has(metric)
    ? delta <= 0
      ? '✅ melhor'
      : '❌ pior'
    : delta >= 0
      ? '✅ melhor'
      : '❌ pior';

  return `${delta >= 0 ? '+' : ''}${delta.toFixed(2)} (${pct?.toFixed(2)}%) ${direction}`;
}

function buildTableForPlatform(platform, baseData, currentData) {
  const lines = [];
  lines.push(`## ${platform.toUpperCase()}`);
  lines.push('');
  lines.push('| Métrica | Baseline | Atual | Delta |');
  lines.push('|---|---:|---:|---|');

  for (const metric of METRICS) {
    const base = Number(baseData?.[metric]);
    const current = Number(currentData?.[metric]);

    if (Number.isNaN(base) || Number.isNaN(current)) {
      lines.push(`| ${metric} | ${baseData?.[metric] ?? '-'} | ${currentData?.[metric] ?? '-'} | dados insuficientes |`);
      continue;
    }

    lines.push(`| ${metric} | ${base.toFixed(2)} | ${current.toFixed(2)} | ${formatDelta(metric, base, current)} |`);
  }

  lines.push('');
  return lines.join('\n');
}

function main() {
  const root = path.resolve(__dirname, '..');
  const baselinePath = path.join(root, 'docs/performance/baseline.json');
  const currentPath = path.join(root, 'docs/performance/current.sample.json');
  const outputPath = path.join(root, 'docs/performance/report.md');

  const baseline = loadJson(baselinePath);
  const current = loadJson(currentPath);

  const platforms = new Set([
    ...Object.keys(baseline.platforms ?? {}),
    ...Object.keys(current.platforms ?? {}),
  ]);

  const lines = [
    '# Relatório comparativo de performance',
    '',
    `- Baseline: ${baseline.version}`,
    `- Atual: ${current.version}`,
    `- Gerado em: ${new Date().toISOString()}`,
    '',
  ];

  for (const platform of platforms) {
    lines.push(buildTableForPlatform(platform, baseline.platforms?.[platform], current.platforms?.[platform]));
  }

  fs.writeFileSync(outputPath, lines.join('\n'));
  console.log(`Report generated at ${outputPath}`);
}

main();
