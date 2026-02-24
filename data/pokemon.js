// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  data/pokemon.js  —  BASE DE DATOS DE POKÉMON                           ║
// ║                                                                          ║
// ║  PROPIEDADES DE CADA POKÉMON:                                            ║
// ║   id        → número único (1–20 base, ≥9001 custom con sprite propio)  ║
// ║   name      → nombre en pantalla                                         ║
// ║   types     → array de 1 ó 2 tipos (ver TypeColors en types.js)         ║
// ║   abilities → array de 1 ó 2 habilidades (el jugador elige en editor)  ║
// ║   ability   → habilidad por defecto (la primera de abilities[])         ║
// ║   moves     → 4 movimientos por defecto del learnset                    ║
// ║   learnset  → todos los movimientos aprendibles (aparecen en editor)    ║
// ║   stats     → { hp, atk, def, spa, spd, spe } — stats BASE             ║
// ║                                                                          ║
// ║  PARA AÑADIR UN POKÉMON NUEVO:                                           ║
// ║   1. Copia cualquier bloque y cambia los valores                         ║
// ║   2. Asigna un ID único (siguiente número disponible)                   ║
// ║   3. Para sprite propio: ID ≥ 9001 + añádelo en CustomSprites abajo     ║
// ║      y en data/sprites.js (ver instalar-sprites.html)                   ║
// ║                                                                          ║
// ║  TIPOS DISPONIBLES (ver data/types.js para la tabla completa):          ║
// ║   FUEGO · AGUA · PLANTA · ELÉCTRICO · HIELO · LUCHA · VENENO · TIERRA  ║
// ║   VOLADOR · PSÍQUICO · BICHO · ROCA · FANTASMA · DRAGÓN · SINIESTRO    ║
// ║   ACERO · HADA · NORMAL                                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const PokemonDB = {

    // ════════════════════════════════════════════════════════════════════════
    // POKÉMON 1–20  ←  SUSTITUYE ESTOS NOMBRES Y DATOS POR LOS TUYOS
    // Todos los campos son editables. Los IDs van del 1 al 20 en orden.
    // ════════════════════════════════════════════════════════════════════════

    1: {
        id: 1, name: "IGNAROTH",
        types:     ["FUEGO", "DRAGÓN"],
        abilities: ["Ímpetu", "Temeridad"],
        ability:   "Ímpetu",
        moves:     ["Lanzallamas", "Garra Dragón", "Danza Dragón", "Nitrocarga"],
        learnset:  ["Lanzallamas","Garra Dragón","Danza Dragón","Nitrocarga","Llamarada","Onda Ígnea","Enfado","Triturar"],
        stats: { hp:155, atk:130, def:90, spa:140, spd:95, spe:120 },
    },

    2: {
        id: 2, name: "VELTHORN",
        types:     ["PLANTA", "VENENO"],
        abilities: ["Espesura", "Fuerza Bruta"],
        ability:   "Espesura",
        moves:     ["Rayo Solar", "Bomba Lodo", "Síntesis", "Gigadrenado"],
        learnset:  ["Rayo Solar","Bomba Lodo","Síntesis","Gigadrenado","Hoja Afilada","Terremoto","Hipnosis","Protección"],
        stats: { hp:160, atk:105, def:120, spa:145, spd:120, spe:85 },
    },

    3: {
        id: 3, name: "AQUAREX",
        types:     ["AGUA"],
        abilities: ["Torrente", "Absorción"],
        ability:   "Torrente",
        moves:     ["Hidrobomba", "Surf", "Cascada", "Protección"],
        learnset:  ["Hidrobomba","Surf","Cascada","Protección","Rayo Hielo","Terremoto","Golpe Cuerpo","Descanso"],
        stats: { hp:170, atk:110, def:130, spa:120, spd:110, spe:80 },
    },

    4: {
        id: 4, name: "VOLTARIX",
        types:     ["ELÉCTRICO"],
        abilities: ["Electricidad Estática", "Velocidad Radical"],
        ability:   "Electricidad Estática",
        moves:     ["Rayo", "Bola Voltio", "Onda Trueno", "Ataque Rápido"],
        learnset:  ["Rayo","Bola Voltio","Onda Trueno","Ataque Rápido","Onda Voltio","Puño Trueno","Velocidad Extrema","Protección"],
        stats: { hp:120, atk:110, def:80, spa:140, spd:90, spe:155 },
    },

    5: {
        id: 5, name: "GLACIVERN",
        types:     ["HIELO", "DRAGÓN"],
        abilities: ["Cuerpo Gélido", "Temeridad"],
        ability:   "Cuerpo Gélido",
        moves:     ["Rayo Hielo", "Garra Dragón", "Ventisca", "Danza Dragón"],
        learnset:  ["Rayo Hielo","Garra Dragón","Ventisca","Danza Dragón","Viento Hielo","Canto Helado","Enfado","Descanso"],
        stats: { hp:140, atk:135, def:100, spa:130, spd:105, spe:100 },
    },

    6: {
        id: 6, name: "PYSHRAK",
        types:     ["PSÍQUICO", "FUEGO"],
        abilities: ["Sincronía", "Ímpetu"],
        ability:   "Sincronía",
        moves:     ["Psíquico", "Lanzallamas", "Foco Resplandor", "Recuperación"],
        learnset:  ["Psíquico","Lanzallamas","Foco Resplandor","Recuperación","Hipnosis","Bola Sombra","Onda Ígnea","Protección"],
        stats: { hp:130, atk:90, def:85, spa:155, spd:130, spe:110 },
    },

    7: {
        id: 7, name: "TERRAVOX",
        types:     ["TIERRA", "ROCA"],
        abilities: ["Piel Dura", "Presión"],
        ability:   "Piel Dura",
        moves:     ["Terremoto", "Roca Afilada", "Megacuerno", "Avalancha"],
        learnset:  ["Terremoto","Roca Afilada","Megacuerno","Avalancha","Golpe Cuerpo","Triturar","Protección","Descanso"],
        stats: { hp:175, atk:130, def:145, spa:60, spd:100, spe:60 },
    },

    8: {
        id: 8, name: "SPECTRAX",
        types:     ["FANTASMA", "SINIESTRO"],
        abilities: ["Levitación", "Presión"],
        ability:   "Levitación",
        moves:     ["Bola Sombra", "Triturar", "Hipnosis", "Recuperación"],
        learnset:  ["Bola Sombra","Triturar","Hipnosis","Recuperación","Psíquico","Ataque Rápido","Protección","Descanso"],
        stats: { hp:120, atk:115, def:80, spa:145, spd:120, spe:130 },
    },

    9: {
        id: 9, name: "FERROKLAX",
        types:     ["ACERO", "LUCHA"],
        abilities: ["Piel Dura", "Garra Fuerte"],
        ability:   "Piel Dura",
        moves:     ["Cabeza de Hierro", "A Bocajarro", "Tiro Vital", "Velocidad Extrema"],
        learnset:  ["Cabeza de Hierro","A Bocajarro","Tiro Vital","Velocidad Extrema","Golpe Cuerpo","Roca Afilada","Terremoto","Protección"],
        stats: { hp:150, atk:145, def:140, spa:60, spd:90, spe:85 },
    },

    10: {
        id: 10, name: "VENOMBITE",
        types:     ["VENENO", "BICHO"],
        abilities: ["Efecto Esporo", "Velocidad Radical"],
        ability:   "Efecto Esporo",
        moves:     ["Bomba Lodo", "Megacuerno", "Ataque Rápido", "Hipnosis"],
        learnset:  ["Bomba Lodo","Megacuerno","Ataque Rápido","Hipnosis","Gigadrenado","Hoja Afilada","Protección","Descanso"],
        stats: { hp:125, atk:120, def:90, spa:110, spd:95, spe:140 },
    },

    11: {
        id: 11, name: "AETHERWING",
        types:     ["VOLADOR", "HADA"],
        abilities: ["Viento Sereno", "Absorción"],
        ability:   "Viento Sereno",
        moves:     ["Vuelo", "Vendaval", "Foco Resplandor", "Velocidad Extrema"],
        learnset:  ["Vuelo","Vendaval","Foco Resplandor","Velocidad Extrema","Rayo","Ataque Rápido","Protección","Descanso"],
        stats: { hp:130, atk:110, def:85, spa:130, spd:110, spe:145 },
    },

    12: {
        id: 12, name: "DRAKOZUL",
        types:     ["DRAGÓN"],
        abilities: ["Fuerza Bruta", "Presión"],
        ability:   "Fuerza Bruta",
        moves:     ["Garra Dragón", "Enfado", "Triturar", "Danza Dragón"],
        learnset:  ["Garra Dragón","Enfado","Triturar","Danza Dragón","Terremoto","Velocidad Extrema","Golpe Cuerpo","Protección"],
        stats: { hp:165, atk:155, def:105, spa:90, spd:100, spe:95 },
    },

    13: {
        id: 13, name: "CRYOVAST",
        types:     ["HIELO", "AGUA"],
        abilities: ["Cuerpo Gélido", "Torrente"],
        ability:   "Cuerpo Gélido",
        moves:     ["Ventisca", "Surf", "Rayo Hielo", "Descanso"],
        learnset:  ["Ventisca","Surf","Rayo Hielo","Descanso","Cascada","Viento Hielo","Canto Helado","Protección"],
        stats: { hp:175, atk:100, def:120, spa:130, spd:125, spe:75 },
    },

    14: {
        id: 14, name: "LETHALORE",
        types:     ["SINIESTRO", "PSÍQUICO"],
        abilities: ["Presión", "Sincronía"],
        ability:   "Presión",
        moves:     ["Triturar", "Psíquico", "Bola Sombra", "Hipnosis"],
        learnset:  ["Triturar","Psíquico","Bola Sombra","Hipnosis","Foco Resplandor","Ataque Rápido","Recuperación","Protección"],
        stats: { hp:125, atk:120, def:85, spa:140, spd:115, spe:125 },
    },

    15: {
        id: 15, name: "BLAZTHORN",
        types:     ["FUEGO", "LUCHA"],
        abilities: ["Ímpetu", "Garra Fuerte"],
        ability:   "Ímpetu",
        moves:     ["Lanzallamas", "A Bocajarro", "Nitrocarga", "Tiro Vital"],
        learnset:  ["Lanzallamas","A Bocajarro","Nitrocarga","Tiro Vital","Onda Ígnea","Velocidad Extrema","Terremoto","Protección"],
        stats: { hp:140, atk:145, def:90, spa:120, spd:85, spe:130 },
    },

    16: {
        id: 16, name: "STONEGRAVE",
        types:     ["ROCA", "FANTASMA"],
        abilities: ["Piel Dura", "Levitación"],
        ability:   "Piel Dura",
        moves:     ["Roca Afilada", "Bola Sombra", "Avalancha", "Descanso"],
        learnset:  ["Roca Afilada","Bola Sombra","Avalancha","Descanso","Megacuerno","Terremoto","Triturar","Protección"],
        stats: { hp:160, atk:125, def:145, spa:90, spd:110, spe:55 },
    },

    17: {
        id: 17, name: "TEMPESTRIX",
        types:     ["ELÉCTRICO", "VOLADOR"],
        abilities: ["Electricidad Estática", "Viento Sereno"],
        ability:   "Electricidad Estática",
        moves:     ["Rayo", "Vuelo", "Onda Trueno", "Ataque Rápido"],
        learnset:  ["Rayo","Vuelo","Onda Trueno","Ataque Rápido","Bola Voltio","Vendaval","Velocidad Extrema","Protección"],
        stats: { hp:125, atk:105, def:80, spa:145, spd:100, spe:155 },
    },

    18: {
        id: 18, name: "MIRELOCK",
        types:     ["AGUA", "TIERRA"],
        abilities: ["Torrente", "Absorción"],
        ability:   "Torrente",
        moves:     ["Surf", "Terremoto", "Cascada", "Golpe Cuerpo"],
        learnset:  ["Surf","Terremoto","Cascada","Golpe Cuerpo","Hidrobomba","Roca Afilada","Descanso","Protección"],
        stats: { hp:165, atk:125, def:130, spa:100, spd:115, spe:75 },
    },

    19: {
        id: 19, name: "PSYCHOVEIL",
        types:     ["PSÍQUICO", "HADA"],
        abilities: ["Sincronía", "Viento Sereno"],
        ability:   "Sincronía",
        moves:     ["Psíquico", "Foco Resplandor", "Recuperación", "Hipnosis"],
        learnset:  ["Psíquico","Foco Resplandor","Recuperación","Hipnosis","Bola Sombra","Esfera Aural","Protección","Descanso"],
        stats: { hp:135, atk:85, def:95, spa:160, spd:140, spe:105 },
    },

    20: {
        id: 20, name: "OMNIVAST",
        types:     ["DRAGÓN", "ACERO"],
        abilities: ["Fuerza Bruta", "Piel Dura"],
        ability:   "Fuerza Bruta",
        moves:     ["Garra Dragón", "Cabeza de Hierro", "Terremoto", "Danza Dragón"],
        learnset:  ["Garra Dragón","Cabeza de Hierro","Terremoto","Danza Dragón","Enfado","Roca Afilada","Velocidad Extrema","Triturar"],
        stats: { hp:175, atk:150, def:135, spa:80, spd:110, spe:75 },
    },

    // ════════════════════════════════════════════════════════════════════════
    // 🌟 POKÉMON PERSONALIZADOS (IDs ≥ 9001, con sprites propios)
    // ════════════════════════════════════════════════════════════════════════

    9001: {
        id: 9001, name: "SAYUMARI",
        types:     ["DRAGÓN", "ACERO"],
        abilities: ["Fuerza Bruta", "Piel Dura"],
        ability:   "Fuerza Bruta",
        moves:     ["Garra Dragón", "Cabeza de Hierro", "Terremoto", "Danza Dragón"],
        learnset:  ["Garra Dragón","Cabeza de Hierro","Terremoto","Danza Dragón","Enfado","Roca Afilada","Velocidad Extrema","Triturar"],
        stats: { hp:106, atk:135, def:125, spa:70, spd:100, spe:64 },
    },

    9002: {
        id: 9002, name: "GOGOAT-P",
        types:     ["HIELO", "TIERRA"],
        abilities: ["Absorción", "Recuperación"],
        ability:   "Absorción",
        moves:     ["Terremoto", "Golpe Cuerpo", "Síntesis", "Megacuerno"],
        learnset:  ["Terremoto","Golpe Cuerpo","Síntesis","Megacuerno","Avalancha","Rayo Hielo","Viento Hielo","Protección"],
        stats: { hp:123, atk:100, def:97, spa:62, spd:68, spe:81 },
    },

    // ← AÑADE AQUÍ TUS POKÉMON PERSONALIZADOS
    // Copia el bloque de arriba, cambia el ID (9003, 9004...) y los datos.
    // Para añadir sprite: pon el fichero en sprites/ y regístralo en CustomSprites abajo.

}; // fin PokemonDB


// ─── SPRITES PERSONALIZADOS ───────────────────────────────────────────────────
// Ficheros en SpriteB64 (data/sprites.js) — funcionan sin internet.
//
// PARA GIRAR UN SPRITE HORIZONTALMENTE en el combate:
//   El sprite del JUGADOR ya tiene CSS: transform:scaleX(-1) aplicado.
//   Si tu imagen mira a la derecha, el jugador la verá bien sin hacer nada.
//   Para forzar el flip solo del rival: añade flipFront:true en su entrada.
//
const CustomSprites = {
    9001: { front: "samururai.jpg", back: "samururai.jpg" },
    9002: { front: "gogoat.jpg",    back: "gogoat.jpg"    },
    // 9003: { front: "mi_pokemon.jpg", back: "mi_pokemon.jpg" },
};


// ─── PLACEHOLDER OFFLINE ─────────────────────────────────────────────────────
// Muestra la inicial del Pokémon cuando no hay sprite disponible.
// No requiere internet.
function getPlaceholderSvg(name) {
    const letter = (name || '?')[0].toUpperCase();
    const colors = ['#ef4444','#3b82f6','#22c55e','#a855f7','#f59e0b','#ec4899','#0891b2'];
    const color  = colors[(name || '').charCodeAt(0) % colors.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
        <rect width="96" height="96" rx="12" fill="${color}" opacity="0.25"/>
        <text x="48" y="62" font-family="monospace" font-size="44" fill="${color}" text-anchor="middle">${letter}</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// ─── OBTENER URL DE SPRITE ────────────────────────────────────────────────────
// Prioridad: 1) Custom embebido  2) Oficial embebido  3) Placeholder
// Ya NO usa PokeAPI (100% offline).
function getSpriteUrl(pokemonId, side) {
    side = side || 'front';

    // 1. Sprite personalizado embebido en Base64
    if (CustomSprites[pokemonId]) {
        const fname = CustomSprites[pokemonId][side] || CustomSprites[pokemonId].front;
        if (typeof SpriteB64 !== 'undefined' && SpriteB64[fname]) return SpriteB64[fname];
    }

    // 2. Sprite oficial embebido (generado por instalar-sprites.html)
    if (typeof SpriteB64 !== 'undefined') {
        const key = 'official_' + pokemonId + '_' + side + '.png';
        if (SpriteB64[key]) return SpriteB64[key];
    }

    // 3. Placeholder SVG con la inicial (no requiere internet)
    const base = PokemonDB[pokemonId];
    return getPlaceholderSvg(base ? base.name : String(pokemonId));
}

// onerror handler — siempre cae al placeholder, nunca a internet
function onSpriteError(imgEl, pokemonId) {
    const base = PokemonDB[pokemonId];
    imgEl.src    = getPlaceholderSvg(base ? base.name : String(pokemonId));
    imgEl.onerror = null;
}
