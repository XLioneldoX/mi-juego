// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  js/state.js  —  ESTADO DEL JUEGO                                        ║
// ║  Variables globales que representan el estado actual de la partida.      ║
// ║  No tocar salvo que sepas lo que haces.                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝

let playerTeamRaw = [];    // Datos raw del team-builder (IDs, EVs, items)
let playerTeam = [];    // Pokémon activos con currentHp, statBoosts, etc.
let enemyTeam = [];
let playerActive = 0;     // Índice del Pokémon activo del jugador
let enemyActive = 0;
let battleOver = false;
let turnCount = 1;
let isBusy = false; // Bloquea botones mientras hay animación
let switchForced = false; // El cambio es obligatorio (Pokémon debilitado)
let playerHazards = { toxicSpikes: 0 };
let enemyHazards = { toxicSpikes: 0 };
