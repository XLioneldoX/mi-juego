// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  data/moves.js  —  MOVIMIENTOS                                           ║
// ║                                                                          ║
// ║  CÓMO CONFIGURAR:                                                        ║
// ║   • MovesDB  → tabla principal. Cada movimiento es una entrada           ║
// ║   • Propiedades de cada movimiento:                                      ║
// ║       name        → nombre (debe coincidir con la clave)                 ║
// ║       type        → tipo (debe existir en data/types.js)                 ║
// ║       category    → "physical" | "special" | "status"                   ║
// ║       power       → poder base (0 si es movimiento de estado)            ║
// ║       accuracy    → precisión en % (null = no puede fallar)              ║
// ║       priority    → prioridad de turno (0 normal, 1+ ataca antes)        ║
// ║       effect      → efecto especial (ver lista de efectos abajo)         ║
// ║       effectChance→ probabilidad del efecto secundario (0-100)           ║
// ║       description → texto que aparece en los botones de combate          ║
// ║                                                                          ║
// ║  EFECTOS DISPONIBLES (effect):                                           ║
// ║   "heal_50"        → cura 50% HP del usuario                             ║
// ║   "heal_100"       → cura 100% HP (duerme 2 turnos si es Descanso)       ║
// ║   "recoil_33"      → el usuario recibe 33% del daño hecho de retroceso   ║
// ║   "boost_atk_spe"  → sube ATK y VEL del usuario 1 nivel                 ║
// ║   "boost_spa_2"    → sube SPA del usuario 2 niveles                      ║
// ║   "protect"        → protege al usuario este turno                       ║
// ║   "apply_paralysis"→ paraliza al objetivo (ver data/status.js)           ║
// ║   "apply_burn"     → quema al objetivo                                   ║
// ║   "apply_poison"   → envenena al objetivo                                ║
// ║   "apply_sleep"    → duerme al objetivo                                  ║
// ║   "apply_freeze"   → congela al objetivo                                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const MovesDB = {

    // ════════════════════════════════════════════════════════════════════════
    // 🔥 TIPO FUEGO
    // ════════════════════════════════════════════════════════════════════════

    "Absorber": {
        name: "Absorber",
        type: "PLANTA",
        category: "special",
        power: 20,
        accuracy: 100,
        priority: 0,
        effect: "drain_50",
        effectChance: 100,
        description: "Absorbe energía del objetivo. Recupera HP del daño causado.",
    },
    "Acrobacias": {
        name: "Acrobacias",
        type: "VOLADOR",
        category: "physical",
        power: 55,
        accuracy: 100,
        priority: 0,
        effect: "double_power_no_item",
        effectChance: 100,
        description: "Golpeo acrobático. Duplica poder si el usuario no tiene item.",
    },
    "Acupresión": {
        name: "Acupresión",
        type: "NORMAL",
        category: "status",
        power: 0,
        accuracy: true,
        priority: 0,
        effect: "boost_random_stat_2",
        effectChance: 100,
        description: "Presiona puntos vitales. Sube 2 niveles un stat aleatorio.",
    },
    "Lanzallamas": {
        name: "Lanzallamas",
        type: "FUEGO",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "apply_burn",
        effectChance: 10,             // 10% de quemar
        description: "Lanza llamas intensas. Puede quemar al objetivo.",
    },
    "Llamarada": {
        name: "Llamarada",
        type: "FUEGO",
        category: "special",
        power: 110,
        accuracy: 85,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Golpe de fuego muy potente pero con poca precisión.",
    },
    "Onda Ígnea": {
        name: "Onda Ígnea",
        type: "FUEGO",
        category: "special",
        power: 95,
        accuracy: 100,
        priority: 0,
        effect: "apply_burn",
        effectChance: 30,             // 30% de quemar
        description: "Onda de calor abrasador. Alta probabilidad de quemar.",
    },
    "Colmillo Ígneo": {
        name: "Colmillo Ígneo",
        type: "FUEGO",
        category: "physical",
        power: 65,
        accuracy: 95,
        priority: 0,
        effect: "apply_burn",
        effectChance: 10,
        description: "Mordisco llameante. Puede quemar o hacer retroceder.",
    },
    // Añadir flinch a Colmillo Ígneo es complejo porque tiene 2 efectos, 
    // pero para este motor simplificado solo pondremos uno o lo dejaremos como está.
    // Vamos a añadir flinch_30 a otros movimientos directos.
    "Nitrocarga": {
        name: "Nitrocarga",
        type: "FUEGO",
        category: "physical",
        power: 50,
        accuracy: 100,
        priority: 0,
        effect: "boost_spe",    // Sube la velocidad del usuario
        effectChance: 100,
        description: "Carga ardiente que aumenta la velocidad del usuario.",
    },
    "Envite Ígneo": {
        name: "Envite Ígneo",
        type: "FUEGO",
        category: "physical",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: "recoil_33",
        effectChance: 10,             // 10% de quemar
        description: "Carga de fuego masiva. El usuario recibe 1/3 de retroceso.",
    },
    "Día Soleado": {
        name: "Día Soleado",
        type: "FUEGO",
        category: "status",
        power: 0,
        accuracy: null,
        priority: 0,
        effect: "apply_weather_sun",
        effectChance: 100,
        description: "El sol brilla con fuerza durante 5 turnos. Potencia los movimientos de tipo Fuego.",
    },

    // ════════════════════════════════════════════════════════════════════════
    // 💧 TIPO AGUA
    // ════════════════════════════════════════════════════════════════════════

    "Hidrobomba": {
        name: "Hidrobomba",
        type: "AGUA",
        category: "special",
        power: 110,
        accuracy: 80,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Cañonazo de agua muy poderoso. Puede fallar.",
    },
    "Surf": {
        name: "Surf",
        type: "AGUA",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Ataque de agua que nunca falla.",
    },
    "Cascada": {
        name: "Cascada",
        type: "AGUA",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "flinch_30",
        effectChance: 20,
        description: "Ataque físico de agua. Puede hacer retroceder.",
    },
    "Acuajet": {
        name: "Acuajet",
        type: "AGUA",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 1,
        effect: null,
        effectChance: 0,
        description: "Ataque veloz con prioridad. Siempre golpea primero.",
    },
    "Danza Lluvia": {
        name: "Danza Lluvia",
        type: "AGUA",
        category: "status",
        power: 0,
        accuracy: null,
        priority: 0,
        effect: "apply_weather_rain",
        effectChance: 100,
        description: "Genera una fuerte lluvia durante 5 turnos. Potencia los movimientos de tipo Agua.",
    },

    // ════════════════════════════════════════════════════════════════════════
    // 🌿 TIPO PLANTA
    // ════════════════════════════════════════════════════════════════════════

    "Rayo Solar": {
        name: "Rayo Solar",
        type: "PLANTA",
        category: "special",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: "charge_turn",  // Carga 1 turno antes de atacar
        effectChance: 100,
        description: "Absorbe luz el primer turno y la libera el segundo. Muy poderoso.",
    },
    "Hoja Afilada": {
        name: "Hoja Afilada",
        type: "PLANTA",
        category: "physical",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Hojas afiladas que siempre golpean.",
    },
    "Gigadrenado": {
        name: "Gigadrenado",
        type: "PLANTA",
        category: "special",
        power: 75,
        accuracy: 100,
        priority: 0,
        effect: "drain_50",     // Recupera 50% del daño hecho
        effectChance: 100,
        description: "Drena la energía del objetivo. Recupera 50% del daño.",
    },
    "Drenadoras": {
        name: "Drenadoras",
        type: "PLANTA",
        category: "status",
        power: 0,
        accuracy: 90,
        priority: 0,
        effect: "apply_leech_seed",
        effectChance: 100,
        description: "Planta una semilla en el objetivo. Al final de cada turno drena 1/8 de su HP y lo transfiere al Pokémon activo rival. Se cancela si el objetivo es cambiado o se debilita.",
    },
    "Síntesis": {
        name: "Síntesis",
        type: "PLANTA",
        category: "status",
        power: 0,
        accuracy: null,
        priority: 0,
        effect: "heal_50",
        effectChance: 100,
        description: "Se recupera con la luz solar. Restaura 50% del HP.",
    },
    "Bomba Gérmen": {
        name: "Bomba Gérmen",
        type: "PLANTA",
        category: "physical",
        power: 250,
        accuary: 100,
        priority: 0,
        effect: "faint_after_use",
        effectChange: 100,
        description: "Es como Superona pero Planta.",
    },
    "Mazazo": {
        name: "Mazazo",
        type: "PLANTA",
        category: "physical",
        power: 120,
        accuary: 100,
        priority: 0,
        effect: "recoil_33",
        effectChance: 0,
        description: "Mazo enorme que usa el usuario para golpear al oponente. El usuario recibe una ostia de 1/3 de retroceso.",
    },

    // ════════════════════════════════════════════════════════════════════════
    // ⚡ TIPO ELÉCTRICO
    // ════════════════════════════════════════════════════════════════════════

    "Rayo": {
        name: "Rayo",
        type: "ELÉCTRICO",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 10,
        description: "Descarga eléctrica. Puede paralizar.",
    },
    "Onda Voltio": {
        name: "Onda Voltio",
        type: "ELÉCTRICO",
        category: "special",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 10,
        description: "Onda de voltaje. Puede paralizar.",
    },
    "Puño Trueno": {
        name: "Puño Trueno",
        type: "ELÉCTRICO",
        category: "physical",
        power: 75,
        accuracy: 100,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 10,
        description: "Puñetazo eléctrico. Puede paralizar.",
    },
    "Bola Voltio": {
        name: "Bola Voltio",
        type: "ELÉCTRICO",
        category: "physical",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Bola de electricidad concentrada.",
    },
    "Onda Trueno": {
        name: "Onda Trueno",
        type: "ELÉCTRICO",
        category: "status",
        power: 0,
        accuracy: 90,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 100,            // Siempre paraliza si impacta
        description: "Onda eléctrica que paraliza al objetivo.",
    },

    // ════════════════════════════════════════════════════════════════════════
    // ❄️ TIPO HIELO
    // ════════════════════════════════════════════════════════════════════════

    "Rayo Hielo": {
        name: "Rayo Hielo",
        type: "HIELO",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "apply_freeze",
        effectChance: 10,
        description: "Rayo helado que puede congelar al objetivo.",
    },
    "Ventisca": {
        name: "Ventisca",
        type: "HIELO",
        category: "special",
        power: 110,
        accuracy: 70,
        priority: 0,
        effect: "apply_freeze",
        effectChance: 10,
        description: "Tormenta de nieve muy potente pero imprecisa. Puede congelar.",
    },
    "Viento Hielo": {
        name: "Viento Hielo",
        type: "HIELO",
        category: "special",
        power: 55,
        accuracy: 95,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Viento helado moderado con buena precisión.",
    },
    "Canto Helado": {
        name: "Canto Helado",
        type: "HIELO",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 1,
        effect: null,
        effectChance: 0,
        description: "Ataque de hielo con prioridad. Siempre golpea primero.",
    },
    "Giro Gélido": {
        name: "Giro Gélido",
        type: "HIELO",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "clear_terrain",
        effectChance: 100,
        description: "Ataque giratorio que elimina los campos activos.",
    },
    "Granizo": {
        name: "Granizo",
        type: "HIELO",
        category: "status",
        power: 0,
        accuracy: null,
        priority: 0,
        effect: "apply_weather_hail",
        effectChance: 100,
        description: "Tormenta de granizo de 5 turnos. Daña a todos los Pokémon salvo a los de tipo Hielo.",
    },

    // ════════════════════════════════════════════════════════════════════════
    // 👊 TIPO LUCHA
    // ════════════════════════════════════════════════════════════════════════

    "A Bocajarro": {
        name: "A Bocajarro",
        type: "LUCHA",
        category: "physical",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: "drop_self_def_spd_1",
        effectChance: 100,
        description: "Gran poder a cambio de reducir la Defensa y Def. Especial del usuario.",
    },
    "Tiro Vital": {
        name: "Tiro Vital",
        type: "LUCHA",
        category: "physical",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: "recoil_33",
        effectChance: 100,
        description: "Ataque apuntado a puntos vitales. El usuario recibe retroceso.",
    },
    "Esfera Aural": {
        name: "Esfera Aural",
        type: "LUCHA",
        category: "special",
        power: 80,
        accuracy: null,           // Nunca falla
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Esfera de energía que nunca falla.",
    },
    "Ultrapuño": {
        name: "Ultrapuño",
        type: "LUCHA",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 1,
        effect: null,
        effectChance: 0,
        description: "Puñetazo rapidísimo con prioridad. Siempre golpea primero.",
    },
    "Puño Drenaje": {
        name: "Puño Drenaje",
        type: "LUCHA",
        category: "physical",
        power: 75,
        accuracy: 100,
        priority: 0,
        effect: "drain_50",
        effectChance: 100,
        description: "Puñetazo que drena energía. Restaura 50% del daño hecho.",
    },
    "Espada Santa": {
        name: "Espada Santa",
        type: "LUCHA",
        category: "physical",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "ignore_def_boosts",
        effectChance: 100,
        description: "Corte místico que ignora los cambios en la Defensa del rival.",
    },

    // ════════════════════════════════════════════════════════════════════════
    // 🌍 TIPO TIERRA
    // ════════════════════════════════════════════════════════════════════════

    "Terremoto": {
        name: "Terremoto",
        type: "TIERRA",
        category: "physical",
        power: 100,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Sacudida de tierra de 100 de poder. Muy preciso.",
    },
     "Terratemblor": {
        name: "Terratemblor",
        type: "TIERRA",
        category: "physical",
        power: 100,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Golpe sísmico de alta potencia.",
    },
    "Asalto Cálido": {
        name: "Asalto Cálido",
        type: "TIERRA",
        category: "physical",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: "drop_self_def_spd_1",
        effectChance: 100,
        description: "Carga terrestre masiva. Baja la Def y Def. Esp del usuario.",
    },
    "Tierra Viva": {
        name: "Tierra Viva",
        type: "TIERRA",
        category: "special",
        power: 90,
        accuary: 100,
        priority: 0,
        effect: null,
        effectChance: 0,           
        description: "Se abre la tierra debajo del oponente.",
    },
    "Arenas Ardientes": {
        name: "Arenas Ardientes",
        type: "TIERRA",
        category: "special",
        power: 70,
        accuary: 100,
        priority: 0,
        effect: "apply_burn",
        effectChange: 30,          // 30% de quemar
        description: "Arenas de alta temperatura. Probabilidad de quemar al enemigo.",
    },

    // ════════════════════════════════════════════════════════════════════════
    // 🦅 TIPO VOLADOR
    // ════════════════════════════════════════════════════════════════════════

    "Vuelo": {
        name: "Vuelo",
        type: "VOLADOR",
        category: "physical",
        power: 90,
        accuracy: 95,
        priority: 0,
        effect: "charge_turn",
        effectChance: 100,
        description: "Vuela alto el primer turno, ataca el segundo.",
    },
    "Vendaval": {
        name: "Vendaval",
        type: "VOLADOR",
        category: "special",
        power: 110,
        accuracy: 70,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Vendaval devastador. Muy poderoso pero impreciso.",
    },
    "Pico Taladro": {
        name: "Pico Taladro",
        type: "VOLADOR",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Picotazo penetrante de gran precisión.",
    },
    "Pájaro Osado": {
        name: "Pájaro Osado",
        type: "VOLADOR",
        category: "physical",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: "recoil_33",
        effectChance: 100,
        description: "Ataque en picado masivo. El usuario recibe retroceso.",
    },

    // ════════════════════════════════════════════════════════════════════════
    //  TIPO PSÍQUICO
    // ════════════════════════════════════════════════════════════════════════

    "Psíquico": {
        name: "Psíquico",
        type: "PSÍQUICO",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Ataque psíquico de alta potencia.",
    },
    "Hipnosis": {
        name: "Hipnosis",
        type: "PSÍQUICO",
        category: "status",
        power: 0,
        accuracy: 60,             // ← Baja precisión, ajústala si quieres
        priority: 0,
        effect: "apply_sleep",
        effectChance: 100,
        description: "Duerme al objetivo si acierta. Precisión del 60%.",
    },
    "Trick Room": {
        name: "Trick Room",
        type: "PSÍQUICO",
        category: "status",
        power: 0,
        accuracy: null,
        priority: -7,
        effect: "apply_trick_room",
        effectChance: 100,
        description: "Invoca un espacio raro en el que alterna las velocidades de ambos Pokemons activos durante los proximos 5 turnos.",
    },

    // ════════════════════════════════════════════════════════════════════════
    // 👻 TIPO FANTASMA
    // ════════════════════════════════════════════════════════════════════════

    "Bola Sombra": {
        name: "Bola Sombra",
        type: "FANTASMA",
        category: "special",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Bola de energía oscura de buena potencia.",
    },
    "Sombra Vil": {
        name: "Sombra Vil",
        type: "FANTASMA",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 1,
        effect: null,
        effectChance: 0,
        description: "Extiende su sombra para atacar. Tiene prioridad.",
    },
    "Choque Sombrío": {
        name: "Choque Sombrío",
        type: "FANTASMA",
        category: "physical",
        power: 80,
        accuracy: 90,
        priority: 0,
        effect: "drop_target_def_1_chance_50",
        effectChance: 50,
        description: "Golpe de sombras. 50% de probabilidad de bajar la Defensa rival.",
    },
    "Rayo Confuso": {
        name: "Rayo Confuso",
        type: "FANTASMA",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "apply_confusion",
        effectChance: 100,
        description: "Un rayo siniestro que confunde al objetivo.",
    },
    "Mismo Destino": {
        name: "Mismo Destino",
        type: "FANTASMA",
        category: "status",
        power: 0,
        accuracy: null,
        priority: 0,
        effect: "destiny_bond",
        effectChance: 100,
        description: "Si el usuario se debilita por un ataque, el atacante también.",
    },
    "Tinieblas": {
        name: "Tinieblas",
        type: "FANTASMA",
        category: "special",
        power: 1, // Se sobrescribe en el cálculo de daño
        accuracy: 100,
        priority: 0,
        effect: "level_damage",
        effectChance: 100,
        description: "Ataque espectral que quita PS igual al nivel del usuario.",
    },
    "Infortunio": {
        name: "Infortunio",
        type: "FANTASMA",
        category: "special",
        power: 65,
        accuracy: 100,
        priority: 0,
        effect: "hex",
        effectChance: 100,
        description: "Duplica su poder si el rival sufre un problema de estado.",
    },

    // ════════════════════════════════════════════════════════════════════════
    // ☠️ TIPO VENENO
    // ════════════════════════════════════════════════════════════════════════

    "Bomba Lodo": {
        name: "Bomba Lodo",
        type: "VENENO",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "apply_poison",
        effectChance: 30,             // 30% de envenenar
        description: "Bomba de lodo tóxico. Alta probabilidad de envenenar.",
    },
    "Puya Nociva": {
        name: "Puya Nociva",
        type: "VENENO",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "apply_poison",
        effectChange: 30,             // 30% de envenenar
        description: "Puyas venenosas y corrosivas. Probabilidad de envenenar.",
    },
    "Lanzamugre": {
        name: "Lanzamugre",
        type: "VENENO",
        category: "physical",
        power: 120,
        accuary: 80,
        priority: 0,
        effect: "apply_poison",
        effectChance: 30,            // 30% de envenenar
        description: "Lanza un monton de basura al oponente. Probabilidad de envenenar.",
    },
    "Onda Tóxica": {
        name: "Onda Tóxica",
        type: "VENENO",
        category: "special",
        power: 90,
        accuary: 100,
        priority: 0,
        effect: "apply_poison",
        effectChance: 10,           // 10% de envenenar
        description: "Onda corrosiva muy toxica. Probabilidad de envenenar al oponente. Daña a todos los Pokemos del campo.",
    },
    "Púas Tóxicas": {
        name: "Púas Tóxicas",
        type: "VENENO",
        category: "status",
        power: 0,
        accuracy: null,
        priority: 0,
        effect: "apply_toxic_spikes",
        effectChance: 100,
        description: "Lanza púas tóxicas al campo rival para envenenar a quienes entren.",
    },

    // ════════════════════════════════════════════════════════════════════════
    // 🪨 TIPO ROCA
    // ════════════════════════════════════════════════════════════════════════

    "Roca Afilada": {
        name: "Roca Afilada",
        type: "ROCA",
        category: "physical",
        power: 100,
        accuracy: 80,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Ataque de roca potente con algo de imprecisión.",
    },
    "Avalancha": {
        name: "Avalancha",
        type: "ROCA",
        category: "physical",
        power: 75,
        accuracy: 90,
        priority: 0,
        effect: "flinch_30",
        effectChance: 30,
        description: "Avalancha de rocas constante. Puede hacer retroceder.",
    },
    "Megacuerno": {
        name: "Megacuerno",
        type: "ROCA",
        category: "physical",
        power: 120,
        accuracy: 85,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Cornada devastadora de 120 de poder.",
    },
    "Tormenta Arena": {
        name: "Tormenta Arena",
        type: "ROCA",
        category: "status",
        power: 0,
        accuracy: null,
        priority: 0,
        effect: "apply_weather_sand",
        effectChance: 100,
        description: "Tormenta de arena de 5 turnos. Daña a los Pokémon que no son Roca, Tierra o Acero.",
    },

    // ════════════════════════════════════════════════════════════════════════
    // 🐛 TIPO BICHO
    // ════════════════════════════════════════════════════════════════════════

    "Red Viscosa": {
        name: "Red Viscosa",
        type: "BICHO",
        category: "status",
        power: 0,
        accuracy: null,
        priority: 0,
        effect: "apply_sticky_web",
        effectChance: 100,
        description: "Coloca una red que baja la Velocidad de los oponentes que entran al campo.",
    },

    // ════════════════════════════════════════════════════════════════════════
    // 🐉 TIPO DRAGÓN
    // ════════════════════════════════════════════════════════════════════════

    "Garra Dragón": {
        name: "Garra Dragón",
        type: "DRAGÓN",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Zarpazo con energía dracónica. Muy preciso.",
    },
    "Enfado": {
        name: "Enfado",
        type: "DRAGÓN",
        category: "physical",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: "recoil_33",
        effectChance: 100,
        description: "Ataque de 120 poder con furia. El usuario recibe 1/3 del daño.",
    },
    "Danza Dragón": {
        name: "Danza Dragón",
        type: "DRAGÓN",
        category: "status",
        power: 0,
        accuracy: null,
        priority: 0,
        effect: "boost_atk_spe",
        effectChance: 100,
        description: "Danza mística. Sube ATK y Velocidad del usuario 1 nivel.",
    },

     // ════════════════════════════════════════════════════════════════════════
    // TIPO ACERO
    // ════════════════════════════════════════════════════════════════════════
    
    "Cabeza de Hierro": {
        name: "Cabeza de Hierro",
        type: "ACERO",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Embestida con cabeza de acero. Muy preciso.",
    },
    "Puño Bala": {
        name: "Puño Bala",
        type: "ACERO",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 1,
        effect: null,
        effectChance: 0,
        description: "Puñetazo tan rápido como una bala. Tiene prioridad.",
    },
    "Trampa Rocas": {
    name: "Trampa Rocas",
    type: "ROCA",
    category: "status",
    power: 0,
    accuracy: null,
    priority: 0,
    effect: "apply_stealth_rock",
    effectChance: 100,
    description: "Coloca rocas en el campo rival que dañan a los Pokémon al entrar según su debilidad al tipo Roca.",
    },
    "Foco Resplandor": {
        name: "Foco Resplandor",
        type: "ACERO",
        category: "special",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Explosión de energía mental concentrada. 120 de poder.",
    },

    // ════════════════════════════════════════════════════════════════════════
    // 🌑 TIPO SINIESTRO
    // ════════════════════════════════════════════════════════════════════════

    "Triturar": {
        name: "Triturar",
        type: "SINIESTRO",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Mordida brutal con gran fuerza.",
    },
    "Golpe Bajo": {
        name: "Golpe Bajo",
        type: "SINIESTRO",
        category: "physical",
        power: 70,
        accuracy: 100,
        priority: 1,
        effect: "sucker_punch",
        effectChance: 100,
        description: "Ataca primero si el rival va a atacar. Falla si el rival no ataca.",
    },
    "Desarme": {
        name: "Desarme",
        type: "SINIESTRO",
        category: "physical",
        power: 65,
        accuracy: 100,
        priority: 0,
        effect: "knock_off",
        effectChance: 100,
        description: "Quita el objeto del rival y hace más daño si lo tiene.",
    },
    "Tajo Ceñido": {
        name: "Tajo Ceñido",
        type: "SINIESTRO",
        category: "physical",
        power: 65,
        accuracy: 90,
        priority: 0,
        effect: "apply_spikes",
        effectChance: 100,
        description: "Corte que esparce púas en el campo rival.",
    },
    "Lariat Oscuro": {
        name: "Lariat Oscuro",
        type: "SINIESTRO",
        category: "physical",
        power: 85,
        accuracy: 100,
        priority: 0,
        effect: "ignore_def_boosts",
        effectChance: 100,
        description: "Giro brutal que ignora las mejoras de defensa del rival.",
    },
    "Pulso Umbrío": {
        name: "Pulso Umbrío",
        type: "SINIESTRO",
        category: "special",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "flinch_20",
        effectChance: 20,
        description: "Onda de aura oscura. 20% de probabilidad de amedrentar.",
    },

    // ════════════════════════════════════════════════════════════════════════
    // ⬜ TIPO NORMAL
    // ════════════════════════════════════════════════════════════════════════

    "Ataque Rápido": {
        name: "Ataque Rápido",
        type: "NORMAL",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 1,              // ← Prioridad +1: siempre ataca antes
        effect: null,
        effectChance: 0,
        description: "Ataque veloz con prioridad. Siempre golpea primero.",
    },
    "Velocidad Extrema": {
        name: "Velocidad Extrema",
        type: "NORMAL",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 2,              // ← Prioridad +2: aún más rápido
        effect: null,
        effectChance: 0,
        description: "Ataque de velocidad extrema con prioridad +2.",
    },
    "Golpe Cuerpo": {
        name: "Golpe Cuerpo",
        type: "NORMAL",
        category: "physical",
        power: 85,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Golpe con todo el cuerpo. Preciso y sólido.",
    },
    "Superdiente": {
        name: "Superdiente",
        type: "NORMAL",
        category: "physical",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Mordisco poderoso con colmillos afilados.",
    },
    "Descanso": {
        name: "Descanso",
        type: "NORMAL",
        category: "status",
        power: 0,
        accuracy: null,
        priority: 0,
        effect: "heal_100_sleep", // Cura todo el HP pero duerme 2 turnos
        effectChance: 100,
        description: "Duerme 2 turnos pero recupera todo el HP.",
    },
    "Protección": {
        name: "Protección",
        type: "NORMAL",
        category: "status",
        power: 0,
        accuracy: null,
        priority: 4,              // ← Máxima prioridad: siempre va primero
        effect: "protect",
        effectChance: 100,
        description: "Protege de cualquier ataque este turno. Falla si se usa seguido.",
    },
    "Sorpresa": {
        name: "Sorpresa",
        type: "NORMAL",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 3,
        effect: "fake_out",
        effectChance: 100,
        description: "Ataca primero y hace retroceder. Solo funciona el primer turno.",
    },
    "Sustituto": {
        name: "Sustituto",
        type: "NORMAL",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "substitute",
        effectChance: 100,
        description: "Crea un señuelo con el 25% del HP para protegerse.",
    },

    // ══════════════════════════════════════════════════════════════════════
    // 🌟 TIPO HADA
    // ══════════════════════════════════════════════════════════════════════

    "Niebla Aromática": {
        name: "Niebla Aromática",
        type: "HADA",
        category: "status",
        power: 0,
        accuracy: true,
        priority: 0,
        effect: "boost_ally_spd_1",
        effectChance: 100,
        description: "Crea niebla aromática. Sube 1 nivel la Defensa Especial de un aliado.",
    },
    "Burbuja Encantada": {
        name: "Burbuja Encantada",
        type: "HADA",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 10,
        description: "Burbuja mágica. Puede paralizar.",
    },
    "Danza Lunar": {
        name: "Danza Lunar",
        type: "HADA",
        category: "status",
        power: 0,
        accuracy: true,
        priority: 0,
        effect: "boost_atk_spe",
        effectChance: 100,
        description: "Danza mística. Sube ATK y Velocidad del usuario 1 nivel.",
    },

    // ══════════════════════════════════════════════════════════════════════
    // 🌊 TIPO AGUA (Adicionales)
    // ══════════════════════════════════════════════════════════════════════

    "Lluvia Torrencial": {
        name: "Lluvia Torrencial",
        type: "AGUA",
        category: "status",
        power: 0,
        accuracy: true,
        priority: 0,
        effect: "apply_weather_rain",
        effectChance: 100,
        description: "Genera una fuerte lluvia durante 5 turnos. Potencia los movimientos de tipo Agua.",
    },
    "Pulso Agua": {
        name: "Pulso Agua",
        type: "AGUA",
        category: "special",
        power: 60,
        accuracy: 100,
        priority: 0,
        effect: "apply_confusion",
        effectChance: 20,
        description: "Onda acuática. Puede confundir.",
    },
    "Hidrocañón": {
        name: "Hidrocañón",
        type: "AGUA",
        category: "special",
        power: 110,
        accuracy: 80,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Cañón de agua muy poderoso.",
    },

    // ══════════════════════════════════════════════════════════════════════
    // 🌿 TIPO PLANTA (Adicionales)
    // ══════════════════════════════════════════════════════════════════════

    "Ácido": {
        name: "Ácido",
        type: "VENENO",
        category: "special",
        power: 40,
        accuracy: 100,
        priority: 0,
        effect: "lower_spd_1",
        effectChance: 10,
        description: "Lanza ácido corrosivo. Puede bajar la Defensa Especial del objetivo.",
    },
    "Armadura Ácida": {
        name: "Armadura Ácida",
        type: "VENENO",
        category: "status",
        power: 0,
        accuracy: true,
        priority: 0,
        effect: "boost_def_2",
        effectChance: 100,
        description: "Reduce la temperatura corporal. Sube 2 niveles la Defensa.",
    },
    "Rociador Ácido": {
        name: "Rociador Ácido",
        type: "VENENO",
        category: "special",
        power: 40,
        accuracy: 100,
        priority: 0,
        effect: "lower_spd_2",
        effectChance: 100,
        description: "Rocía ácido fuerte. Baja 2 niveles la Defensa Especial del objetivo.",
    },
    "Latigazo": {
        name: "Latigazo",
        type: "PLANTA",
        category: "physical",
        power: 45,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Ataque con látigo.",
    },
    "Bomba Ácida": {
        name: "Bomba Ácida",
        type: "VENENO",
        category: "special",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "lower_spd_2",
        effectChance: 100,
        description: "Explosión ácida. Baja 2 niveles la Defensa Especial del objetivo.",
    },

    // ══════════════════════════════════════════════════════════════════════
    // ⚡ TIPO ELÉCTRICO (Adicionales)
    // ══════════════════════════════════════════════════════════════════════

    "Acelerroca": {
        name: "Acelerroca",
        type: "ROCA",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 1,
        effect: null,
        effectChance: 0,
        description: "Lanza rocas a gran velocidad. Ataca primero.",
    },
    "Corte Aéreo": {
        name: "Corte Aéreo",
        type: "VOLADOR",
        category: "special",
        power: 75,
        accuracy: 95,
        priority: 0,
        effect: "flinch_30",
        effectChance: 30,
        description: "Corta con aire. Puede hacer retroceder al objetivo.",
    },
    "Rayo": {
        name: "Rayo",
        type: "ELÉCTRICO",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 10,
        description: "Descarga eléctrica. Puede paralizar.",
    },
    "Onda Voltio": {
        name: "Onda Voltio",
        type: "ELÉCTRICO",
        category: "special",
        power: 65,
        accuracy: 100,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 10,
        description: "Onda eléctrica débil. Puede paralizar.",
    },
    "Puño Trueno": {
        name: "Puño Trueno",
        type: "ELÉCTRICO",
        category: "physical",
        power: 75,
        accuracy: 100,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 10,
        description: "Puño con electricidad. Puede paralizar.",
    },
    "Impactrueno": {
        name: "Impactrueno",
        type: "ELÉCTRICO",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 10,
        description: "Impacto eléctrico. Puede paralizar.",
    },
    "Onda Trueno": {
        name: "Onda Trueno",
        type: "ELÉCTRICO",
        category: "special",
        power: 110,
        accuracy: 70,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 30,
        description: "Rayo poderoso. Baja precisión pero puede paralizar.",
    },

    // ══════════════════════════════════════════════════════════════════════
    // 🥊 TIPO LUCHA (Adicionales)
    // ══════════════════════════════════════════════════════════════════════

    "Embestida de Brazo": {
        name: "Embestida de Brazo",
        type: "LUCHA",
        category: "physical",
        power: 15,
        accuracy: 100,
        priority: 0,
        effect: "multihit_2_5",
        effectChance: 100,
        description: "Golpea rápidamente con los brazos. Golpea 2-5 veces.",
    },
    "Patada Salto": {
        name: "Patada Salto",
        type: "LUCHA",
        category: "physical",
        power: 85,
        accuracy: 95,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 30,
        description: "Patada saltarina. Puede paralizar.",
    },
    "Avalancha": {
        name: "Avalancha",
        type: "LUCHA",
        category: "physical",
        power: 60,
        accuracy: 100,
        priority: -4,
        effect: "double_power_damaged",
        effectChance: 100,
        description: "Poderoso si recibe daño primero. Ataca después.",
    },

    // ══════════════════════════════════════════════════════════════════════
    // 🐞 TIPO BICHO (Adicionales)
    // ══════════════════════════════════════════════════════════════════════

    "Mordisco Bicho": {
        name: "Mordisco Bicho",
        type: "BICHO",
        category: "physical",
        power: 60,
        accuracy: 100,
        priority: 0,
        effect: "steal_berry",
        effectChance: 100,
        description: "Muerde y puede robar la baya del objetivo.",
    },
    "Zumbido Bicho": {
        name: "Zumbido Bicho",
        type: "BICHO",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "lower_spd_1",
        effectChance: 10,
        description: "Emite un zumbido ensordecedor. Puede bajar la Defensa Especial.",
    },
    "Doble Ataque": {
        name: "Doble Ataque",
        type: "BICHO",
        category: "physical",
        power: 35,
        accuracy: 90,
        priority: 0,
        effect: "multihit_2",
        effectChance: 100,
        description: "Ataca dos veces seguidas.",
    },

    // ══════════════════════════════════════════════════════════════════════
    // 🐉 TIPO DRAGÓN (Adicionales)
    // ══════════════════════════════════════════════════════════════════════

    "Escamas Estridentes": {
        name: "Escamas Estridentes",
        type: "DRAGÓN",
        category: "special",
        power: 110,
        accuracy: 100,
        priority: 0,
        effect: "lower_self_def_1",
        effectChance: 100,
        description: "Chirría con fuerza. Baja la Defensa del usuario 1 nivel.",
    },
    "Garra Dragón": {
        name: "Garra Dragón",
        type: "DRAGÓN",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Zarpazo con energía dracónica. Muy preciso.",
    },
    "Enfado": {
        name: "Enfado",
        type: "DRAGÓN",
        category: "physical",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: "recoil_33",
        effectChance: 100,
        description: "Ataque de 120 poder con furia. El usuario recibe 1/3 del daño.",
    },

    // ══════════════════════════════════════════════════════════════════════
    // 🧠 TIPO PSÍQUICO (Adicionales)
    // ══════════════════════════════════════════════════════════════════════

    "Agilidad": {
        name: "Agilidad",
        type: "PSÍQUICO",
        category: "status",
        power: 0,
        accuracy: true,
        priority: 0,
        effect: "boost_spe_2",
        effectChance: 100,
        description: "Aumenta la velocidad drásticamente. Sube 2 niveles la Velocidad.",
    },
    "Amnesia": {
        name: "Amnesia",
        type: "PSÍQUICO",
        category: "status",
        power: 0,
        accuracy: true,
        priority: 0,
        effect: "boost_spd_2",
        effectChance: 100,
        description: "Olvida temporalmente. Sube 2 niveles la Defensa Especial.",
    },
    "Hipnosis": {
        name: "Hipnosis",
        type: "PSÍQUICO",
        category: "status",
        power: 0,
        accuracy: 60,
        priority: 0,
        effect: "apply_sleep",
        effectChance: 100,
        description: "Induce sueño profundo. Duerme al objetivo.",
    },

    // ══════════════════════════════════════════════════════════════════════
    // 🧊 TIPO HIELO (Adicionales)
    // ══════════════════════════════════════════════════════════════════════

    "Rayo Aurora": {
        name: "Rayo Aurora",
        type: "HIELO",
        category: "special",
        power: 65,
        accuracy: 100,
        priority: 0,
        effect: "lower_atk_1",
        effectChance: 10,
        description: "Dispara un rayo auroral. Puede bajar el Ataque del objetivo.",
    },
    "Viento Hielo": {
        name: "Viento Hielo",
        type: "HIELO",
        category: "special",
        power: 55,
        accuracy: 95,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Viento helado moderado con buena precisión.",
    },
    "Canto Helado": {
        name: "Canto Helado",
        type: "HIELO",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 1,
        effect: null,
        effectChance: 0,
        description: "Ataque de hielo con prioridad. Siempre golpea primero.",
    },

    // ══════════════════════════════════════════════════════════════════════
    // 🐍 TIPO VENENO (Adicionales)
    // ════════════════════════════════════════════════════════════════════════

    "Bomba Lodo": {
        name: "Bomba Lodo",
        type: "VENENO",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "apply_poison",
        effectChance: 30,
        description: "Bomba de lodo tóxico. Alta probabilidad de envenenar.",
    },
    "Puya Nociva": {
        name: "Puya Nociva",
        type: "VENENO",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "apply_poison",
        effectChance: 30,
        description: "Puyas venenosas y corrosivas. Probabilidad de envenenar.",
    },
    "Onda Tóxica": {
        name: "Onda Tóxica",
        type: "VENENO",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "apply_poison",
        effectChance: 10,
        description: "Onda corrosiva muy toxica. Probabilidad de envenenar al oponente.",
    },

    // ══════════════════════════════════════════════════════════════════════
    // 🌍 TIPO TIERRA (Adicionales)
    // ════════════════════════════════════════════════════════════════════════

    "Anclaje": {
        name: "Anclaje",
        type: "ACERO",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "trap_target",
        effectChance: 100,
        description: "Dispara un ancla. Previene el cambio y atrapa al objetivo.",
    },
    "Terremoto": {
        name: "Terremoto",
        type: "TIERRA",
        category: "physical",
        power: 100,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Sacudida de tierra de 100 de poder. Muy preciso.",
    },

    // ══════════════════════════════════════════════════════════════════════
    // 🪨 TIPO ACERO (Adicionales)
    // ════════════════════════════════════════════════════════════════════════

    "Puño Bala": {
        name: "Puño Bala",
        type: "ACERO",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 1,
        effect: null,
        effectChance: 0,
        description: "Puñetazo tan rápido como una bala. Tiene prioridad.",
    },
    "Cabeza de Hierro": {
        name: "Cabeza de Hierro",
        type: "ACERO",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Embestida con cabeza de acero. Muy preciso.",
    },

    // ══════════════════════════════════════════════════════════════════════
    // 🦅 TIPO VOLADOR (Adicionales)
    // ════════════════════════════════════════════════════════════════════════

    "Vuelo": {
        name: "Vuelo",
        type: "VOLADOR",
        category: "physical",
        power: 90,
        accuracy: 95,
        priority: 0,
        effect: "charge_turn",
        effectChance: 100,
        description: "Vuela alto el primer turno, ataca el segundo.",
    },
    "Pico Taladro": {
        name: "Pico Taladro",
        type: "VOLADOR",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Picotazo penetrante de gran precisión.",
    },

    // ══════════════════════════════════════════════════════════════════════
    // 👻 TIPO FANTASMA (Adicionales)
    // ════════════════════════════════════════════════════════════════════════

    "Bola Sombra": {
        name: "Bola Sombra",
        type: "FANTASMA",
        category: "special",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Bola de energía oscura de buena potencia.",
    },
    "Sombra Vil": {
        name: "Sombra Vil",
        type: "FANTASMA",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 1,
        effect: null,
        effectChance: 0,
        description: "Extiende su sombra para atacar. Tiene prioridad.",
    },
    "Rayo Confuso": {
        name: "Rayo Confuso",
        type: "FANTASMA",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "apply_confusion",
        effectChance: 100,
        description: "Un rayo siniestro que confunde al objetivo.",
    },

    // ══════════════════════════════════════════════════════════════════════
    // 🌑 TIPO NORMAL (Adicionales)
    // ══════════════════════════════════════════════════════════════════════

    "Ataque Rápido": {
        name: "Ataque Rápido",
        type: "NORMAL",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 1,
        effect: null,
        effectChance: 0,
        description: "Ataque veloz con prioridad. Siempre golpea primero.",
    },
    "Velocidad Extrema": {
        name: "Velocidad Extrema",
        type: "NORMAL",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 2,
        effect: null,
        effectChance: 0,
        description: "Ataque de velocidad extrema con prioridad +2.",
    },
    "Golpe Cuerpo": {
        name: "Golpe Cuerpo",
        type: "NORMAL",
        category: "physical",
        power: 85,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Golpe con todo el cuerpo. Preciso y sólido.",
    },
    "Superdiente": {
        name: "Superdiente",
        type: "NORMAL",
        category: "physical",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Mordisco poderoso con colmillos afilados.",
    },
    "Descanso": {
        name: "Descanso",
        type: "NORMAL",
        category: "status",
        power: 0,
        accuracy: null,
        priority: 0,
        effect: "heal_100_sleep",
        effectChance: 100,
        description: "Duerme 2 turnos pero recupera todo el HP.",
    },
    "Protección": {
        name: "Protección",
        type: "NORMAL",
        category: "status",
        power: 0,
        accuracy: null,
        priority: 4,
        effect: "protect",
        effectChance: 100,
        description: "Protege de cualquier ataque este turno. Falla si se usa seguido.",
    },
    "Sorpresa": {
        name: "Sorpresa",
        type: "NORMAL",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 3,
        effect: "fake_out",
        effectChance: 100,
        description: "Ataca primero y hace retroceder. Solo funciona el primer turno.",
    },
    "Anulación": {
        name: "Anulación",
        type: "NORMAL",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "disable_last_move",
        effectChance: 100,
        description: "Anula el último movimiento del objetivo temporalmente.",
    },
    "Recuperación": {
        name: "Recuperación",
        type: "NORMAL",
        category: "status",
        power: 0,
        accuracy: null,
        priority: 0,
        effect: "heal_50",
        effectChance: 100,
        description: "Recupera el 50% del HP máximo.",
    },
    "Giro Rápido": {
    name: "Giro Rápido",
    type: "NORMAL",
    category: "physical",
    power: 50,
    accuracy: 100,
    priority: 0,
    effect: "rapid_spin",
    effectChance: 100,
    description: "Giro veloz que hace daño y elimina las trampas del propio campo y las Drenadoras.",
},

    // ════════════════════════════════════════════════════════════════════════
    // 🆕 NUEVOS MOVIMIENTOS
    // ════════════════════════════════════════════════════════════════════════

    // ────────────────────────────────────────────────────────────────────────
    // 🔥 FUEGO
    // ────────────────────────────────────────────────────────────────────────

    "Grease Fire": {
        name: "Grease Fire",
        type: "FUEGO",
        category: "special",
        power: 70,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Fuego de Grasa. Es súper efectivo contra los Pokémon de tipo Agua.",
    },
    "Supernova": {
        name: "Supernova",
        type: "FUEGO",
        category: "special",
        power: 250,
        accuracy: 100,
        priority: 0,
        effect: "faint_after_use",
        effectChance: 100,
        description: "Que quieres que explique mas ?, es Supernova",
    },

    // ────────────────────────────────────────────────────────────────────────
    // ⚡ ELÉCTRICO
    // ────────────────────────────────────────────────────────────────────────

    "Shorcuit": {
        name: "Shorcuit",
        type: "ELÉCTRICO",
        category: "special",
        power: 130,
        accuracy: 90,
        priority: 0,
        effect: "drop_self_spa_2",
        effectChance: 100,
        description: "Cortocircuito. Daño masivo, pero reduce el Ataque Especial del usuario en 2 niveles.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🌍 TIERRA
    // ────────────────────────────────────────────────────────────────────────

    "Púas": {
        name: "Púas",
        type: "TIERRA",
        category: "status",
        power: 0,
        accuracy: null,
        priority: 0,
        effect: "apply_spikes",
        effectChance: 100,
        description: "Esparce púas en el campo rival. Los Pokémon que entren al campo recibirán daño (máximo 3 capas).",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🦅 VOLADOR
    // ────────────────────────────────────────────────────────────────────────

    "Galegust Rush": {
        name: "Galegust Rush",
        type: "VOLADOR",
        category: "physical",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: "drop_self_acc_2",
        effectChance: 100,
        description: "Embestida Vendaval. Reduce la Precisión del usuario en 2 niveles al impactar.",
    },
    "Cloudy MakeUp": {
        name: "Cloudy MakeUp",
        type: "VOLADOR",
        category: "status",
        power: 0,
        accuracy: 95,
        priority: 0,
        effect: "change_type_flying",
        effectChance: 100,
        description: "Cambia el tipo del objetivo a Volador.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // ☠️ VENENO
    // ────────────────────────────────────────────────────────────────────────

    "Rustedge": {
        name: "Rustedge",
        type: "VENENO",
        category: "physical",
        power: 75,
        accuracy: 100,
        priority: 0,
        effect: "apply_toxic_spikes",
        effectChance: 100,
        description: "Filo Oxidado. Coloca Púas Tóxicas en el campo rival si acierta.",
    },
    "Harmful Strike": {
        name: "Harmful Strike",
        type: "VENENO",
        category: "physical",
        power: 95,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        dualType: "SINIESTRO", // Nueva propiedad procesada en calculateDamage
        description: "Golpe Nocivo. Combina los tipos Veneno y Siniestro en el cálculo de efectividad.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🪨 ROCA
    // ────────────────────────────────────────────────────────────────────────

    "Loose Dirt": {
        name: "Loose Dirt",
        type: "ROCA",
        category: "special",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "drop_target_atk_1",
        effectChance: 30,
        description: "Tierra Suelta. Tiene un 30% de probabilidad de reducir el Ataque del objetivo.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🐉 DRAGÓN
    // ────────────────────────────────────────────────────────────────────────

    "Scalatue": {
        name: "Scalatue",
        type: "DRAGÓN",
        category: "status",
        power: 0,
        accuracy: null,
        priority: 0,
        effect: "heal_100_petrify",
        effectChance: 100,
        description: "El usuario se petrifica y restaura todos sus HP.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🤝 HADA
    // ────────────────────────────────────────────────────────────────────────

    "Rowdy Tussle": {
        name: "Rowdy Tussle",
        type: "HADA",
        category: "physical",
        power: 120,
        accuracy: 90,
        priority: 0,
        effect: "drop_self_atk_2",
        effectChance: 100,
        description: "Pelea Alborotada. Reduce el Ataque del usuario en 2 niveles tras golpear.",
    },
    "Carantoña": {
        name: "Carantoña",
        type: "HADA",
        category: "physical",
        power: 90,
        accuracy: 90,
        priority: 0,
        effect: "drop_target_atk_1",
        effectChance: 10,
        description: "Juego brusco que puede bajar el Ataque del rival.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 👊 LUCHA
    // ────────────────────────────────────────────────────────────────────────

    "Healing Spa": {
        name: "Healing Spa",
        type: "LUCHA",
        category: "physical",
        power: 60,
        accuracy: 100,
        priority: 0,
        effect: "cure_status_on_hit_and_double_dmg",
        effectChance: 100,
        description: "Su poder se duplica si algún Pokémon sufre un estado, y luego los cura.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // ⚪ NORMAL - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "Extreme Speed": {
        name: "Extreme Speed",
        type: "NORMAL",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 2,
        effect: null,
        effectChance: 0,
        description: "Velocidad Extrema. Ataca primero con mucha prioridad.",
    },

    "Body Slam": {
        name: "Body Slam",
        type: "NORMAL",
        category: "physical",
        power: 85,
        accuracy: 100,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 30,
        description: "Golpe Cuerpo. Puede paralizar al objetivo.",
    },

    "Hyper Voice": {
        name: "Hyper Voice",
        type: "NORMAL",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Voz Hiper. Potente grito que ignora protecciones.",
    },

    "Facade": {
        name: "Facade",
        type: "NORMAL",
        category: "physical",
        power: 70,
        accuracy: 100,
        priority: 0,
        effect: "facade",
        effectChance: 100,
        description: "Fachada. Duplica su poder si el usuario tiene estado.",
    },

    "Return": {
        name: "Return",
        type: "NORMAL",
        category: "physical",
        power: 102,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Retribución. Más fuerte cuanto mayor es la amistad.",
    },

    "Frustration": {
        name: "Frustration",
        type: "NORMAL",
        category: "physical",
        power: 102,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Frustración. Más fuerte cuanto menor es la amistad.",
    },

    "Double Edge": {
        name: "Double Edge",
        type: "NORMAL",
        category: "physical",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: "recoil_33",
        effectChance: 100,
        description: "Doble Filo. Causa gran daño pero retroceso al usuario.",
    },

    "Explosion": {
        name: "Explosion",
        type: "NORMAL",
        category: "physical",
        power: 250,
        accuracy: 100,
        priority: 0,
        effect: "user_faint",
        effectChance: 100,
        description: "Explosión. Daño masivo pero el usuario se debilita.",
    },

    "Self-Destruct": {
        name: "Self-Destruct",
        type: "NORMAL",
        category: "physical",
        power: 200,
        accuracy: 100,
        priority: 0,
        effect: "user_faint",
        effectChance: 100,
        description: "Autodestrucción. Gran daño pero el usuario se debilita.",
    },

    "Perish Song": {
        name: "Perish Song",
        type: "NORMAL",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "perish_song",
        effectChance: 100,
        description: "Canción Mortal. Todos caen en 3 turnos.",
    },

    "Baton Pass": {
        name: "Baton Pass",
        type: "NORMAL",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "baton_pass",
        effectChance: 100,
        description: "Relevo. Pasa las mejoras y efectos al siguiente Pokémon.",
    },

    "Work Up": {
        name: "Work Up",
        type: "NORMAL",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "boost_atk_spa_1",
        effectChance: 100,
        description: "Entrenamiento. Sube Ataque y Ataque Especial 1 nivel.",
    },

    "Belly Drum": {
        name: "Belly Drum",
        type: "NORMAL",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "belly_drum",
        effectChance: 100,
        description: "Batería. Máximo Ataque a cambio de 50% HP.",
    },

    "Curse": {
        name: "Curse",
        type: "FANTASMA",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "curse",
        effectChance: 100,
        description: "Maldición. Diferente efecto si es tipo Fantasma.",
    },

    "Transform": {
        name: "Transform",
        type: "NORMAL",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "transform",
        effectChance: 100,
        description: "Transformación. Copia al objetivo completamente.",
    },

    "Sketch": {
        name: "Sketch",
        type: "NORMAL",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "sketch",
        effectChance: 100,
        description: "Boceto. Copia permanentemente el último movimiento rival.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🔥 FUEGO - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "Flamethrower": {
        name: "Flamethrower",
        type: "FUEGO",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "apply_burn",
        effectChance: 10,
        description: "Lanzallamas. Puede quemar al objetivo.",
    },

    "Fire Blast": {
        name: "Fire Blast",
        type: "FUEGO",
        category: "special",
        power: 110,
        accuracy: 85,
        priority: 0,
        effect: "apply_burn",
        effectChance: 10,
        description: "Llamarada. Poderoso pero menos preciso. Puede quemar.",
    },

    "Overheat": {
        name: "Overheat",
        type: "FUEGO",
        category: "special",
        power: 130,
        accuracy: 90,
        priority: 0,
        effect: "lower_user_spa_2",
        effectChance: 100,
        description: "Sobrecalentamiento. Daño masivo pero baja Ataque Especial.",
    },

    "Flare Blitz": {
        name: "Flare Blitz",
        type: "FUEGO",
        category: "physical",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: "recoil_33_and_burn",
        effectChance: 10,
        description: "Avalancha Ígnea. Daño masivo con retroceso y puede quemar.",
    },

    "Fire Punch": {
        name: "Fire Punch",
        type: "FUEGO",
        category: "physical",
        power: 75,
        accuracy: 100,
        priority: 0,
        effect: "apply_burn",
        effectChance: 10,
        description: "Puño Fuego. Golpe ígneo que puede quemar.",
    },

    "Will-O-Wisp": {
        name: "Will-O-Wisp",
        type: "FUEGO",
        category: "status",
        power: 0,
        accuracy: 85,
        priority: 0,
        effect: "apply_burn",
        effectChance: 100,
        description: "Fuego Fatuo. Quema al objetivo con alta probabilidad.",
    },

    "Sunny Day": {
        name: "Sunny Day",
        type: "FUEGO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "apply_weather_sun",
        effectChance: 100,
        description: "Día Soleado. Intensifica el sol por 5 turnos.",
    },

    "Flame Charge": {
        name: "Flame Charge",
        type: "FUEGO",
        category: "physical",
        power: 50,
        accuracy: 100,
        priority: 0,
        effect: "boost_user_spe_1",
        effectChance: 100,
        description: "Carga Ígnea. Sube la Velocidad del usuario.",
    },

    "Burning Jealousy": {
        name: "Burning Jealousy",
        type: "FUEGO",
        category: "special",
        power: 70,
        accuracy: 100,
        priority: 0,
        effect: "burning_jealousy",
        effectChance: 100,
        description: "Celos Ardientes. Daño masivo si el rival tiene mejoras.",
    },

    "Mystical Fire": {
        name: "Mystical Fire",
        type: "FUEGO",
        category: "special",
        power: 65,
        accuracy: 100,
        priority: 0,
        effect: "lower_target_spa_1",
        effectChance: 100,
        description: "Fuego Místico. Siempre baja el Ataque Especial del rival.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 💧 AGUA - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "Hydro Pump": {
        name: "Hydro Pump",
        type: "AGUA",
        category: "special",
        power: 110,
        accuracy: 80,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Hidrobomba. Poderoso pero menos preciso.",
    },

    "Surf": {
        name: "Surf",
        type: "AGUA",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Surf. Ataque acuático confiable.",
    },

    "Waterfall": {
        name: "Waterfall",
        type: "AGUA",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "flinch_20",
        effectChance: 20,
        description: "Cascada. Puede hacer retroceder al objetivo.",
    },

    "Scald": {
        name: "Scald",
        type: "AGUA",
        category: "special",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "apply_burn",
        effectChance: 30,
        description: "Escaldar. Alta probabilidad de quemar.",
    },

    "Ice Beam": {
        name: "Ice Beam",
        type: "HIELO",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "apply_freeze",
        effectChance: 10,
        description: "Rayo Hielo. Puede congelar al objetivo.",
    },

    "Aqua Jet": {
        name: "Aqua Jet",
        type: "AGUA",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 1,
        effect: null,
        effectChance: 0,
        description: "Acua Jet. Ataque prioritario acuático.",
    },

    "Water Pulse": {
        name: "Water Pulse",
        type: "AGUA",
        category: "special",
        power: 60,
        accuracy: 100,
        priority: 0,
        effect: "apply_confusion",
        effectChance: 20,
        description: "Hidropulso. Puede confundir al objetivo.",
    },

    "Rain Dance": {
        name: "Rain Dance",
        type: "AGUA",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "apply_weather_rain",
        effectChance: 100,
        description: "Danza Lluvia. Comienza a llover por 5 turnos.",
    },

    "Muddy Water": {
        name: "Muddy Water",
        type: "AGUA",
        category: "special",
        power: 90,
        accuracy: 85,
        priority: 0,
        effect: "lower_target_accuracy_1",
        effectChance: 30,
        description: "Agua Lodosa. Puede bajar la precisión del rival.",
    },

    "Flip Turn": {
        name: "Flip Turn",
        type: "AGUA",
        category: "physical",
        power: 60,
        accuracy: 100,
        priority: 0,
        effect: "user_switch",
        effectChance: 100,
        description: "Volteo. Ataca y luego cambia de Pokémon.",
    },

    "Liquidation": {
        name: "Liquidation",
        type: "AGUA",
        category: "physical",
        power: 85,
        accuracy: 100,
        priority: 0,
        effect: "lower_target_def_1",
        effectChance: 20,
        description: "Liquación. Puede bajar la Defensa del rival.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // ⚡ ELÉCTRICO - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "Thunderbolt": {
        name: "Thunderbolt",
        type: "ELÉCTRICO",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 10,
        description: "Rayo. Puede paralizar al objetivo.",
    },

    "Thunder": {
        name: "Thunder",
        type: "ELÉCTRICO",
        category: "special",
        power: 110,
        accuracy: 70,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 30,
        description: "Trueno. Poderoso pero menos preciso. Alta probabilidad de paralizar.",
    },

    "Volt Switch": {
        name: "Volt Switch",
        type: "ELÉCTRICO",
        category: "special",
        power: 70,
        accuracy: 100,
        priority: 0,
        effect: "user_switch",
        effectChance: 100,
        description: "Cambio Voltio. Ataca y luego cambia de Pokémon.",
    },

    "Thunder Punch": {
        name: "Thunder Punch",
        type: "ELÉCTRICO",
        category: "physical",
        power: 75,
        accuracy: 100,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 10,
        description: "Puño Trueno. Golpe eléctrico que puede paralizar.",
    },

    "Thunder Wave": {
        name: "Thunder Wave",
        type: "ELÉCTRICO",
        category: "status",
        power: 0,
        accuracy: 90,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 100,
        description: "Onda Trueno. Paraliza al objetivo con alta probabilidad.",
    },

    "Wild Charge": {
        name: "Wild Charge",
        type: "ELÉCTRICO",
        category: "physical",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "recoil_33",
        effectChance: 100,
        description: "Carga Salvaje. Daño con retroceso al usuario.",
    },

    "Discharge": {
        name: "Discharge",
        type: "ELÉCTRICO",
        category: "special",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 30,
        description: "Descarga. Afecta a todos y puede paralizar.",
    },

    "Electric Terrain": {
        name: "Electric Terrain",
        type: "ELÉCTRICO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "apply_electric_terrain",
        effectChance: 100,
        description: "Campo Eléctrico. Potencia movimientos eléctricos por 5 turnos.",
    },

    " Rising Voltage": {
        name: "Rising Voltage",
        type: "ELÉCTRICO",
        category: "special",
        power: 70,
        accuracy: 100,
        priority: 0,
        effect: "rising_voltage",
        effectChance: 100,
        description: "Voltio Ascendente. Duplica poder en Campo Eléctrico.",
    },

    "Eerie Spell": {
        name: "Eerie Spell",
        type: "PSÍQUICO",
        category: "special",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "eerie_spell",
        effectChance: 100,
        description: "Hechizo Extraño. Reduce PP del movimiento rival.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🌿 PLANTA - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "Energy Ball": {
        name: "Energy Ball",
        type: "PLANTA",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "lower_target_spd_1",
        effectChance: 10,
        description: "Energibola. Puede bajar la Defensa Especial del rival.",
    },

    "Giga Drain": {
        name: "Giga Drain",
        type: "PLANTA",
        category: "special",
        power: 75,
        accuracy: 100,
        priority: 0,
        effect: "drain_50",
        effectChance: 100,
        description: "Gigadrenado. Drena HP del objetivo.",
    },

    "Leaf Storm": {
        name: "Leaf Storm",
        type: "PLANTA",
        category: "special",
        power: 130,
        accuracy: 90,
        priority: 0,
        effect: "lower_user_spa_2",
        effectChance: 100,
        description: "Hoja Tormenta. Daño masivo pero baja Ataque Especial.",
    },

    "Wood Hammer": {
        name: "Wood Hammer",
        type: "PLANTA",
        category: "physical",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: "recoil_33",
        effectChance: 100,
        description: "Martillo Leñoso. Daño masivo con retroceso.",
    },

    "Seed Bomb": {
        name: "Seed Bomb",
        type: "PLANTA",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Bomba Gérmen. Explosión de semillas.",
    },

    "Power Whip": {
        name: "Power Whip",
        type: "PLANTA",
        category: "physical",
        power: 120,
        accuracy: 85,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Látigo Poderoso. Poderoso pero menos preciso.",
    },

    "Spore": {
        name: "Spore",
        type: "BICHO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "apply_sleep",
        effectChance: 100,
        description: "Espora. Duerme al objetivo con total precisión.",
    },

    "Sleep Powder": {
        name: "Sleep Powder",
        type: "PLANTA",
        category: "status",
        power: 0,
        accuracy: 75,
        priority: 0,
        effect: "apply_sleep",
        effectChance: 100,
        description: "Polvo Sueño. Duerme al objetivo.",
    },

    "Stun Spore": {
        name: "Stun Spore",
        type: "BICHO",
        category: "status",
        power: 0,
        accuracy: 75,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 100,
        description: "Espora Paralizante. Paraliza al objetivo.",
    },

    "Leech Seed": {
        name: "Leech Seed",
        type: "PLANTA",
        category: "status",
        power: 0,
        accuracy: 90,
        priority: 0,
        effect: "apply_leech_seed",
        effectChance: 100,
        description: "Drenadoras. Drena HP cada turno al objetivo.",
    },

    "Synthesis": {
        name: "Synthesis",
        type: "PLANTA",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "heal_weather_dependent",
        effectChance: 100,
        description: "Síntesis. Recupera HP, más con sol.",
    },

    "Grassy Terrain": {
        name: "Grassy Terrain",
        type: "PLANTA",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "apply_grassy_terrain",
        effectChance: 100,
        description: "Campo Herboso. Potencia movimientos planta por 5 turnos.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // ❄️ HIELO - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "Blizzard": {
        name: "Blizzard",
        type: "HIELO",
        category: "special",
        power: 110,
        accuracy: 70,
        priority: 0,
        effect: "apply_freeze",
        effectChance: 10,
        description: "Ventisca. Poderoso pero menos preciso. Puede congelar.",
    },

    "Ice Shard": {
        name: "Ice Shard",
        type: "HIELO",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 1,
        effect: null,
        effectChance: 0,
        description: "Fragmento Hielo. Ataque prioritario de hielo.",
    },

    "Ice Punch": {
        name: "Ice Punch",
        type: "HIELO",
        category: "physical",
        power: 75,
        accuracy: 100,
        priority: 0,
        effect: "apply_freeze",
        effectChance: 10,
        description: "Puño Hielo. Golpe helado que puede congelar.",
    },

    "Icicle Crash": {
        name: "Icicle Crash",
        type: "HIELO",
        category: "physical",
        power: 85,
        accuracy: 90,
        priority: 0,
        effect: "flinch_30",
        effectChance: 30,
        description: "Estrellahielo. Puede hacer retroceder al objetivo.",
    },

    "Freeze-Dry": {
        name: "Freeze-Dry",
        type: "HIELO",
        category: "special",
        power: 70,
        accuracy: 100,
        priority: 0,
        effect: "apply_freeze",
        effectChance: 10,
        description: "Congelación Seca. Súper efectivo contra Agua.",
    },

    "Hail": {
        name: "Hail",
        type: "HIELO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "apply_weather_hail",
        effectChance: 100,
        description: "Granizo. Causa daño por 5 turnos.",
    },

    "Aurora Veil": {
        name: "Aurora Veil",
        type: "HIELO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "aurora_veil",
        effectChance: 100,
        description: "Velo Aurora. Reduce daño recibido en granizo.",
    },

    "Frost Breath": {
        name: "Frost Breath",
        type: "HIELO",
        category: "special",
        power: 60,
        accuracy: 90,
        priority: 0,
        effect: "always_crit",
        effectChance: 100,
        description: "Aliento Gélido. Siempre golpea críticamente.",
    },

    "Glaciate": {
        name: "Glaciate",
        type: "HIELO",
        category: "special",
        power: 65,
        accuracy: 95,
        priority: 0,
        effect: "lower_target_spe_1",
        effectChance: 100,
        description: "Glaciación. Siempre baja la Velocidad del rival.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 👊 LUCHA - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "Close Combat": {
        name: "Close Combat",
        type: "LUCHA",
        category: "physical",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: "lower_user_def_spd_1",
        effectChance: 100,
        description: "Combate Cercano. Daño masivo pero baja defensas.",
    },

    "Aura Sphere": {
        name: "Aura Sphere",
        type: "LUCHA",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Esfera Aural. Nunca falla.",
    },

    "Focus Blast": {
        name: "Focus Blast",
        type: "LUCHA",
        category: "special",
        power: 120,
        accuracy: 70,
        priority: 0,
        effect: "lower_target_spd_1",
        effectChance: 10,
        description: "Puño Foco. Poderoso pero poco preciso.",
    },

    "Mach Punch": {
        name: "Mach Punch",
        type: "LUCHA",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 1,
        effect: null,
        effectChance: 0,
        description: "Puño Mach. Ataque prioritario.",
    },

    "Bullet Punch": {
        name: "Bullet Punch",
        type: "ACERO",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 1,
        effect: null,
        effectChance: 0,
        description: "Puño Bala. Ataque prioritario de acero.",
    },

    "Drain Punch": {
        name: "Drain Punch",
        type: "LUCHA",
        category: "physical",
        power: 75,
        accuracy: 100,
        priority: 0,
        effect: "drain_50",
        effectChance: 100,
        description: "Puño Drenaje. Drena HP del objetivo.",
    },

    "Superpower": {
        name: "Superpower",
        type: "LUCHA",
        category: "physical",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: "lower_user_atk_def_1",
        effectChance: 100,
        description: "Superpoder. Daño masivo pero baja Ataque y Defensa.",
    },

    "Bulk Up": {
        name: "Bulk Up",
        type: "LUCHA",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "boost_atk_def_1",
        effectChance: 100,
        description: "Aumento. Sube Ataque y Defensa 1 nivel.",
    },

    "Swords Dance": {
        name: "Swords Dance",
        type: "NORMAL",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "boost_atk_2",
        effectChance: 100,
        description: "Danza Espada. Sube Ataque 2 niveles.",
    },

    "Dynamic Punch": {
        name: "Dynamic Punch",
        type: "LUCHA",
        category: "physical",
        power: 100,
        accuracy: 50,
        priority: 0,
        effect: "apply_confusion",
        effectChance: 100,
        description: "Puño Dinámico. Siempre confunde si golpea.",
    },

    "Vacuum Wave": {
        name: "Vacuum Wave",
        type: "LUCHA",
        category: "special",
        power: 40,
        accuracy: 100,
        priority: 1,
        effect: null,
        effectChance: 0,
        description: "Onda Vacío. Ataque especial prioritario.",
    },

    "Storm Throw": {
        name: "Storm Throw",
        type: "LUCHA",
        category: "physical",
        power: 60,
        accuracy: 100,
        priority: 0,
        effect: "always_crit",
        effectChance: 100,
        description: "Lanzamiento Tormenta. Siempre golpea críticamente.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // ☠️ VENENO - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "Sludge Bomb": {
        name: "Sludge Bomb",
        type: "VENENO",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "apply_poison",
        effectChance: 30,
        description: "Bomba Lodo. Puede envenenar al objetivo.",
    },

    "Sludge Wave": {
        name: "Sludge Wave",
        type: "VENENO",
        category: "special",
        power: 95,
        accuracy: 100,
        priority: 0,
        effect: "apply_poison",
        effectChance: 10,
        description: "Onda Tóxica. Afecta a todos y puede envenenar.",
    },

    "Gunk Shot": {
        name: "Gunk Shot",
        type: "VENENO",
        category: "physical",
        power: 120,
        accuracy: 80,
        priority: 0,
        effect: "apply_poison",
        effectChance: 30,
        description: "Lanzamugre. Poderoso pero poco preciso.",
    },

    "Poison Jab": {
        name: "Poison Jab",
        type: "VENENO",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "apply_poison",
        effectChance: 30,
        description: "Puya Nociva. Golpe tóxico que puede envenenar.",
    },

    "Toxic": {
        name: "Toxic",
        type: "VENENO",
        category: "status",
        power: 0,
        accuracy: 90,
        priority: 0,
        effect: "apply_toxic",
        effectChance: 100,
        description: "Tóxico. Envenenamiento gravemente progresivo.",
    },

    "Venoshock": {
        name: "Venoshock",
        type: "VENENO",
        category: "special",
        power: 65,
        accuracy: 100,
        priority: 0,
        effect: "venoshock",
        effectChance: 100,
        description: "Impacto Veno. Duplica poder si el rival está envenenado.",
    },

    "Toxic Spikes": {
        name: "Toxic Spikes",
        type: "VENENO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "apply_toxic_spikes",
        effectChance: 100,
        description: "Púas Tóxicas. Envenena a los Pokémon que entran.",
    },

    "Clear Smog": {
        name: "Clear Smog",
        type: "VENENO",
        category: "special",
        power: 50,
        accuracy: 100,
        priority: 0,
        effect: "clear_boosts",
        effectChance: 100,
        description: "Humo Limpio. Elimina todas las mejoras del rival.",
    },

    "Acid Spray": {
        name: "Acid Spray",
        type: "VENENO",
        category: "special",
        power: 40,
        accuracy: 100,
        priority: 0,
        effect: "lower_target_spd_2",
        effectChance: 100,
        description: "Rociado Ácido. Siempre baja Defensa Especial 2 niveles.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🌍 TIERRA - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "Earthquake": {
        name: "Earthquake",
        type: "TIERRA",
        category: "physical",
        power: 100,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Terremoto. Potente ataque terrestre.",
    },

    "Earth Power": {
        name: "Earth Power",
        type: "TIERRA",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "lower_target_spd_1",
        effectChance: 10,
        description: "Poder Tierra. Puede bajar Defensa Especial.",
    },

    "Drill Run": {
        name: "Drill Run",
        type: "TIERRA",
        category: "physical",
        power: 80,
        accuracy: 95,
        priority: 0,
        effect: "always_crit",
        effectChance: 100,
        description: "Taladro. Siempre golpea críticamente.",
    },

    "Bulldoze": {
        name: "Bulldoze",
        type: "TIERRA",
        category: "physical",
        power: 60,
        accuracy: 100,
        priority: 0,
        effect: "lower_target_spe_1",
        effectChance: 100,
        description: "Topadora. Siempre baja la Velocidad del rival.",
    },

    "Stealth Rock": {
        name: "Stealth Rock",
        type: "ROCA",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "apply_stealth_rock",
        effectChance: 100,
        description: "Rocas Sigilosas. Daña a los Pokémon que entran.",
    },

    "Spikes": {
        name: "Spikes",
        type: "TIERRA",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "apply_spikes",
        effectChance: 100,
        description: "Púas. Daña a los Pokémon que entran (no voladores).",
    },

    "Rapid Spin": {
        name: "Rapid Spin",
        type: "NORMAL",
        category: "physical",
        power: 50,
        accuracy: 100,
        priority: 0,
        effect: "rapid_spin",
        effectChance: 100,
        description: "Giro Rápido. Elimina trampas del propio campo.",
    },

    "Sandstorm": {
        name: "Sandstorm",
        type: "ROCA",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "apply_weather_sand",
        effectChance: 100,
        description: "Tormenta Arena. Causa daño por 5 turnos.",
    },

    "Mud Shot": {
        name: "Mud Shot",
        type: "TIERRA",
        category: "special",
        power: 55,
        accuracy: 95,
        priority: 0,
        effect: "lower_target_spe_1",
        effectChance: 100,
        description: "Disparo Lodo. Siempre baja Velocidad del rival.",
    },

    "Head Smash": {
        name: "Head Smash",
        type: "ROCA",
        category: "physical",
        power: 150,
        accuracy: 80,
        priority: 0,
        effect: "recoil_50",
        effectChance: 100,
        description: "Cabezazo. Daño extremo con retroceso masivo.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🦅 VOLADOR - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "Brave Bird": {
        name: "Brave Bird",
        type: "VOLADOR",
        category: "physical",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: "recoil_33",
        effectChance: 100,
        description: "Pájaro Osado. Daño masivo con retroceso.",
    },

    "Hurricane": {
        name: "Hurricane",
        type: "VOLADOR",
        category: "special",
        power: 110,
        accuracy: 70,
        priority: 0,
        effect: "apply_confusion",
        effectChance: 30,
        description: "Huracán. Poderoso pero poco preciso. Puede confundir.",
    },

    "Air Slash": {
        name: "Air Slash",
        type: "VOLADOR",
        category: "special",
        power: 75,
        accuracy: 95,
        priority: 0,
        effect: "flinch_30",
        effectChance: 30,
        description: "Tajo Aéreo. Puede hacer retroceder al objetivo.",
    },

    "U-turn": {
        name: "U-turn",
        type: "BICHO",
        category: "physical",
        power: 70,
        accuracy: 100,
        priority: 0,
        effect: "user_switch",
        effectChance: 100,
        description: "Giro U. Ataca y luego cambia de Pokémon.",
    },

    "Defog": {
        name: "Defog",
        type: "VOLADOR",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "defog",
        effectChance: 100,
        description: "Antifaz. Elimina trampas del campo rival.",
    },

    "Roost": {
        name: "Roost",
        type: "VOLADOR",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "heal_50",
        effectChance: 100,
        description: "Descansar. Recupera 50% HP pero pierde tipo Volador.",
    },

    "Tailwind": {
        name: "Tailwind",
        type: "VOLADOR",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "boost_team_spe_2",
        effectChance: 100,
        description: "Viento Favorable. Duplica Velocidad del equipo 3 turnos.",
    },

    "Acrobatics": {
        name: "Acrobatics",
        type: "VOLADOR",
        category: "physical",
        power: 55,
        accuracy: 100,
        priority: 0,
        effect: "acrobatics",
        effectChance: 100,
        description: "Acrobacias. Duplica poder sin objeto.",
    },

    "Sky Drop": {
        name: "Sky Drop",
        type: "VOLADOR",
        category: "physical",
        power: 60,
        accuracy: 100,
        priority: 0,
        effect: "sky_drop",
        effectChance: 100,
        description: "Dejar Caer. Inmoviliza 1 turno luego ataca.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🔮 PSÍQUICO - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "Psychic": {
        name: "Psychic",
        type: "PSÍQUICO",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "lower_target_spd_1",
        effectChance: 10,
        description: "Psíquico. Puede bajar Defensa Especial del rival.",
    },

    "Psyshock": {
        name: "Psyshock",
        type: "PSÍQUICO",
        category: "special",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "psyshock",
        effectChance: 100,
        description: "Psicocorte. Usa Defensa Especial del objetivo.",
    },

    "Calm Mind": {
        name: "Calm Mind",
        type: "PSÍQUICO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "boost_spa_spd_1",
        effectChance: 100,
        description: "Mente Calma. Sube Ataque Especial y Defensa Especial.",
    },

    "Nasty Plot": {
        name: "Nasty Plot",
        type: "SINIESTRO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "boost_spa_2",
        effectChance: 100,
        description: "Maquinación. Sube Ataque Especial 2 niveles.",
    },

    "Trick Room": {
        name: "Trick Room",
        type: "PSÍQUICO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: -7,
        effect: "apply_trick_room",
        effectChance: 100,
        description: "Trick Room. Invierte orden de velocidad 5 turnos.",
    },

    "Hypnosis": {
        name: "Hypnosis",
        type: "PSÍQUICO",
        category: "status",
        power: 0,
        accuracy: 60,
        priority: 0,
        effect: "apply_sleep",
        effectChance: 100,
        description: "Hipnosis. Duerme al objetivo.",
    },

    "Stored Power": {
        name: "Stored Power",
        type: "PSÍQUICO",
        category: "special",
        power: 20,
        accuracy: 100,
        priority: 0,
        effect: "stored_power",
        effectChance: 100,
        description: "Poder Almacenado. Más fuerte con más mejoras.",
    },

    "Expanding Force": {
        name: "Expanding Force",
        type: "PSÍQUICO",
        category: "special",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "expanding_force",
        effectChance: 100,
        description: "Fuerza Expansiva. Más poderoso en Campo Psíquico.",
    },

    "Future Sight": {
        name: "Future Sight",
        type: "PSÍQUICO",
        category: "special",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: "future_sight",
        effectChance: 100,
        description: "Futuro Prever. Ataca 2 turnos después.",
    },

    "Heal Pulse": {
        name: "Heal Pulse",
        type: "PSÍQUICO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "heal_ally_50",
        effectChance: 100,
        description: "Pulsar Curación. Cura 50% HP de un aliado.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🐛 BICHO - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "U-turn": {
        name: "U-turn",
        type: "BICHO",
        category: "physical",
        power: 70,
        accuracy: 100,
        priority: 0,
        effect: "user_switch",
        effectChance: 100,
        description: "Giro U. Ataca y luego cambia de Pokémon.",
    },

    "Bug Buzz": {
        name: "Bug Buzz",
        type: "BICHO",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Zumbido. Potente ataque sónico.",
    },

    "Megahorn": {
        name: "Megahorn",
        type: "BICHO",
        category: "physical",
        power: 120,
        accuracy: 85,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Megacuerno. Poderoso pero poco preciso.",
    },

    "X-Scissor": {
        name: "X-Scissor",
        type: "BICHO",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Tijera X. Corte en forma de X.",
    },

    "Pollen Puff": {
        name: "Pollen Puff",
        type: "BICHO",
        category: "special",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "pollen_puff",
        effectChance: 100,
        description: "Bola Polen. Daña o cura según objetivo.",
    },

    "Quiver Dance": {
        name: "Quiver Dance",
        type: "BICHO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "boost_spa_spd_spe_1",
        effectChance: 100,
        description: "Danza Polen. Sube Ataque Especial, Defensa Especial y Velocidad.",
    },

    "Spore": {
        name: "Spore",
        type: "BICHO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "apply_sleep",
        effectChance: 100,
        description: "Espora. Duerme al objetivo con total precisión.",
    },

    "Stun Spore": {
        name: "Stun Spore",
        type: "BICHO",
        category: "status",
        power: 0,
        accuracy: 75,
        priority: 0,
        effect: "apply_paralysis",
        effectChance: 100,
        description: "Espora Paralizante. Paraliza al objetivo.",
    },

    "Leech Life": {
        name: "Leech Life",
        type: "BICHO",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "drain_50",
        effectChance: 100,
        description: "Chupavidas. Drena HP del objetivo.",
    },

    "First Impression": {
        name: "First Impression",
        type: "BICHO",
        category: "physical",
        power: 90,
        accuracy: 100,
        priority: 2,
        effect: "first_turn_only",
        effectChance: 100,
        description: "Primera Impresión. Solo funciona al entrar.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🪨 ROCA - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "Stone Edge": {
        name: "Stone Edge",
        type: "ROCA",
        category: "physical",
        power: 100,
        accuracy: 80,
        priority: 0,
        effect: "high_crit",
        effectChance: 100,
        description: "Tajo Roca. Alta probabilidad de crítico.",
    },

    "Rock Slide": {
        name: "Rock Slide",
        type: "ROCA",
        category: "physical",
        power: 75,
        accuracy: 90,
        priority: 0,
        effect: "flinch_30",
        effectChance: 30,
        description: "Avalancha. Puede hacer retroceder.",
    },

    "Stealth Rock": {
        name: "Stealth Rock",
        type: "ROCA",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "apply_stealth_rock",
        effectChance: 100,
        description: "Rocas Sigilosas. Daña a los Pokémon que entran.",
    },

    "Head Smash": {
        name: "Head Smash",
        type: "ROCA",
        category: "physical",
        power: 150,
        accuracy: 80,
        priority: 0,
        effect: "recoil_50",
        effectChance: 100,
        description: "Cabezazo. Daño extremo con retroceso masivo.",
    },

    "Rock Blast": {
        name: "Rock Blast",
        type: "ROCA",
        category: "physical",
        power: 25,
        accuracy: 90,
        priority: 0,
        effect: "multihit_2_5",
        effectChance: 100,
        description: "Rocazos. Golpea 2-5 veces.",
    },

    "Power Gem": {
        name: "Power Gem",
        type: "ROCA",
        category: "special",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Gema Poder. Ataque especial de roca.",
    },

    "Sandstorm": {
        name: "Sandstorm",
        type: "ROCA",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "apply_weather_sand",
        effectChance: 100,
        description: "Tormenta Arena. Causa daño por 5 turnos.",
    },

    "Wide Guard": {
        name: "Wide Guard",
        type: "ROCA",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 3,
        effect: "wide_guard",
        effectChance: 100,
        description: "Protección Amplia. Bloquea ataques multi-objetivo.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 👻 FANTASMA - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "Shadow Ball": {
        name: "Shadow Ball",
        type: "FANTASMA",
        category: "special",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "lower_target_spd_1",
        effectChance: 20,
        description: "Bola Sombra. Puede bajar Defensa Especial.",
    },

    "Shadow Claw": {
        name: "Shadow Claw",
        type: "FANTASMA",
        category: "physical",
        power: 70,
        accuracy: 100,
        priority: 0,
        effect: "high_crit",
        effectChance: 100,
        description: "Garra Sombra. Alta probabilidad de crítico.",
    },

    "Poltergeist": {
        name: "Poltergeist",
        type: "FANTASMA",
        category: "physical",
        power: 110,
        accuracy: 90,
        priority: 0,
        effect: "poltergeist",
        effectChance: 100,
        description: "Poltergeist. Falla si el rival no tiene objeto.",
    },

    "Phantom Force": {
        name: "Phantom Force",
        type: "FANTASMA",
        category: "physical",
        power: 90,
        accuracy: 100,
        priority: 0,
        effect: "charge_turn",
        effectChance: 100,
        description: "Fuerza Fantasma. Ataque de 2 turnos.",
    },

    "Destiny Bond": {
        name: "Destiny Bond",
        type: "FANTASMA",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "destiny_bond",
        effectChance: 100,
        description: "Vínculo Destino. El rival se debilita si lo hace el usuario.",
    },

    "Will-O-Wisp": {
        name: "Will-O-Wisp",
        type: "FUEGO",
        category: "status",
        power: 0,
        accuracy: 85,
        priority: 0,
        effect: "apply_burn",
        effectChance: 100,
        description: "Fuego Fatuo. Quema al objetivo con alta probabilidad.",
    },

    "Hex": {
        name: "Hex",
        type: "FANTASMA",
        category: "special",
        power: 65,
        accuracy: 100,
        priority: 0,
        effect: "hex",
        effectChance: 100,
        description: "Maldición. Duplica poder si el rival tiene estado.",
    },

    "Shadow Sneak": {
        name: "Shadow Sneak",
        type: "FANTASMA",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 1,
        effect: null,
        effectChance: 0,
        description: "Embestida Sombra. Ataque prioritario.",
    },

    "Astonish": {
        name: "Astonish",
        type: "FANTASMA",
        category: "physical",
        power: 30,
        accuracy: 100,
        priority: 0,
        effect: "flinch_30",
        effectChance: 30,
        description: "Sorpresa. Puede hacer retroceder.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🐉 DRAGÓN - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "Draco Meteor": {
        name: "Draco Meteor",
        type: "DRAGÓN",
        category: "special",
        power: 130,
        accuracy: 90,
        priority: 0,
        effect: "lower_user_spa_2",
        effectChance: 100,
        description: "Cometa Draco. Daño masivo pero baja Ataque Especial.",
    },

    "Dragon Dance": {
        name: "Dragon Dance",
        type: "DRAGÓN",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "boost_atk_spe_1",
        effectChance: 100,
        description: "Danza Dragón. Sube Ataque y Velocidad 1 nivel.",
    },

    "Outrage": {
        name: "Outrage",
        type: "DRAGÓN",
        category: "physical",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: "outrage",
        effectChance: 100,
        description: "Furia. Ataca 2-3 turnos luego confunde.",
    },

    "Dragon Claw": {
        name: "Dragon Claw",
        type: "DRAGÓN",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Garra Dragón. Ataque confiable de dragón.",
    },

    "Dragon Pulse": {
        name: "Dragon Pulse",
        type: "DRAGÓN",
        category: "special",
        power: 85,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Pulso Dragón. Ataque especial de dragón.",
    },

    "Dragon Tail": {
        name: "Dragon Tail",
        type: "DRAGÓN",
        category: "physical",
        power: 60,
        accuracy: 90,
        priority: -6,
        effect: "force_switch",
        effectChance: 100,
        description: "Cola Dragón. Fuerza al cambio de Pokémon.",
    },

    "Dual Chop": {
        name: "Dual Chop",
        type: "DRAGÓN",
        category: "physical",
        power: 40,
        accuracy: 90,
        priority: 0,
        effect: "multihit_2",
        effectChance: 100,
        description: "Doble Golpe. Golpea 2 veces.",
    },

    "Breaking Swipe": {
        name: "Breaking Swipe",
        type: "DRAGÓN",
        category: "physical",
        power: 60,
        accuracy: 100,
        priority: 0,
        effect: "lower_target_atk_1",
        effectChance: 100,
        description: "Golpe Rompedor. Siempre baja Ataque del rival.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🌑 SINIESTRO - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "Dark Pulse": {
        name: "Dark Pulse",
        type: "SINIESTRO",
        category: "special",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "flinch_20",
        effectChance: 20,
        description: "Pulso Umbrío. Puede hacer retroceder.",
    },

    "Knock Off": {
        name: "Knock Off",
        type: "SINIESTRO",
        category: "physical",
        power: 65,
        accuracy: 100,
        priority: 0,
        effect: "knock_off",
        effectChance: 100,
        description: "Derribar. Elimina el objeto del rival.",
    },

    "Sucker Punch": {
        name: "Sucker Punch",
        type: "SINIESTRO",
        category: "physical",
        power: 70,
        accuracy: 100,
        priority: 1,
        effect: "sucker_punch",
        effectChance: 100,
        description: "Golpe Bajo. Ataca primero si el rival ataca.",
    },

    "Nasty Plot": {
        name: "Nasty Plot",
        type: "SINIESTRO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "boost_spa_2",
        effectChance: 100,
        description: "Maquinación. Sube Ataque Especial 2 niveles.",
    },

    "Foul Play": {
        name: "Foul Play",
        type: "SINIESTRO",
        category: "physical",
        power: 95,
        accuracy: 100,
        priority: 0,
        effect: "foul_play",
        effectChance: 100,
        description: "Juego Sucio. Usa Ataque del rival.",
    },

    "Crunch": {
        name: "Crunch",
        type: "SINIESTRO",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "lower_target_def_1",
        effectChance: 20,
        description: "Triturar. Puede bajar Defensa del rival.",
    },

    "Dark Void": {
        name: "Dark Void",
        type: "SINIESTRO",
        category: "status",
        power: 0,
        accuracy: 50,
        priority: 0,
        effect: "apply_sleep",
        effectChance: 100,
        description: "Vacío Oscuro. Duerme a todos los rivales.",
    },

    "Hone Claws": {
        name: "Hone Claws",
        type: "SINIESTRO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "boost_atk_accuracy_1",
        effectChance: 100,
        description: "Afilar Garras. Sube Ataque y Precisión.",
    },

    "Parting Shot": {
        name: "Parting Shot",
        type: "SINIESTRO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "parting_shot",
        effectChance: 100,
        description: "Disparo Despedida. Baja estadísticas y cambia.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // ⚙️ ACERO - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "Iron Head": {
        name: "Iron Head",
        type: "ACERO",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "flinch_30",
        effectChance: 30,
        description: "Cabeza de Hierro. Puede hacer retroceder.",
    },

    "Bullet Punch": {
        name: "Bullet Punch",
        type: "ACERO",
        category: "physical",
        power: 40,
        accuracy: 100,
        priority: 1,
        effect: null,
        effectChance: 0,
        description: "Puño Bala. Ataque prioritario de acero.",
    },

    "Meteor Beam": {
        name: "Meteor Beam",
        type: "ACERO",
        category: "special",
        power: 120,
        accuracy: 90,
        priority: 0,
        effect: "charge_boost",
        effectChance: 100,
        description: "Rayo Meteoro. Carga 1 turno, sube Ataque Especial.",
    },

    "Steel Beam": {
        name: "Steel Beam",
        type: "ACERO",
        category: "special",
        power: 140,
        accuracy: 95,
        priority: 0,
        effect: "recoil_50",
        effectChance: 100,
        description: "Rayo Acero. Daño extremo con retroceso masivo.",
    },

    "Flash Cannon": {
        name: "Flash Cannon",
        type: "ACERO",
        category: "special",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "lower_target_spd_1",
        effectChance: 10,
        description: "Cañón Fulgor. Puede bajar Defensa Especial.",
    },

    "Heavy Slam": {
        name: "Heavy Slam",
        type: "ACERO",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "weight_damage",
        effectChance: 100,
        description: "Placaje Pesado. Más poder si usuario es más pesado.",
    },

    "Autotomize": {
        name: "Autotomize",
        type: "ACERO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "boost_spe_2_and_lower_weight",
        effectChance: 100,
        description: "Autotomizar. Sube Velocidad 2 niveles y reduce peso.",
    },

    "Shift Gear": {
        name: "Shift Gear",
        type: "ACERO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "boost_atk_spe_1",
        effectChance: 100,
        description: "Cambio Marcha. Sube Ataque 1 nivel y Velocidad 2 niveles.",
    },

    "Body Press": {
        name: "Body Press",
        type: "ACERO",
        category: "physical",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: "body_press",
        effectChance: 100,
        description: "Placaje. Usa Defensa en lugar de Ataque.",
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🧚 HADA - MOVIMIENTOS COMPETITIVOS
    // ────────────────────────────────────────────────────────────────────────

    "Moonblast": {
        name: "Moonblast",
        type: "HADA",
        category: "special",
        power: 95,
        accuracy: 100,
        priority: 0,
        effect: "lower_target_spa_1",
        effectChance: 30,
        description: "Bomba Lunar. Puede bajar Ataque Especial del rival.",
    },

    "Dazzling Gleam": {
        name: "Dazzling Gleam",
        type: "HADA",
        category: "special",
        power: 80,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Destello Deslumbrante. Ataque multi-objetivo.",
    },

    "Play Rough": {
        name: "Play Rough",
        type: "HADA",
        category: "physical",
        power: 90,
        accuracy: 90,
        priority: 0,
        effect: "lower_target_atk_1",
        effectChance: 10,
        description: "Juego Rudo. Puede bajar Ataque del rival.",
    },

    "Draining Kiss": {
        name: "Draining Kiss",
        type: "HADA",
        category: "special",
        power: 50,
        accuracy: 100,
        priority: 0,
        effect: "drain_75",
        effectChance: 100,
        description: "Beso Drenaje. Drena 75% del daño causado.",
    },

    "Aromatic Mist": {
        name: "Aromatic Mist",
        type: "HADA",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "boost_ally_spd_1",
        effectChance: 100,
        description: "Niebla Aromática. Sube Defensa Especial de un aliado.",
    },

    "Calm Mind": {
        name: "Calm Mind",
        type: "PSÍQUICO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "boost_spa_spd_1",
        effectChance: 100,
        description: "Mente Calma. Sube Ataque Especial y Defensa Especial.",
    },

    "Misty Terrain": {
        name: "Misty Terrain",
        type: "HADA",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "apply_misty_terrain",
        effectChance: 100,
        description: "Campo Nebuloso. Protege de estados por 5 turnos.",
    },

    "Moonlight": {
        name: "Moonlight",
        type: "HADA",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "heal_weather_dependent",
        effectChance: 100,
        description: "Luz Lunar. Recupera HP, más sin clima adverso.",
    },

    "Nature's Madness": {
        name: "Nature's Madness",
        type: "HADA",
        category: "special",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "half_current_hp",
        effectChance: 100,
        description: "Locura Natural. Causa 50% del HP actual.",
    },

}; // fin MovesDB


// ─── FUNCIÓN AUXILIAR (usada por el motor de batalla) ────────────────────────
// No hace falta tocar esto al añadir movimientos.
function getMoveInfo(moveName) {
    const move = MovesDB[moveName];
    if (!move) {
        // Movimiento desconocido: devuelve un ataque normal por defecto
        return {
            name: moveName,
            type: "NORMAL",
            category: "physical",
            power: 80,
            accuracy: 100,
            priority: 0,
            effect: null,
            effectChance: 0,
            description: "Ataque básico",
        };
    }
    return move;
}
