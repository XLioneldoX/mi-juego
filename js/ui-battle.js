// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  js/ui-battle.js  —  INTERFAZ DE BATALLA                                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝

function updateUI() {
    const player = playerTeam[playerActive];
    const enemy = enemyTeam[enemyActive];
    const pSp = document.getElementById('playerSprite');
    const eSp = document.getElementById('enemySprite');
    if (pSp) { pSp.src = getSpriteUrl(player.id, 'back'); pSp.onerror = () => onSpriteError(pSp, player.id); }
    if (eSp) { eSp.src = getSpriteUrl(enemy.id, 'front'); eSp.onerror = () => onSpriteError(eSp, enemy.id); }
    updatePokemonCard('player', player);
    updatePokemonCard('enemy', enemy);
    updateTeamMinis();

    if (typeof playerHazards !== 'undefined') renderHazards('player', playerHazards);
    if (typeof enemyHazards !== 'undefined') renderHazards('enemy', enemyHazards);
}

// ─── TARJETA DE POKÉMON ───────────────────────────────────────────────────────
function updatePokemonCard(side, pokemon) {
    const isEnemy = side === 'enemy';

    const nameEl = document.getElementById(`${side}Name`);
    if (nameEl) nameEl.textContent = pokemon.name;

    // Estado
    const statusEl = document.getElementById(`${side}Status`);
    if (statusEl) {
        const sd = StatusDB[pokemon.status];
        if (pokemon.status && sd) {
            statusEl.style.display = 'inline-block';
            statusEl.className = `status-badge status-${pokemon.status}`;
            statusEl.style.background = sd.color || '#6b7280';
            statusEl.textContent = sd.label;
        } else statusEl.style.display = 'none';
    }

    // Tipos
    const typesEl = document.getElementById(`${side}Types`);
    if (typesEl) typesEl.innerHTML = pokemon.types.map(t =>
        `<span class="type-badge type-${t.replace(/[ÉÍÓ]/g, c => ({ 'É': 'E', 'Í': 'I', 'Ó': 'O' }[c]))}">${t}</span>`
    ).join('');

    // Barra de HP
    const pct = Math.max(0, (pokemon.currentHp / pokemon.stats.hp) * 100);
    const bar = document.getElementById(`${side}HpBar`);
    if (bar) { bar.style.width = pct + '%'; bar.style.background = pct > 50 ? '#22c55e' : pct > 20 ? '#eab308' : '#ef4444'; }
    const hpT = document.getElementById(`${side}HpText`);
    if (hpT) hpT.textContent = `${Math.floor(pokemon.currentHp)} / ${pokemon.stats.hp} HP`;

    // Stats + boosts + info revelada/oculta
    const statsEl = document.getElementById(`${side}Stats`);
    if (!statsEl) return;

    const spe = getEffectiveSpe(pokemon);
    const mods = getModifiedStats(pokemon);
    const ab = AbilitiesDB[pokemon.ability];
    const nat = NaturesDB[pokemon.nature] || {};
    const boosts = pokemon.statBoosts || {};

    // Para el rival: ocultar objeto y habilidad hasta que se revelen
    const revealed = isEnemy
        ? (typeof enemyRevealed !== 'undefined' ? enemyRevealed : { item: true, ability: true })
        : { item: true, ability: true };

    const abDisplay = isEnemy && !revealed.ability
        ? `<span style="color:#334155">HAB ???</span>`
        : `<span title="${ab ? ab.description : ''}" style="cursor:help;">${ab ? ab.icon + ' ' : ''}<span style="color:#a5b4fc;">${pokemon.ability || '─'}</span></span>`;

    const itemDisplay = (isEnemy && !revealed.item && pokemon.item !== 'Ninguno')
        ? `<span style="color:#334155;">OBJ ???</span>`
        : (pokemon.item !== 'Ninguno' ? `<span style="color:#fbbf24;">🎒 ${pokemon.item}</span>` : '');

    const lvlTag = pokemon.level ? `<span style="color:#475569;font-size:5px;"> Nvl${pokemon.level}</span>` : '';

    statsEl.innerHTML = `
        <div class="stat-mini">ATK <span style="color:#ef4444;">${mods.atk}${nat.up === 'atk' ? '↑' : nat.down === 'atk' ? '↓' : ''}</span></div>
        <div class="stat-mini">DEF <span style="color:#3b82f6;">${mods.def}${nat.up === 'def' ? '↑' : nat.down === 'def' ? '↓' : ''}</span></div>
        <div class="stat-mini">SPE <span style="color:#ec4899;">${spe}</span>${lvlTag}</div>
        <div class="stat-mini">SPA <span style="color:#a855f7;">${mods.spa}${nat.up === 'spa' ? '↑' : nat.down === 'spa' ? '↓' : ''}</span></div>
        <div class="stat-mini">SPD <span style="color:#eab308;">${mods.spd}</span></div>
        <div class="stat-mini" style="grid-column:1/-1;">${abDisplay}</div>
        ${itemDisplay ? `<div class="stat-mini" style="grid-column:1/-1;">${itemDisplay}</div>` : ''}
        ${buildBoostRow(boosts)}
    `;
}

// ─── INDICADORES DE BOOST ACTIVOS ─────────────────────────────────────────────
function buildBoostRow(boosts) {
    const labels = { atk: 'ATK', def: 'DEF', spa: 'SPA', spd: 'SPD', spe: 'SPE' };
    const multStr = b =>
        b === 6 ? '×4' : b === 5 ? '×3.5' : b === 4 ? '×3' : b === 3 ? '×2.5' : b === 2 ? '×2' : b === 1 ? '×1.5' :
            b === -1 ? '×0.67' : b === -2 ? '×0.5' : b === -3 ? '×0.4' : b === -4 ? '×0.33' : b === -5 ? '×0.28' : b === -6 ? '×0.25' : '';
    const active = [];
    for (const [stat, val] of Object.entries(boosts)) {
        if (val && labels[stat]) {
            const col = val > 0 ? '#22c55e' : '#ef4444';
            const arr = val > 0 ? '▲' : '▼';
            active.push(`<span style="color:${col};font-size:5px;">${arr}${multStr(val)}${labels[stat]}</span>`);
        }
    }
    if (!active.length) return '';
    return `<div class="stat-mini" style="grid-column:1/-1;display:flex;gap:4px;flex-wrap:wrap;margin-top:2px;">${active.join('')}</div>`;
}

// ─── MINI EQUIPO ──────────────────────────────────────────────────────────────
function updateTeamMinis() {
    ['player', 'enemy'].forEach(side => {
        const team = side === 'player' ? playerTeam : enemyTeam;
        const active = side === 'player' ? playerActive : enemyActive;
        const cont = document.getElementById(`${side}Mini`);
        if (!cont) return;
        cont.innerHTML = team.map((p, i) => {
            const hp = (p.currentHp / p.stats.hp) * 100;
            const hpc = hp > 50 ? '#22c55e' : hp > 20 ? '#eab308' : '#ef4444';
            const sp = getSpriteUrl(p.id, 'front');
            return `<div class="mini-slot ${i === active ? 'active' : ''} ${p.fainted ? 'fainted' : ''}">
                <img src="${sp}" onerror="onSpriteError(this, p.id)" title="${p.name}">
                <div class="mini-hp-bar"><div class="mini-hp-fill" style="width:${hp}%;background:${hpc};"></div></div>
            </div>`;
        }).join('');
    });
}

// ─── BOTONES DE MOVIMIENTO CON TOOLTIP ───────────────────────────────────────
function renderMoves() {
    if (typeof window.restoreRandom === 'function') window.restoreRandom();
    if (battleOver) return;
    const pokemon = playerTeam[playerActive];
    const enemy = enemyTeam[enemyActive];
    const grid = document.getElementById('movesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    pokemon.moves.forEach((moveName, idx) => {
        const move = getMoveInfo(moveName);
        const eff = move.power > 0 ? calculateEffectiveness(move.type, enemy.types) : 1;
        let effBadge = '';
        if (move.power > 0) {
            if (eff >= 4) effBadge = `<span class="effect-badge effect-super">⚡ ×${eff}</span>`;
            else if (eff > 1) effBadge = `<span class="effect-badge effect-super">💥 ×${eff}</span>`;
            else if (eff < 1 && eff > 0) effBadge = `<span class="effect-badge effect-weak">×${eff}</span>`;
            else if (eff === 0) effBadge = `<span class="effect-badge effect-none">×0</span>`;
        }
        const prioTag = (move.priority || 0) > 0 ? `<span class="effect-badge">⚡P</span>` : '';
        const norm = t => t.replace(/[ÉÍÓ]/g, c => ({ 'É': 'E', 'Í': 'I', 'Ó': 'O' }[c]));
        const tc = `mv-${norm(move.type)}`;
        const btn = document.createElement('button');
        btn.className = `move-btn ${tc}`;
        const accLabel = move.accuracy ? `${move.accuracy}%` : '✓';
        btn.innerHTML = `<div class="move-name">${moveName}</div>
            <div class="move-meta">${move.type} • ${move.category === 'physical' ? 'FÍS' : move.category === 'status' ? 'EST' : 'ESP'} • POW:${move.power || '─'} • PRE:${accLabel}</div>
            <div style="display:flex;gap:3px;flex-wrap:wrap;margin-top:2px;">${effBadge}${prioTag}</div>`;
        btn.onclick = () => playerAttack(idx);
        btn.onmouseenter = (e) => showMoveTooltip(e, moveName, pokemon, enemy);
        btn.onmouseleave = () => hideMoveTooltip();
        grid.appendChild(btn);
    });
}

// ─── TRAMPAS / HAZARDS ────────────────────────────────────────────────────────
function renderHazards(side, hazards) {
    const cont = document.getElementById(`${side}HazardsCont`);
    if (!cont) return;

    const currentSpikes = cont.querySelectorAll('.spike').length;
    const targetSpikes = hazards.toxicSpikes || 0;

    if (targetSpikes > currentSpikes) {
        for (let i = currentSpikes; i < targetSpikes; i++) {
            const img = document.createElement('img');
            img.src = 'moves_effect/Toxic_spikes.png';
            img.className = `spike spike-${i}`;
            img.style.animationDelay = `${(i - currentSpikes) * 0.15}s`;
            cont.appendChild(img);
        }
    } else if (targetSpikes < currentSpikes) {
        cont.innerHTML = '';
        for (let i = 0; i < targetSpikes; i++) {
            const img = document.createElement('img');
            img.src = 'moves_effect/Toxic_spikes.png';
            img.className = `spike spike-${i}`;
            cont.appendChild(img);
        }
    }
}

// ─── TOOLTIP DE MOVIMIENTO (solo descripción) ────────────────────────────────
function showMoveTooltip(event, moveName, attacker, defender) {
    const move = getMoveInfo(moveName);
    const tt = document.getElementById('moveTooltip');
    if (!tt || !move.description) return hideMoveTooltip();

    tt.innerHTML = `<div class="tt-name">${moveName}</div>
        <div class="tt-desc">${move.description}</div>`;

    // Posicionar al lado del botón
    const margin = 8;
    const r = event.target.getBoundingClientRect();
    let left = r.right + margin;
    let top = r.top;
    tt.style.display = 'block';
    const tw = tt.offsetWidth, th = tt.offsetHeight;
    if (left + tw > window.innerWidth - margin) left = r.left - tw - margin;
    if (top + th > window.innerHeight - margin) top = window.innerHeight - th - margin;
    if (top < margin) top = margin;
    tt.style.left = left + 'px';
    tt.style.top = top + 'px';
}

function hideMoveTooltip() {
    const tt = document.getElementById('moveTooltip');
    if (tt) tt.style.display = 'none';
}

// calcDmgDet() es la función equivalente al final del archivo

function disableMoves() { document.querySelectorAll('#movesGrid .move-btn').forEach(b => b.disabled = true); }

// ─── LOG ─────────────────────────────────────────────────────────────────────
function addLog(msg, type = '') {
    const body = document.getElementById('logBody');
    if (!body) return;
    const el = document.createElement('div');
    el.className = `log-entry ${type}`;
    el.innerHTML = msg;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    const entries = body.querySelectorAll('.log-entry');
    if (entries.length > 120) entries[0].remove();
}

// ─── ANIMACIONES ─────────────────────────────────────────────────────────────
function animHit(side) {
    const s = document.getElementById(`${side}Sprite`); if (!s) return;
    s.classList.add('anim-hit'); setTimeout(() => s.classList.remove('anim-hit'), 500);
}
function animFaint(side) {
    const s = document.getElementById(`${side}Sprite`); if (!s) return;
    const cls = side === 'player' ? 'anim-faint-player' : 'anim-faint';
    s.classList.add(cls); setTimeout(() => s.classList.remove(cls), 900);
}
function showFullTeam() {
    addLog('━━━━━━━━━━━━━━', 'separator');
    playerTeam.forEach((p, i) => {
        const pct = Math.floor((p.currentHp / p.stats.hp) * 100);
        const ico = p.fainted ? '😵' : i === playerActive ? '⚔️' : '✅';
        addLog(`${ico} ${p.name}: ${Math.floor(p.currentHp)}/${p.stats.hp} HP (${pct}%) SPE:${getEffectiveSpe(p)}`);
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// CALCULADORA DE DAÑO — Modal dentro de battle.html
// ═══════════════════════════════════════════════════════════════════════════

let calcInited = false;
let calcState = {
    P: { moves: [] },
    E: { moves: [] }
};

function openCalcModal() {
    const player = playerTeam[playerActive];
    const enemy = enemyTeam[enemyActive];

    // Al abrir, inicializar el estado del modal con los datos reales del combate si es la primera vez o si han cambiado los pokes
    if (!calcInited || calcState.playerID !== player.id || calcState.enemyID !== enemy.id) {
        calcState = {
            playerID: player.id,
            enemyID: enemy.id,
            P: {
                moves: [...player.moves],
                evs: { ...player.evs }
            },
            E: {
                moves: [...enemy.moves],
                evs: { ...enemy.evs }
            }
        };
    }

    document.getElementById('calcModal').classList.add('open');
    if (!calcInited) { initCalcModal(); calcInited = true; }
    else {
        // Asegurar que los sliders reflejen el estado (por si se abrieron antes)
        ['P', 'E'].forEach(side => renderEVSliders(side));
        calcRecalc();
    }
}
function closeCalcModal() {
    document.getElementById('calcModal').classList.remove('open');
}

function initCalcModal() {
    ['P', 'E'].forEach(side => {
        // Naturalezas e ítems
        const natSel = document.getElementById(`calc${side}Nature`);
        const itmSel = document.getElementById(`calc${side}Item`);
        natSel.innerHTML = '';
        itmSel.innerHTML = '';
        Object.entries(NaturesDB).forEach(([k, n]) => {
            const o = document.createElement('option');
            o.value = k; o.textContent = n.label; natSel.appendChild(o);
        });
        Object.values(ItemsDB).forEach(it => {
            const o = document.createElement('option');
            o.value = it.name; o.textContent = it.name; itmSel.appendChild(o);
        });

        // Inicializar sliders de EVs
        renderEVSliders(side);
    });

    // Cerrar resultados de búsqueda al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cs-search-box')) {
            document.querySelectorAll('.cs-search-results').forEach(r => r.style.display = 'none');
        }
    });

    calcRecalc();
}

function renderEVSliders(side) {
    const cont = document.getElementById(`calc${side}EVs`);
    if (!cont) return;
    const stats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
    const evs = calcState[side].evs;

    cont.innerHTML = stats.map(s => `
        <div class="calc-ev-row">
            <div class="calc-ev-label">${s.toUpperCase()}</div>
            <input type="range" class="calc-ev-slider" min="0" max="252" step="4" 
                   value="${evs[s] || 0}" oninput="updateModalEV('${side}', '${s}', this.value)">
            <div class="calc-ev-val" id="val-ev-${side}-${s}">${evs[s] || 0}</div>
        </div>
    `).join('');
}

function updateModalEV(side, stat, val) {
    calcState[side].evs[stat] = parseInt(val);
    document.getElementById(`val-ev-${side}-${stat}`).textContent = val;
    calcRecalc();
}

function calcSearchMoves(side) {
    const input = document.getElementById(`calc${side}Search`);
    const results = document.getElementById(`calc${side}Results`);
    const query = input.value.toLowerCase().trim();
    if (!query) { results.style.display = 'none'; return; }

    // Obtener el ID del pokemon actual para buscar su learnset
    const pokeID = calcState[`${side === 'P' ? 'playerID' : 'enemyID'}`];
    const learnset = PokemonDB[pokeID]?.learnset || [];

    const matches = Object.keys(MovesDB)
        .filter(m => {
            const isMatch = m.toLowerCase().includes(query);
            const inLearnset = learnset.includes(m);
            return isMatch && inLearnset;
        })
        .slice(0, 10);

    if (matches.length === 0) {
        results.innerHTML = '<div style="color:#64748b; font-style:italic;">No hay coincidencias en el learnset</div>';
        results.style.display = 'block';
        return;
    }

    results.innerHTML = matches.map(m => `<div onclick="assignModalMove('${side}', '${m}')">${m}</div>`).join('');
    results.style.display = 'block';
}

function assignModalMove(side, moveName) {
    if (calcState[side].moves.includes(moveName)) return;
    if (calcState[side].moves.length >= 4) calcState[side].moves.shift();
    calcState[side].moves.push(moveName);
    document.getElementById(`calc${side}Search`).value = '';
    document.getElementById(`calc${side}Results`).style.display = 'none';
    calcRecalc();
}

function removeModalMove(side, idx) {
    calcState[side].moves.splice(idx, 1);
    calcRecalc();
}

function calcRecalc() {
    const player = playerTeam[playerActive];
    const enemy = enemyTeam[enemyActive];
    if (!player || !enemy) return;

    // Leer overrides del modal
    const pNat = document.getElementById('calcPNature')?.value || player.nature;
    const pItm = document.getElementById('calcPItem')?.value || player.item;
    const eNat = document.getElementById('calcENature')?.value || enemy.nature;
    const eItm = document.getElementById('calcEItem')?.value || enemy.item;

    // Sync selects con el estado actual del combate
    const pNatEl = document.getElementById('calcPNature');
    const eNatEl = document.getElementById('calcENature');
    const pItmEl = document.getElementById('calcPItem');
    const eItmEl = document.getElementById('calcEItem');
    if (pNatEl && !calcInited) pNatEl.value = player.nature;
    if (eNatEl && !calcInited) eNatEl.value = enemy.nature;
    if (pItmEl && !calcInited) pItmEl.value = player.item;
    if (eItmEl && !calcInited) eItmEl.value = enemy.item;

    // Clonar Pokémon con overrides y leer boosts del modal
    const pBoosts = {
        atk: parseInt(document.getElementById('calcPAtkBoost')?.value || 0),
        def: parseInt(document.getElementById('calcPDefBoost')?.value || 0),
        spa: parseInt(document.getElementById('calcPSpaBoost')?.value || 0),
        spd: parseInt(document.getElementById('calcPSpdBoost')?.value || 0),
        spe: parseInt(document.getElementById('calcPSpeBoost')?.value || 0)
    };
    const eBoosts = {
        atk: parseInt(document.getElementById('calcEAtkBoost')?.value || 0),
        def: parseInt(document.getElementById('calcEDefBoost')?.value || 0),
        spa: parseInt(document.getElementById('calcESpaBoost')?.value || 0),
        spd: parseInt(document.getElementById('calcESpdBoost')?.value || 0),
        spe: parseInt(document.getElementById('calcESpeBoost')?.value || 0)
    };

    const pCalc = calcMakePoke(player, pNat, pItm, pBoosts, calcState.P.evs, calcState.P.moves);
    const eCalc = calcMakePoke(enemy, eNat, eItm, eBoosts, calcState.E.evs, calcState.E.moves);

    calcRenderCard('Player', pCalc, 'back');
    calcRenderCard('Enemy', eCalc, 'front');
    calcRenderMoveSlots('P');
    calcRenderMoveSlots('E');
    calcRenderMoves('Player', pCalc, eCalc);
    calcRenderMoves('Enemy', eCalc, pCalc);
    calcRenderFooter(pCalc, eCalc);
}

function calcRenderMoveSlots(side) {
    const cont = document.getElementById(`calc${side}MovesSlots`);
    if (!cont) return;
    const moves = calcState[side].moves;

    let html = '';
    for (let i = 0; i < 4; i++) {
        if (moves[i]) {
            html += `<div class="cs-move-slot">
                <span>${moves[i]}</span>
                <span class="cs-remove-move" onclick="removeModalMove('${side}', ${i})">×</span>
            </div>`;
        } else {
            html += `<div class="cs-move-slot empty">Vacío</div>`;
        }
    }
    cont.innerHTML = html;
}

function calcMakePoke(base, nature, item, manualBoosts, evs, moves) {
    const level = base.level || 100;
    const stats = buildStats(PokemonDB[base.id]?.stats || base.stats, evs, level, nature);
    return { ...base, stats, nature, item, currentHp: base.currentHp, manualBoosts, evs, moves };
}

function calcRenderCard(side, pokemon, spriteDir) {
    const el = document.getElementById(`calc${side}Card`);
    if (!el) return;
    const sp = getSpriteUrl(pokemon.id, spriteDir);
    const stats = pokemon.stats;
    el.innerHTML = `
        <img class="cs-sprite" src="${sp}" onerror="onSpriteError(this,${pokemon.id})">
        <div style="flex:1;">
            <div class="cs-poke-name">${pokemon.name}</div>
            <div class="cs-poke-types">${pokemon.types.map(t =>
        `<span class="type-badge type-${t.replace(/[ÉÍÓ]/g, c => ({ 'É': 'E', 'Í': 'I', 'Ó': 'O' }[c]))}">${t}</span>`
    ).join('')}</div>
            <div class="cs-stats">
                <span style="color:#22c55e;">HP ${stats.hp}</span>
                <span style="color:#ef4444;">ATK ${stats.atk}</span>
                <span style="color:#3b82f6;">DEF ${stats.def}</span>
                <span style="color:#a855f7;">SPA ${stats.spa}</span>
                <span style="color:#eab308;">SPD ${stats.spd}</span>
                <span style="color:#ec4899;">SPE ${stats.spe}</span>
            </div>
            <div class="cs-stats" style="margin-top:2px;">
                <span style="color:#a5b4fc;">HAB ${pokemon.ability}</span>
                ${pokemon.item !== 'Ninguno' ? `<span style="color:#fbbf24;">🎒 ${pokemon.item}</span>` : ''}
            </div>
        </div>`;
}

function calcRenderMoves(side, attacker, defender) {
    const cont = document.getElementById(`calc${side}Moves`);
    if (!cont) return;

    // Limitar a los 4 movimientos actuales del Pokémon
    const moves = attacker.moves || [];

    const results = moves.map(moveName => {
        const move = getMoveInfo(moveName);
        if (!move.power || move.category === 'status') {
            return { moveName, move, min: 0, max: 0, eff: 1, isStatus: true };
        }

        // Usar calculateDamage unificado
        const min = calculateDamage(attacker, defender, moveName, 0.85);
        const max = calculateDamage(attacker, defender, moveName, 1.0);
        const eff = calculateEffectiveness(move.type, defender.types);

        return { moveName, move, min, max, eff, isStatus: false };
    }).sort((a, b) => b.max - a.max);

    cont.innerHTML = results.map(({ moveName, move, min, max, eff, isStatus }) => {
        if (isStatus) {
            return `<div class="cm-row" style="opacity:.5;">
                <div class="cm-name">🌀 ${moveName}</div>
                <div class="cm-dmg" style="color:#475569;">—</div>
            </div>`;
        }
        const hpMax = defender.stats.hp;
        const pctMax = Math.round((max / hpMax) * 100);
        const pctMin = Math.round((min / hpMax) * 100);
        const isOHKO = max >= hpMax;
        const is2HKO = min * 2 >= hpMax;
        const barCol = isOHKO ? '#ef4444' : is2HKO ? '#f59e0b' : '#3b82f6';
        const cls = isOHKO ? 'cm-ohko' : is2HKO ? 'cm-2hko' : '';
        let effBadge = '';
        if (eff >= 4) effBadge = `<span class="cm-eff hyper">×${eff}</span>`;
        else if (eff > 1) effBadge = `<span class="cm-eff super">×${eff}</span>`;
        else if (eff < 1 && eff > 0) effBadge = `<span class="cm-eff weak">×${eff}</span>`;
        else if (eff === 0) effBadge = `<span class="cm-eff none">×0</span>`;
        return `<div class="cm-row ${cls}">
            <div style="flex:1;">
                <div style="display:flex;align-items:center;gap:5px;margin-bottom:2px;">
                    <span class="cm-name">${moveName}${isOHKO ? ' <span style="color:#ef4444;font-size:6px;">OHKO</span>' : is2HKO ? ' <span style="color:#f59e0b;font-size:6px;">2HKO</span>' : ''}</span>
                    ${effBadge}
                </div>
                <div class="cm-bar-bg"><div class="cm-bar-fill" style="width:${Math.min(100, pctMax)}%;background:${barCol};"></div></div>
            </div>
            <div class="cm-dmg">
                <div class="cm-dmg-val" style="color:${barCol};">${min}–${max}</div>
                <div class="cm-dmg-pct">${pctMin}–${pctMax}%</div>
            </div>
        </div>`;
    }).join('');
}

function calcRenderFooter(poke, enemy) {
    const footer = document.getElementById('calcFooter');
    if (!footer) return;
    const base = PokemonDB[poke.id];
    const baseE = PokemonDB[enemy.id];
    const movesP = base?.moves || poke.moves || [];
    const movesE = baseE?.moves || enemy.moves || [];

    // Calcular mejor daño usando calculateDamage con factor 1.0 (máximo)
    const bestP = movesP.reduce((b, mv) => {
        const d = calculateDamage(poke, enemy, mv, 1.0);
        return d > b ? d : b;
    }, 0);
    const bestE = movesE.reduce((b, mv) => {
        const d = calculateDamage(enemy, poke, mv, 1.0);
        return d > b ? d : b;
    }, 0);

    const pctP = Math.round((bestP / enemy.stats.hp) * 100);
    const pctE = Math.round((bestE / poke.stats.hp) * 100);

    let verdict;
    if (pctP >= 100 && pctE < 100) verdict = `<span class="calc-verdict cv-player">✅ ${poke.name} GANA</span>`;
    else if (pctE >= 100 && pctP < 100) verdict = `<span class="calc-verdict cv-enemy">❌ ${enemy.name} GANA</span>`;
    else if (pctP >= 100 && pctE >= 100) verdict = `<span class="calc-verdict cv-tie">⚡ AMBOS PUEDEN OHKO</span>`;
    else verdict = `<span class="calc-verdict cv-tie">🤔 Ninguno OHKO</span>`;

    footer.innerHTML = `${verdict}
        <span style="color:#64748b;">🟢 ${poke.name} daño máx: <b style="color:#fbbf24;">${pctP}%</b></span>
        <span style="color:#64748b;">🔴 ${enemy.name} daño máx: <b style="color:#fbbf24;">${pctE}%</b></span>`;
}

// El cálculo se hace directamente con calculateDamage de battle-engine.js
// que ya soporta randomFactor y manualBoosts.
