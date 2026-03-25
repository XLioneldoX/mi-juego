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
    "Foco Resplandor": {
        name: "Foco Resplandor",
        type: "PSÍQUICO",
        category: "special",
        power: 120,
        accuracy: 100,
        priority: 0,
        effect: null,
        effectChance: 0,
        description: "Explosión de energía mental concentrada. 120 de poder.",
    },
    "Recuperación": {
        name: "Recuperación",
        type: "PSÍQUICO",
        category: "status",
        power: 0,
        accuracy: null,
        priority: 0,
        effect: "heal_50",
        effectChance: 100,
        description: "Recupera el 50% del HP máximo.",
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
        priority: -10,
        effect: "sumon_trick room",
        effectChange: 100,
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
        effect: null,
        effectChange: 0,             
        description: "El poseedor usa su energia oscura para embestir hacia su oponente.",
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
        description: "Crea un señuelo con el 25% del HP para protegerse.",
    },

    // ════════════════════════════════════════════════════════════════════════
    // 🆕 NUEVOS MOVIMIENTOS
    // ════════════════════════════════════════════════════════════════════════

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
    "Púas Tóxicas": {
        name: "Púas Tóxicas",
        type: "VENENO",
        category: "status",
        power: 0,
        accuracy: 100,
        priority: 0,
        effect: "apply_toxic_spikes",
        effectChance: 100,
        description: "Lanza púas tóxicas al campo rival para envenenar a quienes entren.",
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
    // Nuevos movimientos:
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
