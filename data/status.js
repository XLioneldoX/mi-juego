// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  data/status.js  —  ESTADOS ALTERADOS (Efectos negativos)               ║
// ║                                                                          ║
// ║  CÓMO CONFIGURAR:                                                        ║
// ║   • StatusDB → define cada estado con sus efectos                        ║
// ║   • Cada estado tiene:                                                   ║
// ║       label       → nombre visible en pantalla                           ║
// ║       color       → color del badge CSS                                  ║
// ║       icon        → emoji que aparece junto al Pokémon                   ║
// ║       blockMove   → true si puede impedir moverse ese turno              ║
// ║       blockChance → probabilidad de no moverse (0-100)                   ║
// ║       endOfTurnDmg→ daño al final del turno como fracción del HP máx    ║
// ║       spdMult     → multiplicador de velocidad (1 = normal)              ║
// ║       atkMult     → multiplicador de ataque (1 = normal)                 ║
// ║       curable     → true si desaparece solo con el tiempo                ║
// ║       turnsMax    → turnos máximos si curable (null = permanente)        ║
// ║   • Para añadir un estado nuevo: añádelo en StatusDB y                   ║
// ║     referéncialo en data/moves.js (effect: "apply_NOMBRE")               ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const StatusDB = {

    // ── PARÁLISIS ──────────────────────────────────────────────────────────
    // El Pokémon puede quedarse paralizado y no actuar.
    // Su velocidad se reduce a la mitad.
    paralysis: {
        label: "PAR",
        color: "#ca8a04",      // Amarillo dorado
        icon: "⚡",
        blockMove: true,
        blockChance: 25,             // 25% de no poder moverse
        endOfTurnDmg: 0,              // Sin daño al final del turno
        spdMult: 0.5,            // Velocidad a la mitad
        atkMult: 1,
        curable: false,
        turnsMax: null,
        wakeMsg: null,
        applyMsg: "{pokemon} quedó paralizado. ¡Puede que no pueda moverse!",
        blockMsg: "{pokemon} está paralizado. ¡No puede moverse!",
    },

    // ── QUEMADURA ──────────────────────────────────────────────────────────
    // Daña al Pokémon cada turno y reduce su ataque físico.
    burn: {
        label: "QUE",
        color: "#dc2626",      // Rojo
        icon: "🔥",
        blockMove: false,
        blockChance: 0,
        endOfTurnDmg: 1 / 16,           // Pierde 1/16 del HP máximo por turno
        spdMult: 1,
        atkMult: 0.5,            // Ataque físico a la mitad
        curable: false,
        turnsMax: null,
        applyMsg: "{pokemon} sufrió una quemadura.",
        turnMsg: "{pokemon} sufrió daño por la quemadura.",
    },

    // ── VENENO ─────────────────────────────────────────────────────────────
    // Daña al Pokémon cada turno (daño fijo).
    poison: {
        label: "VEN",
        color: "#7c3aed",      // Morado
        icon: "☠️",
        blockMove: false,
        blockChance: 0,
        endOfTurnDmg: 1 / 8,            // Pierde 1/8 del HP máximo por turno
        spdMult: 1,
        atkMult: 1,
        curable: false,
        turnsMax: null,
        applyMsg: "{pokemon} fue envenenado.",
        turnMsg: "{pokemon} sufrió daño por el veneno.",
    },

    // ── VENENO GRAVE (Tóxico) ──────────────────────────────────────────────
    // El daño aumenta cada turno (1/16, 2/16, 3/16...).
    // NOTA: la lógica de escalado está en js/battle-engine.js → applyStatusEffects()
    badPoison: {
        label: "TÓX",
        color: "#6b21a8",      // Morado oscuro
        icon: "💀",
        blockMove: false,
        blockChance: 0,
        endOfTurnDmg: 1 / 16,           // Base, se escala por turno en el motor
        scalingDmg: true,           // ← activa el escalado en battle-engine.js
        spdMult: 1,
        atkMult: 1,
        curable: false,
        turnsMax: null,
        applyMsg: "{pokemon} fue gravemente envenenado.",
        turnMsg: "{pokemon} sufrió daño por el veneno grave.",
    },

    // ── SUEÑO ──────────────────────────────────────────────────────────────
    // El Pokémon no puede moverse durante varios turnos.
    sleep: {
        label: "DOR",
        color: "#1d4ed8",      // Azul
        icon: "💤",
        blockMove: true,
        blockChance: 100,            // Siempre bloqueado mientras duerme
        endOfTurnDmg: 0,
        spdMult: 1,
        atkMult: 1,
        curable: true,
        turnsMin: 1,              // Mín de turnos dormido
        turnsMax: 3,              // Máx de turnos dormido (aleatorio)
        applyMsg: "{pokemon} se quedó dormido.",
        blockMsg: "{pokemon} está dormido.",
        wakeMsg: "{pokemon} se despertó.",
    },

    // ── CONGELACIÓN ────────────────────────────────────────────────────────
    // El Pokémon no puede moverse. Puede descongelarse cada turno.
    freeze: {
        label: "CON",
        color: "#0891b2",      // Cian
        icon: "🧊",
        blockMove: true,
        blockChance: 100,
        endOfTurnDmg: 0,
        spdMult: 1,
        atkMult: 1,
        curable: true,
        thawChance: 20,             // 20% de descongelarse cada turno
        turnsMax: null,           // No tiene límite fijo, depende del azar
        applyMsg: "{pokemon} quedó congelado.",
        blockMsg: "{pokemon} está congelado.",
        thawMsg: "{pokemon} se descongeló.",
    },

    // ← AÑADE UN ESTADO NUEVO AQUÍ SIGUIENDO EL MISMO FORMATO
    // Ejemplo:
    // confuse: {
    //     label:       "CON",
    //     color:       "#ec4899",
    //     icon:        "😵",
    //     blockMove:   false,
    //     selfHitChance: 33,   // % de golpearse a sí mismo
    //     ...
    // },

    // ── PETRIFICACIÓN ──────────────────────────────────────────────────────
    // El Pokémon se convierte en piedra. No puede moverse, pero su defensa física aumenta 50%.
    petrify: {
        label: "PET",
        color: "#9ca3af",      // Gris piedra
        icon: "🗿",
        blockMove: true,
        blockChance: 100,            // Siempre bloqueado
        endOfTurnDmg: 0,
        spdMult: 1,
        atkMult: 1,
        curable: true,
        turnsMin: 1,              // Mínimo de turnos petrificado
        turnsMax: 3,              // Máximo de turnos petrificado
        applyMsg: "{pokemon} se ha petrificado.",
        blockMsg: "{pokemon} está petrificado y no puede moverse.",
        wakeMsg: "{pokemon} se despetrificó.",
    },

}; // fin StatusDB


// ─── MENSAJES DE CURACIÓN ────────────────────────────────────────────────────
// Mensajes cuando se cura un estado (por objeto, movimiento o al cambiar).
const StatusCureMessages = {
    paralysis: "{pokemon} se curó de la parálisis.",
    burn: "{pokemon} se curó de la quemadura.",
    poison: "{pokemon} se curó del veneno.",
    badPoison: "{pokemon} se curó del veneno grave.",
    sleep: "{pokemon} se despertó.",         // también en StatusDB.sleep.wakeMsg
    freeze: "{pokemon} se descongeló.",
    petrify: "{pokemon} se despetrificó.",
};
