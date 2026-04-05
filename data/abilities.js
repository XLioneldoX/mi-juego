// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  data/abilities.js  —  HABILIDADES PASIVAS                               ║
// ║                                                                          ║
// ║  CÓMO FUNCIONA:                                                          ║
// ║   Cada Pokémon tiene UNA habilidad pasiva que se activa automáticamente. ║
// ║   Las habilidades se asignan en data/pokemon.js  (campo "ability")       ║
// ║                                                                          ║
// ║  PROPIEDADES DE CADA HABILIDAD:                                          ║
// ║   name        → nombre visible                                           ║
// ║   icon        → emoji decorativo                                         ║
// ║   description → texto corto para el editor y el combate                  ║
// ║   trigger     → CUÁNDO se activa (ver lista abajo)                       ║
// ║   effect      → QUÉ hace (ver lista abajo)                               ║
// ║   value       → parámetro numérico del efecto (multiplicador, %, etc.)   ║
// ║                                                                          ║
// ║  ════ TRIGGERS disponibles ════                                          ║
// ║   "on_attack"        → al lanzar un ataque                               ║
// ║   "on_hit"           → al recibir daño                                   ║
// ║   "on_switch_in"     → al entrar en combate                              ║
// ║   "end_of_turn"      → al final de cada turno                            ║
// ║   "on_status"        → al recibir un estado alterado                     ║
// ║   "passive"          → siempre activa (stats, inmunidades, etc.)         ║
// ║                                                                          ║
// ║  ════ EFFECTS disponibles ════                                           ║
// ║   "boost_same_type"  → ataque STAB ×value en vez de ×1.5                ║
// ║   "boost_atk_mult"   → multiplica ATK por value al atacar                ║
// ║   "boost_spa_mult"   → multiplica SPA por value al atacar                ║
// ║   "boost_def_mult"   → multiplica DEF por value (pasivo)                 ║
// ║   "boost_spe_mult"   → multiplica SPE por value (pasivo)                 ║
// ║   "heal_on_hit"      → recupera value% HP al recibir daño                ║
// ║   "heal_end_turn"    → recupera value% HP al final del turno             ║
// ║   "immune_status"    → inmune al estado indicado en "immune"             ║
// ║   "immune_type"      → inmune a un tipo de ataque (en "immune")          ║
// ║   "counter_burn"     → si está quemado, ATK no se reduce                 ║
// ║   "recoil_dmg_boost" → el daño de retroceso potencia el siguiente ataque ║
// ║   "speed_boost"      → +1 SPE cada turno que pasa                        ║
// ║   "priority_boost"   → sus movimientos normales ganan +1 prioridad       ║
// ║   "crit_boost"       → mayor probabilidad de golpe crítico               ║
// ║                                                                          ║
// ║  ════ PARA AÑADIR UNA HABILIDAD NUEVA ════                               ║
// ║   1. Añade la entrada en AbilitiesDB con su trigger y effect             ║
// ║   2. Ve a js/battle-engine.js → función applyAbility()                  ║
// ║      y añade el case para el nuevo effect                                ║
// ║   3. Asígnala a un Pokémon en data/pokemon.js  (campo ability)           ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const AbilitiesDB = {

    // ════════════════════════════════════════════════════════════════════════
    // 🔥 HABILIDADES DE POTENCIACIÓN OFENSIVA
    // ════════════════════════════════════════════════════════════════════════

    "Ímpetu": {
        name:        "Ímpetu",
        icon:        "🔥",
        description: "Los movimientos de tipo FUEGO hacen ×1.3 de daño adicional.",
        trigger:     "on_attack",
        effect:      "boost_type_atk",
        boostedType: "FUEGO",
        value:       1.3,
    },

    "Torrente": {
        name:        "Torrente",
        icon:        "💧",
        description: "Cuando el HP baja del 33%, los movimientos de AGUA hacen ×1.5 de daño.",
        trigger:     "on_attack",
        effect:      "boost_type_low_hp",
        boostedType: "AGUA",
        value:       1.5,
        threshold:   0.33,
    },

    "Espesura": {
        name:        "Espesura",
        icon:        "🌿",
        description: "Cuando el HP baja del 33%, los movimientos de PLANTA hacen ×1.5 de daño.",
        trigger:     "on_attack",
        effect:      "boost_type_low_hp",
        boostedType: "PLANTA",
        value:       1.5,
        threshold:   0.33,
    },

    "Garra Fuerte": {
        name:        "Garra Fuerte",
        icon:        "💪",
        description: "Los movimientos que hacen contacto físico aumentan su daño ×1.3.",
        trigger:     "on_attack",
        effect:      "boost_contact_moves",
        value:       1.3,
    },

    "Adaptación": {
        name:        "Adaptación",
        icon:        "✨",
        description: "El bonus STAB aumenta de ×1.5 a ×2 (mismo tipo que el movimiento).",
        trigger:     "on_attack",
        effect:      "boost_same_type",
        value:       2.0,
    },

    "Temeridad": {
        name:        "Temeridad",
        icon:        "⚡",
        description: "Sus movimientos siempre golpean crítico (daño ×1.5 extra fijo).",
        trigger:     "on_attack",
        effect:      "crit_boost",
        value:       1.5,
    },

    // ════════════════════════════════════════════════════════════════════════
    // 🛡️ HABILIDADES DEFENSIVAS
    // ════════════════════════════════════════════════════════════════════════

    "Piel Dura": {
        name:        "Piel Dura",
        icon:        "🪨",
        description: "Reduce el daño físico recibido en un 30%.",
        trigger:     "on_hit",
        effect:      "reduce_physical_dmg",
        value:       0.7,
    },

    "Escudo Mágico": {
        name:        "Escudo Mágico",
        icon:        "🛡️",
        description: "Reduce el daño especial recibido en un 30%.",
        trigger:     "on_hit",
        effect:      "reduce_special_dmg",
        value:       0.7,
    },

    "Recuperación": {
        name:        "Recuperación",
        icon:        "💚",
        description: "Recupera el 10% del HP al final de cada turno.",
        trigger:     "end_of_turn",
        effect:      "heal_end_turn",
        value:       0.10,
    },

    "Absorción": {
        name:        "Absorción",
        icon:        "🌀",
        description: "Al recibir un golpe súper efectivo, recupera el 25% del HP.",
        trigger:     "on_hit",
        effect:      "heal_on_super_effective",
        value:       0.25,
    },

    // ════════════════════════════════════════════════════════════════════════
    // ⚡ HABILIDADES DE VELOCIDAD Y PRIORIDAD
    // ════════════════════════════════════════════════════════════════════════

    "Aceleración": {
        name:        "Aceleración",
        icon:        "💨",
        description: "Su SPE se multiplica por 1.5 en todo momento.",
        trigger:     "passive",
        effect:      "boost_spe_mult",
        value:       1.5,
    },

    "Ímpetu Veloz": {
        name:        "Ímpetu Veloz",
        icon:        "🏃",
        description: "Gana +1 de SPE al final de cada turno que sobrevive.",
        trigger:     "end_of_turn",
        effect:      "speed_boost",
        value:       1,
    },

    // ════════════════════════════════════════════════════════════════════════
    // 🧪 HABILIDADES DE ESTADO
    // ════════════════════════════════════════════════════════════════════════

    "Inmunidad": {
        name:        "Inmunidad",
        icon:        "☣️",
        description: "Inmune al veneno y al veneno grave.",
        trigger:     "passive",
        effect:      "immune_status",
        immune:      ["poison", "badPoison"],
    },

    "Calor Seco": {
        name:        "Calor Seco",
        icon:        "🔆",
        description: "Inmune a la quemadura. Además el fuego no lo afecta por estados.",
        trigger:     "passive",
        effect:      "immune_status",
        immune:      ["burn"],
    },

    "Propio Fuego": {
        name:        "Propio Fuego",
        icon:        "🕯️",
        description: "Si está quemado, su ATK físico NO se reduce.",
        trigger:     "passive",
        effect:      "counter_burn",
        value:       1,
    },

    "Vigor": {
        name:        "Vigor",
        icon:        "💤",
        description: "Inmune al sueño.",
        trigger:     "passive",
        effect:      "immune_status",
        immune:      ["sleep"],
    },

    "Estático": {
        name:        "Estático",
        icon:        "⚡",
        description: "Cuando recibe un golpe físico, 30% de paralizar al atacante.",
        trigger:     "on_hit",
        effect:      "retaliate_status",
        status:      "paralysis",
        value:       30,
        physicalOnly: true,
    },

    "Efecto Llama": {
        name:        "Efecto Llama",
        icon:        "🔥",
        description: "Cuando recibe un golpe físico, 30% de quemar al atacante.",
        trigger:     "on_hit",
        effect:      "retaliate_status",
        status:      "burn",
        value:       30,
        physicalOnly: true,
    },

    // ════════════════════════════════════════════════════════════════════════
    // 🌟 HABILIDADES ESPECIALES / ÚNICAS
    // ════════════════════════════════════════════════════════════════════════

    "Presión": {
        name:        "Presión",
        icon:        "🌑",
        description: "Al entrar en combate, intimida al rival reduciendo su ATK un 20%.",
        trigger:     "on_switch_in",
        effect:      "intimidate_atk",
        value:       0.8,
    },

    "Levitación": {
        name:        "Levitación",
        icon:        "🎈",
        description: "Inmune a todos los movimientos de tipo TIERRA.",
        trigger:     "passive",
        effect:      "immune_type",
        immune:      "TIERRA",
    },

    "Escudo Destello": {
        name:        "Escudo Destello",
        icon:        "🌟",
        description: "Los golpes críticos que recibe hacen daño normal en vez de ×1.5.",
        trigger:     "on_hit",
        effect:      "negate_crit",
        value:       1,
    },

    "Fuerza Bruta": {
        name:        "Fuerza Bruta",
        icon:        "🦾",
        description: "Su ATK se multiplica ×1.3 pero sus movimientos no aplican efectos secundarios.",
        trigger:     "on_attack",
        effect:      "brute_force",
        value:       1.3,
    },

    "Cuerpo Maldito": {
        name:        "Cuerpo Maldito",
        icon:        "👻",
        description: "30% de anular durante 4 turnos el movimiento que cause daño directo al poseedor.",
        trigger:     "on_hit",
        effect:      "cuerpo_maldito",
        value:       30,
    },

    "Absorbe Almas": {
        name:        "Absorbe Almas",
        icon:        "💀",
        description: "Inmune a tipo Fantasma. Al recibir un ataque Fantasma, sube su ATK y SPA un nivel.",
        trigger:     "passive",
        effect:      "absorb_stat_boost",
        immune:      "FANTASMA",
    },

    "Absorbe Fuego": {
        name:        "Absorbe Fuego",
        icon:        "🔥",
        description: "Inmune a tipo Fuego. Al recibir un ataque Fuego, sube su ATK y SPA un nivel.",
        trigger:     "passive",
        effect:      "absorb_stat_boost",
        immune:      "FUEGO",
    },

    "Nado Rápido": {
        name:        "Nado Rápido",
        icon:        "🌊",
        description: "Su VELOCIDAD se duplica bajo la lluvia.",
        trigger:     "passive",
        effect:      "boost_spe_weather",
        weather:     "rain",
        value:       2.0,
    },

    "Clorofila": {
        name:        "Clorofila",
        icon:        "🌿",
        description: "Su VELOCIDAD se duplica bajo el sol.",
        trigger:     "passive",
        effect:      "boost_spe_weather",
        weather:     "sun",
        value:       2.0,
    },

    "Ímpetu Arena": {
        name:        "Ímpetu Arena",
        icon:        "🏜️",
        description: "Su VELOCIDAD se duplica en tormenta de arena.",
        trigger:     "passive",
        effect:      "boost_spe_weather",
        weather:     "sand",
        value:       2.0,
    },

    "Ímpetu Nieve": {
        name:        "Ímpetu Nieve",
        icon:        "❄️",
        description: "Su VELOCIDAD se duplica bajo el granizo o nieve.",
        trigger:     "passive",
        effect:      "boost_spe_weather",
        weather:     "hail",
        value:       2.0,
    },

    "Poder Arena": {
        name:        "Poder Arena",
        icon:        "⚙️",
        description: "Potencia movimientos de Roca, Tierra y Acero ×1.3 en arena.",
        trigger:     "on_attack",
        effect:      "sand_force",
        value:       1.3,
    },

    // ════════════════════════════════════════════════════════════════════════
    // 🌐 HABILIDADES DE CAMPO (TERRAINS)
    // ════════════════════════════════════════════════════════════════════════

    "Electrogénesis": {
        name:        "Electrogénesis",
        icon:        "⚡",
        description: "Al entrar, crea un campo eléctrico que potencia ataques ELÉCTRICO ×1.3.",
        trigger:     "on_switch_in",
        effect:      "set_terrain_electric",
        value:       5, // Duración de 5 turnos
    },

    

    // ← AÑADE UNA HABILIDAD NUEVA AQUÍ
    // Recuerda después ir a js/battle-engine.js → applyAbility()
    // y añadir el case para tu nuevo "effect"
    //
    // Ejemplo:
    // "MiHabilidad": {
    //     name:        "Mi Habilidad",
    //     icon:        "🎯",
    //     description: "Descripción corta de qué hace.",
    //     trigger:     "on_attack",
    //     effect:      "mi_efecto_nuevo",
    //     value:       1.2,
    // },

}; // fin AbilitiesDB
