"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PHASES = exports.PHASE_ORDER = exports.PHASE_LABELS = void 0;
exports.PHASE_LABELS = {
    rampUp: 'Entrada',
    core: 'Meditacao',
    cooldown: 'Saida',
};
exports.PHASE_ORDER = ['rampUp', 'core', 'cooldown'];
exports.DEFAULT_PHASES = {
    rampUp: 120,
    core: 1200,
    cooldown: 180,
};
