// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  js/team-builder-main.js  —  CONSTRUCTOR DE EQUIPOS                     ║
// ║  Editor INLINE en el panel derecho (no modal)                            ║
// ║  Datos: data/pokemon.js · data/abilities.js · data/trainers.js          ║
// ╚══════════════════════════════════════════════════════════════════════════╝

let playerTeam = [];
let savedTeams = {};
let currentEditId = null;
let currentTab = 'moves';
let battleLevel = 100;
let activeTypeFilter = '';

const StatColors = { hp: '#22c55e', atk: '#ef4444', def: '#3b82f6', spa: '#a855f7', spd: '#eab308', spe: '#ec4899' };
const StatLabels = { hp: 'HP', atk: 'ATK', def: 'DEF', spa: 'SPA', spd: 'SPD', spe: 'SPE' };

const TYPE_LIST = [
    ['NORMAL', '#6b7280'], ['FUEGO', '#dc2626'], ['AGUA', '#2563eb'], ['PLANTA', '#16a34a'],
    ['ELÉCTRICO', '#ca8a04'], ['HIELO', '#0891b2'], ['LUCHA', '#c2410c'], ['VENENO', '#7c3aed'],
    ['TIERRA', '#92400e'], ['VOLADOR', '#4f46e5'], ['PSÍQUICO', '#db2777'], ['BICHO', '#4d7c0f'],
    ['ROCA', '#a16207'], ['FANTASMA', '#7e22ce'], ['DRAGÓN', '#4338ca'], ['SINIESTRO', '#374151'],
    ['ACERO', '#64748b'], ['HADA', '#ec4899']
];

// ─── INIT ─────────────────────────────────────────────────────────────────────
function init() {
    loadSavedTeams();
    const auto = localStorage.getItem('kantoTeam') || localStorage.getItem('savedTeam');
    if (auto) {
        try { playerTeam = JSON.parse(auto).map(normalizeEntry).filter(Boolean); } catch (e) { }
    }
    renderAll();
    renderTypeFilters();
}

function renderTypeFilters() {
    const row = document.getElementById('typeFilterRow');
    if (!row) return;
    row.innerHTML = '<span class="filter-label">Tipo:</span>';
    TYPE_LIST.forEach(([t, color]) => {
        const btn = document.createElement('button');
        btn.className = 'type-filter-btn';
        btn.dataset.type = t;
        btn.style.background = color;
        btn.textContent = t.charAt(0) + t.slice(1).toLowerCase();
        btn.onclick = () => setTypeFilter(t);
        row.appendChild(btn);
    });
}

function setTypeFilter(type) {
    if (activeTypeFilter === type) activeTypeFilter = '';
    else activeTypeFilter = type;
    document.querySelectorAll('.type-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === activeTypeFilter);
    });
    renderAvailable();
}

function clearAllFilters() {
    activeTypeFilter = '';
    document.querySelectorAll('.type-filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('pokeSearch').value = '';
    document.getElementById('sortStat').value = 'id';
    document.getElementById('sortOrder').value = 'asc';
    document.getElementById('statFilterStat').value = '';
    document.getElementById('statFilterMin').value = '0';
    renderAvailable();
}

function normalizeEntry(e) {
    const base = PokemonDB[e.id];
    if (!base) return null;
    const defAb = (base.abilities && base.abilities[0]) || base.ability || '';
    return {
        id: e.id,
        item: e.item || 'Ninguno',
        nature: e.nature || 'Seria',
        ability: e.ability || defAb,
        moves: (e.moves && e.moves.length) ? e.moves : [...base.moves],
        evs: e.evs || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    };
}

// ─── RENDER PRINCIPAL ─────────────────────────────────────────────────────────
function renderAll() {
    renderTeamSlots();
    renderTebSlots();
    const q = document.getElementById("pokeSearch")?.value || ""; renderAvailable(q);
    checkSaved();
    if (currentEditId !== null) renderEditor();
}

function renderAvailable() {
    const grid = document.getElementById('pokemonGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const query = document.getElementById("pokeSearch")?.value.toLowerCase().trim() || "";
    const sortStat = document.getElementById("sortStat")?.value || "id";
    const sortOrder = document.getElementById("sortOrder")?.value || "desc";
    const minStatKey = document.getElementById("statFilterStat")?.value || "";
    const minStatVal = parseInt(document.getElementById("statFilterMin")?.value || "0");

    let list = Object.values(PokemonDB);

    // 1. Filtrar por nombre / ID
    if (query) {
        list = list.filter(p =>
            p.name.toLowerCase().includes(query) ||
            String(p.id).includes(query)
        );
    }

    // 2. Filtrar por tipo
    if (activeTypeFilter) {
        list = list.filter(p => p.types.includes(activeTypeFilter));
    }

    // 3. Filtrar por estadísticas mínimas
    if (minStatKey) {
        list = list.filter(p => {
            const val = minStatKey === 'bst' ?
                Object.values(p.stats).reduce((a, b) => a + b, 0) :
                p.stats[minStatKey];
            return val >= minStatVal;
        });
    }

    const totalResults = list.length;
    const countEl = document.getElementById('searchCount');
    if (countEl) countEl.textContent = `${totalResults} Pokémon`;

    // 4. Ordenar
    list.sort((a, b) => {
        let valA, valB;
        if (sortStat === 'id') {
            valA = a.id; valB = b.id;
        } else if (sortStat === 'name') {
            valA = a.name.toLowerCase(); valB = b.name.toLowerCase();
        } else if (sortStat === 'bst') {
            valA = Object.values(a.stats).reduce((sum, s) => sum + s, 0);
            valB = Object.values(b.stats).reduce((sum, s) => sum + s, 0);
        } else {
            valA = a.stats[sortStat];
            valB = b.stats[sortStat];
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    list.forEach(p => {
        const inTeam = playerTeam.some(t => t.id === p.id);
        const bst = Object.values(p.stats).reduce((sum, s) => sum + s, 0);
        const card = document.createElement('div');
        card.className = `poke-card${inTeam ? ' in-team' : ''}`;
        card.dataset.id = p.id;
        card.onclick = () => inTeam ? null : addToTeam(p.id);
        const sp = getSpriteUrl(p.id, 'front');
        card.innerHTML = `
            <button class="poke-info-btn" title="Ver info" onclick="event.stopPropagation();openPreview(${p.id})">ℹ</button>
            <img src="${sp}" alt="${p.name}" onerror="onSpriteError(this, p.id)">
            <div class="poke-name">${p.name}</div>
            <div style="font-size:10px; color:var(--t-gold); margin-top:2px; font-weight:bold;">BST: ${bst}</div>
            <div class="poke-types">${p.types.map(t => `<span class="type-badge ${TypeColors[t] || 'type-NORMAL'}">${t}</span>`).join('')}</div>`;
        grid.appendChild(card);
    });
}

function renderTeamSlots() {
    const c = document.getElementById('teamSlots');
    if (!c) return;
    c.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const slot = document.createElement('div');
        slot.draggable = i < playerTeam.length;
        if (i < playerTeam.length) {
            const e = playerTeam[i];
            const p = PokemonDB[e.id];
            const nat = NaturesDB[e.nature];
            slot.className = `team-slot filled${currentEditId === i ? ' editing' : ''}`;
            slot.onclick = () => openEditor(i);
            slot.ondragstart = (ev) => ev.dataTransfer.setData('text/plain', i);
            slot.ondragover = (ev) => ev.preventDefault();
            slot.ondrop = (ev) => {
                ev.preventDefault();
                const fromIdx = parseInt(ev.dataTransfer.getData('text/plain'));
                reorderTeam(fromIdx, i);
            };
            slot.innerHTML = `
                <img src="${getSpriteUrl(e.id, 'front')}" onerror="onSpriteError(this, e.id)">
                <div class="slot-remove" onclick="event.stopPropagation();removeFromTeam(${i})">×</div>
                ${nat && nat.up ? `<div class="slot-nature-badge" style="background:${nat.color || '#374151'}">${nat.label}</div>` : ''}
                ${e.item !== 'Ninguno' ? '<div class="slot-item-dot"></div>' : ''}`;
        } else {
            slot.className = 'team-slot';
            slot.innerHTML = '<div class="slot-empty-icon">+</div>';
            slot.ondragover = (ev) => ev.preventDefault();
            slot.ondrop = (ev) => {
                ev.preventDefault();
                const fromIdx = parseInt(ev.dataTransfer.getData('text/plain'));
                reorderTeam(fromIdx, Math.min(playerTeam.length - 1, i));
            };
        }
        c.appendChild(slot);
    }
    const n = playerTeam.length;
    document.getElementById('teamCount').textContent = n;
    document.getElementById('minWarning').textContent = n < 3 ? 'mín. 3' : '';
    document.getElementById('battleBtn').disabled = n < 3;
}

// Barra de sprites grande encima del editor
function renderTebSlots() {
    const bar = document.getElementById('teamEditorBar');
    const wrap = document.getElementById('tebSlots');
    if (!bar || !wrap) return;
    if (!playerTeam.length) { bar.classList.remove('visible'); return; }
    bar.classList.add('visible');
    wrap.innerHTML = '';
    playerTeam.forEach((e, i) => {
        const p = PokemonDB[e.id];
        const slot = document.createElement('div');
        slot.className = `teb-slot${currentEditId === i ? ' active' : ''}`;
        slot.draggable = true;
        slot.onclick = () => openEditor(i);
        slot.ondragstart = (ev) => ev.dataTransfer.setData('text/plain', i);
        slot.ondragover = (ev) => ev.preventDefault();
        slot.ondrop = (ev) => {
            ev.preventDefault();
            const fromIdx = parseInt(ev.dataTransfer.getData('text/plain'));
            reorderTeam(fromIdx, i);
        };
        slot.innerHTML = `
            <img src="${getSpriteUrl(e.id, 'front')}" alt="${p.name}" onerror="onSpriteError(this, e.id)">
            <div class="teb-slot-name">${p.name}</div>
        `;
        wrap.appendChild(slot);
    });
}

function reorderTeam(fromIdx, toIdx) {
    if (fromIdx === toIdx) return;
    const item = playerTeam.splice(fromIdx, 1)[0];
    playerTeam.splice(toIdx, 0, item);
    // Cambiar el currentEditId si es necesario
    if (currentEditId === fromIdx) currentEditId = toIdx;
    else if (fromIdx < currentEditId && toIdx >= currentEditId) currentEditId--;
    else if (fromIdx > currentEditId && toIdx <= currentEditId) currentEditId++;
    renderAll();
}

// ─── AÑADIR / QUITAR DEL EQUIPO ───────────────────────────────────────────────
function addToTeam(pokemonId) {
    if (playerTeam.length >= 6) { showToast('⚠️ Equipo lleno'); return; }
    if (playerTeam.some(p => p.id === pokemonId)) { showToast('⚠️ Ya en el equipo'); return; }
    playerTeam.push(normalizeEntry({ id: pokemonId }));
    renderAll();
    showToast(`✅ ${PokemonDB[pokemonId].name} añadido`);
}

function removeFromTeam(index) {
    const name = PokemonDB[playerTeam[index].id].name;
    playerTeam.splice(index, 1);
    if (currentEditId === index || currentEditId >= playerTeam.length) { currentEditId = null; closeEditor(); }
    renderAll();
    showToast(`❌ ${name} eliminado`);
}

// ─── EDITOR INLINE ────────────────────────────────────────────────────────────
function openEditor(index) {
    currentEditId = index;
    currentTab = 'moves';

    // Ocultar paneles de modo, mostrar editor inline
    const inl = document.getElementById('editorInline');
    const mps = document.getElementById('modePanels');
    if (inl) inl.classList.add('visible');
    if (mps) mps.style.display = 'none';

    renderTeamSlots();
    renderTebSlots();
    renderEditor();
}

function closeEditor() {
    currentEditId = null;
    const inl = document.getElementById('editorInline');
    const mps = document.getElementById('modePanels');
    if (inl) inl.classList.remove('visible');
    if (mps) mps.style.display = '';
    renderTeamSlots();
    renderTebSlots();
}

function switchTab(tab) { currentTab = tab; renderEditor(); }

function renderEditor() {
    if (currentEditId === null) return;
    const entry = playerTeam[currentEditId];
    const pData = PokemonDB[entry.id];
    const ab = AbilitiesDB[entry.ability];
    const lvl = battleLevel;

    // Header del editor
    const sp = getSpriteUrl(pData.id, 'front');
    const sEl = document.getElementById('eiSprite');
    if (sEl) { sEl.src = sp; sEl.onerror = () => onSpriteError(sEl, pData.id); }
    const nEl = document.getElementById('eiName'); if (nEl) nEl.textContent = pData.name;
    const tEl = document.getElementById('eiTypes'); if (tEl) tEl.innerHTML = pData.types.map(t => `<span class="type-badge ${TypeColors[t] || 'type-NORMAL'}">${t}</span>`).join('');
    const aEl = document.getElementById('eiAbility'); if (aEl) aEl.textContent = ab ? `${ab.icon} ${entry.ability}` : '';

    // Pestañas
    ['summary', 'moves', 'nature', 'ability', 'item'].forEach(t => {
        const el = document.getElementById(`tab-${t}`);
        if (el) el.className = 'ei-tab' + (t === currentTab ? ' active' : '');
    });

    const body = document.getElementById('eiBody');
    if (!body) return;

    // ══ RESUMEN / INFO ═══════════════════════════════════════════════════════
    if (currentTab === 'summary') {
        const nat = NaturesDB[entry.nature] || {};
        const ab = AbilitiesDB[entry.ability];
        const item = ItemsDB[entry.item] || {};
        const totalEVs = Object.values(entry.evs).reduce((a, b) => a + b, 0);
        const lvl = battleLevel;

        // Stats calculadas
        const statColors = { hp: '#22c55e', atk: '#ef4444', def: '#3b82f6', spa: '#a855f7', spd: '#eab308', spe: '#ec4899' };
        const statLabels = { hp: 'HP', atk: 'ATK', def: 'DEF', spa: 'SPA', spd: 'SPD', spe: 'SPE' };
        const calcFinalStat = (s) => {
            const base = pData.stats[s];
            const ev = entry.evs[s] || 0;
            const nm = nat.up === s ? 1.1 : nat.down === s ? 0.9 : 1.0;
            return s === 'hp'
                ? Math.floor(((2 * base + 31 + Math.floor(ev / 4)) * lvl) / 100) + lvl + 10
                : Math.floor((Math.floor(((2 * base + 31 + Math.floor(ev / 4)) * lvl) / 100) + 5) * nm);
        };

        const statsHtml = Object.keys(statLabels).map(s => {
            const val = calcFinalStat(s);
            const base = pData.stats[s];
            const ev = entry.evs[s] || 0;
            const natMark = nat.up === s ? '↑' : nat.down === s ? '↓' : '';
            const barW = Math.min(100, Math.round((val / 255) * 100));
            return `<div style="margin-bottom:5px;">
                <div style="display:flex;justify-content:space-between;font-size:6px;margin-bottom:2px;">
                    <span style="color:${statColors[s]};">${statLabels[s]}${natMark}</span>
                    <span style="color:#94a3b8;">${base} base${ev ? ' +' + ev + ' EV' : ''} = <b style="color:white;">${val}</b></span>
                </div>
                <div style="height:4px;background:#1e293b;border-radius:2px;overflow:hidden;">
                    <div style="width:${barW}%;height:100%;background:${statColors[s]};border-radius:2px;"></div>
                </div>
            </div>`;
        }).join('');

        const movesHtml = entry.moves.map(mv => {
            const m = getMoveInfo(mv);
            const acc = m.accuracy ? `${m.accuracy}%` : '✓';
            const norm = t => t.replace(/[ÉÍÓ]/g, c => ({ 'É': 'E', 'Í': 'I', 'Ó': 'O' }[c]));
            return `<div class="mv-${norm(m.type || 'NORMAL')}" style="background:#111827;border-radius:4px;padding:5px 8px;margin-bottom:3px;border-left:3px solid transparent;">
                <span style="font-size:7px;">${mv}</span>
                <span style="font-size:5.5px;color:#64748b;margin-left:6px;">${m.type} · ${m.category === 'physical' ? 'FÍS' : m.category === 'status' ? 'EST' : 'ESP'} · POW:${m.power || '—'} · PRE:${acc}</span>
            </div>`;
        }).join('');

        body.innerHTML = `
            <!-- STATS -->
            <div style="font-size:7px;color:var(--gold);margin-bottom:8px;">📊 STATS — Nivel ${lvl}</div>
            ${statsHtml}

            <div style="height:1px;background:#1e293b;margin:10px 0;"></div>

            <!-- MOVIMIENTOS -->
            <div style="font-size:7px;color:var(--gold);margin-bottom:6px;">⚔️ MOVIMIENTOS (${entry.moves.length}/4)</div>
            ${movesHtml}

            <div style="height:1px;background:#1e293b;margin:10px 0;"></div>

            <!-- NATURALEZA + OBJETO + HABILIDAD -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:6.5px;">
                <div style="background:#111827;border:1px solid #1e293b;border-radius:6px;padding:8px;">
                    <div style="color:var(--gold);margin-bottom:4px;">🌿 NATURALEZA</div>
                    <div style="color:white;">${nat.label || entry.nature}</div>
                    ${nat.up ? `<div style="color:#22c55e;font-size:5.5px;margin-top:2px;">↑ ${nat.up.toUpperCase()}</div>` : ''}
                    ${nat.down ? `<div style="color:#ef4444;font-size:5.5px;">↓ ${nat.down.toUpperCase()}</div>` : ''}
                </div>
                <div style="background:#111827;border:1px solid #1e293b;border-radius:6px;padding:8px;">
                    <div style="color:var(--gold);margin-bottom:4px;">🎒 OBJETO</div>
                    <div style="color:white;">${item.iconFallback || ''} ${entry.item}</div>
                    ${item.description ? `<div style="color:#475569;font-size:5px;margin-top:2px;">${item.description}</div>` : ''}
                </div>
                <div style="background:#111827;border:1px solid #1e293b;border-radius:6px;padding:8px;grid-column:1/-1;">
                    <div style="color:var(--gold);margin-bottom:4px;">✨ HABILIDAD</div>
                    <div style="color:white;">${ab ? ab.icon + ' ' : ''} ${entry.ability}</div>
                    ${ab ? `<div style="color:#a5b4fc;font-size:5.5px;margin-top:2px;">${ab.description}</div>` : ''}
                </div>
            </div>
            <div style="font-size:5.5px;color:#334155;margin-top:8px;text-align:center;">
                EVs totales: ${totalEVs}/510
            </div>`;
        return;
    }

    // ══ MOVIMIENTOS ══════════════════════════════════════════════════════════
    if (currentTab === 'moves') {
        const ls = pData.learnset || pData.moves;
        const ok = entry.moves.length === 4;
        body.innerHTML = `
            <div class="moves-count-badge ${ok ? 'moves-count-ok' : 'moves-count-warn'}" id="movesCountBadge">
                ${entry.moves.length}/4 ${ok ? '✓' : '— elige exactamente 4'}
            </div>
            <div class="moves-grid" id="movesSelector">${buildMoveGrid(ls, entry.moves)}</div>
            <div class="editor-hint">📁 learnset → <code>data/pokemon.js</code> · movimientos → <code>data/moves.js</code></div>`;
    }

    // ══ NATURALEZA + EVs ═════════════════════════════════════════════════════
    else if (currentTab === 'nature') {
        const totalEVs = Object.values(entry.evs).reduce((a, b) => a + b, 0);

        const natGrid = Object.entries(NaturesDB).map(([k, n]) => {
            const sel = k === entry.nature;
            const up = n.up ? `<span style="color:#22c55e;font-size:5.5px;">↑${n.up.toUpperCase()}</span>` : '';
            const down = n.down ? `<span style="color:#ef4444;font-size:5.5px;"> ↓${n.down.toUpperCase()}</span>` : '';
            const neu = !n.up ? `<span style="color:#334155;font-size:5.5px;"> —</span>` : '';
            return `<div class="nature-option${sel ? ' selected' : ''}" onclick="selectNature('${k}')">${n.label} ${up}${down}${neu}</div>`;
        }).join('');

        // Stats calculadas con fórmula oficial para mostrar preview
        const statRows = Object.keys(StatLabels).map(s =>
            buildStatRow(s, StatLabels[s], pData.stats[s], entry.evs[s], entry.nature, lvl)
        ).join('');

        body.innerHTML = `
            <div style="font-size:7.5px;color:var(--gold);margin-bottom:8px;">🌿 NATURALEZA</div>
            <div class="nature-grid">${natGrid}</div>
            <div style="height:1px;background:#1e293b;margin:12px 0;"></div>
            <div style="font-size:7.5px;color:var(--gold);margin-bottom:6px;">
                📊 EVs
                <span class="evs-total ${totalEVs > 510 ? 'over' : 'ok'}" style="margin-left:8px;">${totalEVs}/510</span>
                <span style="font-size:5.5px;color:#475569;margin-left:6px;">Nvl ${lvl} · IV 31</span>
            </div>
            <div>${statRows}</div>
            <button onclick="resetEVs()" style="margin-top:8px;width:100%;padding:6px;background:#1e293b;border:1px solid #334155;color:#94a3b8;border-radius:4px;cursor:pointer;font-family:'Courier New',Courier,monospace;font-size:6px;">🔄 RESET EVs</button>
            <div class="editor-hint">Cada 4 EVs = +1 stat · máx 252/stat · total 510</div>`;
    }

    // ══ HABILIDAD + OBJETO ═══════════════════════════════════════════════════
    else if (currentTab === 'item') {
        const avail = pData.abilities || [pData.ability];
        const abilHtml = avail.map(abName => {
            const ad = AbilitiesDB[abName];
            const sel = entry.ability === abName;
            const esc = abName.replace(/'/g, "\\'");
            return `<div class="item-option${sel ? ' selected' : ''}" onclick="selectAbility('${esc}')">
                <span class="item-icon">${ad ? ad.icon : '❓'}</span>
                <div>
                    <div class="item-option-name">${abName}</div>
                    <div class="item-option-desc">${ad ? ad.description : ''}</div>
                </div>
                ${sel ? '<span style="margin-left:auto;color:var(--gold);">✓</span>' : ''}
            </div>`;
        }).join('');

        const itemsHtml = Object.values(ItemsDB).map(item => {
            const sel = entry.item === item.name;
            const esc = item.name.replace(/'/g, "\\'");
            return `<div class="item-option${sel ? ' selected' : ''}" onclick="selectItem('${esc}')">
                <span class="item-icon">${item.iconFallback || '🎒'}</span>
                <div>
                    <div class="item-option-name">${item.name}</div>
                    <div class="item-option-desc">${item.description || ''}</div>
                </div>
                ${sel ? '<span style="margin-left:auto;color:var(--gold);">✓</span>' : ''}
            </div>`;
        }).join('');

        body.innerHTML = `
            <div style="font-size:7.5px;color:var(--gold);margin-bottom:8px;">🌟 HABILIDAD PASIVA (máx. 2 por Pokémon)</div>
            <div class="items-list" style="margin-bottom:10px;">${abilHtml}</div>
            <div class="editor-hint" style="margin-bottom:12px;">
                📁 Añadir habilidades → <code>data/abilities.js</code> · asignar → <code>data/pokemon.js</code> (campo <code>abilities:[]</code>) · lógica → <code>js/battle-engine.js</code>
            </div>
            <div style="height:1px;background:#1e293b;margin-bottom:12px;"></div>
            <div style="font-size:7.5px;color:var(--gold);margin-bottom:8px;">🎒 OBJETO EQUIPADO</div>
            <div class="items-list">${itemsHtml}</div>`;
    }
}

// ─── GRID DE MOVIMIENTOS ──────────────────────────────────────────────────────
function buildMoveGrid(learnset, selectedMoves) {
    return learnset.map(moveName => {
        const move = getMoveInfo(moveName);
        const sel = selectedMoves.includes(moveName);
        const norm = t => t.replace(/[ÉÍÓÚÜ]/g, c => ({ 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ü': 'U' }[c]));
        const tc = `mv-${norm(move.type)}`;
        const esc = moveName.replace(/'/g, "\\'");
        return `<div class="move-option${sel ? ' selected' : ''} ${tc}" onclick="toggleMove('${esc}')" title="${move.description || ''}">
            <div class="mo-name">${moveName}</div>
            <div class="mo-meta">${move.type} · ${move.category === 'physical' ? 'FÍS' : move.category === 'status' ? 'EST' : 'ESP'} · ${move.power || '—'}</div>
            ${move.description ? `<div class="mo-desc">${move.description}</div>` : ''}
        </div>`;
    }).join('');
}

function toggleMove(moveName) {
    if (currentEditId === null) return;
    const entry = playerTeam[currentEditId];
    const idx = entry.moves.indexOf(moveName);
    if (idx !== -1) {
        if (entry.moves.length <= 1) { showToast('⚠️ Mínimo 1 movimiento'); return; }
        entry.moves.splice(idx, 1);
    } else {
        if (entry.moves.length >= 4) { showToast('⚠️ Máximo 4 movimientos'); return; }
        entry.moves.push(moveName);
    }
    const sel = document.getElementById('movesSelector');
    const bdg = document.getElementById('movesCountBadge');
    if (sel) sel.innerHTML = buildMoveGrid(PokemonDB[entry.id].learnset || PokemonDB[entry.id].moves, entry.moves);
    if (bdg) {
        const ok = entry.moves.length === 4;
        bdg.className = `moves-count-badge ${ok ? 'moves-count-ok' : 'moves-count-warn'}`;
        bdg.textContent = `${entry.moves.length}/4 ${ok ? '✓' : '— elige exactamente 4'}`;
    }
}

// ─── STAT ROW (muestra stats calculadas con fórmula oficial) ──────────────────
function buildStatRow(stat, label, base, evVal, natureName, lvl) {
    // Calcular stat final con fórmula oficial
    const nat = NaturesDB[natureName] || {};
    const natMult = nat.up === stat ? 1.1 : nat.down === stat ? 0.9 : 1.0;
    const ev = evVal || 0;
    const finalStat = stat === 'hp'
        ? Math.floor(((2 * base + 31 + Math.floor(ev / 4)) * lvl) / 100) + lvl + 10
        : Math.floor((Math.floor(((2 * base + 31 + Math.floor(ev / 4)) * lvl) / 100) + 5) * natMult);
    const bonus = Math.floor(ev / 4);
    const pct = (ev / 252) * 100;
    const col = StatColors[stat];
    const natTag = nat.up === stat ? '<span style="color:#22c55e">↑</span>'
        : nat.down === stat ? '<span style="color:#ef4444">↓</span>' : '';
    return `<div class="stat-row" data-stat="${stat}">
        <div class="stat-label-row">
            <span style="color:${col};">${label} ${natTag}</span>
            <span style="color:#64748b;">${base}<span class="stat-ev-label" style="font-size:5px;">+${bonus}EV</span>=<b class="stat-final-val" style="color:white;">${finalStat}</b></span>
        </div>
        <div class="stat-controls">
            <button class="stat-btn" onclick="adjustEV('${stat}',-4)">−</button>
            <input type="range" class="stat-slider" data-stat="${stat}" min="0" max="252" step="4" value="${ev}"
                   oninput="setEV('${stat}',this.value)" style="flex:1;cursor:pointer;">
            <button class="stat-btn" onclick="adjustEV('${stat}',4)">+</button>
        </div>
        <div class="stat-bar-bg"><div class="stat-bar-fill" style="width:${pct}%;background:${col};"></div></div>
        <div class="stat-evs">${ev} EVs → stat ${finalStat}</div>
    </div>`;
}

// ─── SELECTORES ───────────────────────────────────────────────────────────────
function selectNature(key) { if (currentEditId !== null) { playerTeam[currentEditId].nature = key; renderEditor(); } }
function selectAbility(name) { if (currentEditId !== null) { playerTeam[currentEditId].ability = name; renderEditor(); } }
function selectItem(name) { if (currentEditId !== null) { playerTeam[currentEditId].item = name; renderEditor(); } }

function adjustEV(stat, amt) {
    if (currentEditId === null) return;
    const e = playerTeam[currentEditId];
    const nv = Math.max(0, Math.min(252, e.evs[stat] + amt));
    const tot = Object.values(e.evs).reduce((a, b) => a + b, 0) - e.evs[stat] + nv;
    if (tot > 510) { showToast('⚠️ Máximo 510 EVs totales'); return; }
    e.evs[stat] = nv;
    renderEditor();
}

function setEV(stat, val) {
    if (currentEditId === null) return;
    const e = playerTeam[currentEditId];
    const nv = Math.round(parseInt(val) / 4) * 4; // snap a múltiplo de 4
    const tot = Object.values(e.evs).reduce((a, b) => a + b, 0) - e.evs[stat] + nv;
    if (tot > 510) {
        // revertir el slider al valor actual sin re-render
        const slider = document.querySelector(`.stat-slider[data-stat="${stat}"]`);
        if (slider) slider.value = e.evs[stat];
        showToast('⚠️ Máximo 510 EVs totales');
        return;
    }
    e.evs[stat] = nv;
    // Actualizar UI sin reconstruir el DOM — solo los elementos que cambian
    updateStatRowInPlace(stat);
}

// Actualiza un stat-row sin reconstruir todo el editor
function updateStatRowInPlace(stat) {
    if (currentEditId === null) return;
    const entry = playerTeam[currentEditId];
    const pData = PokemonDB[entry.id];
    if (!pData) return;
    const lvl = battleLevel;
    const nat = NaturesDB[entry.nature] || {};
    const ev = entry.evs[stat] || 0;
    const base = pData.stats[stat];
    const nm = nat.up === stat ? 1.1 : nat.down === stat ? 0.9 : 1.0;
    const finalStat = stat === 'hp'
        ? Math.floor(((2 * base + 31 + Math.floor(ev / 4)) * lvl) / 100) + lvl + 10
        : Math.floor((Math.floor(((2 * base + 31 + Math.floor(ev / 4)) * lvl) / 100) + 5) * nm);
    const bonus = Math.floor(ev / 4);
    const pct = (ev / 252) * 100;

    // Actualizar texto
    const row = document.querySelector(`.stat-row[data-stat="${stat}"]`);
    if (!row) return;
    const valEl = row.querySelector('.stat-final-val');
    const evEl = row.querySelector('.stat-ev-label');
    const barEl = row.querySelector('.stat-bar-fill');
    const evLbl = row.querySelector('.stat-evs');
    if (valEl) valEl.textContent = finalStat;
    if (evEl) evEl.textContent = `+${bonus}EV`;
    if (barEl) barEl.style.width = pct + '%';
    if (evLbl) evLbl.textContent = `${ev} EVs → stat ${finalStat}`;

    // Actualizar total EVs
    const total = Object.values(entry.evs).reduce((a, b) => a + b, 0);
    const totEl = document.getElementById('evTotal');
    if (totEl) totEl.textContent = `${total}/510 EVs totales`;
}

function resetEVs() {
    if (currentEditId === null) return;
    playerTeam[currentEditId].evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
    renderEditor();
    showToast('🔄 EVs reseteados');
}

function onLevelChange(val) {
    battleLevel = Math.min(100, Math.max(1, parseInt(val) || 100));
    document.getElementById('levelInput').value = battleLevel;
    if (currentEditId !== null) renderEditor(); // actualiza preview de stats
}

function saveEditorChanges() {
    if (currentEditId === null) return;
    if (playerTeam[currentEditId].moves.length !== 4) { showToast('⚠️ Necesitas exactamente 4 movimientos'); return; }
    closeEditor();
    renderAll();
    showToast('✅ Cambios guardados');
}

// ─── PANELES DE MODO ──────────────────────────────────────────────────────────
function showPanel(which) {
    // Cerrar editor inline si estaba abierto
    if (currentEditId !== null) { currentEditId = null; document.getElementById('editorInline')?.classList.remove('visible'); }

    const mps = document.getElementById('modePanels');
    if (mps) mps.style.display = '';

    document.getElementById('trainerPanel')?.classList.toggle('visible', which === 'trainer');
    document.getElementById('wildPanel')?.classList.toggle('visible', which === 'wild');
    document.getElementById('rightPlaceholder').style.display = 'none';

    if (which === 'trainer') renderTrainerGrid();
}

function renderTrainerGrid() {
    const grid = document.getElementById('trainerGrid');
    if (!grid || typeof TrainersDB === 'undefined') return;
    grid.innerHTML = Object.values(TrainersDB).map(t => {
        const previews = t.team.slice(0, 6).map(te => {
            const b = PokemonDB[te.id];
            if (!b) return '';
            const sp = getSpriteUrl(te.id, 'front');
            return `<img src="${sp}" title="${b.name}" onerror="onSpriteError(this, te.id)">`;
        }).join('');
        return `<div class="trainer-card" style="border-color:${t.color}" onclick="goToTrainer('${t.id}')">
            <div class="trainer-avatar">${t.avatar}</div>
            <div class="trainer-name" style="color:${t.color}">${t.name}</div>
            <div class="trainer-title">${t.title}</div>
            <div class="trainer-team-preview">${previews}</div>
        </div>`;
    }).join('');
}

// ─── NAVEGACIÓN A BATALLA ─────────────────────────────────────────────────────
function goToOnlineBattle() {
    if (playerTeam.length < 1) { showToast('⚠️ Añade al menos 1 Pokémon al equipo'); return; }
    const json = JSON.stringify(playerTeam);
    try { localStorage.setItem('kantoTeam', json); sessionStorage.setItem('kantoTeam', json); } catch (e) { }
    window.location.href = `battle.html?mp=1&level=${battleLevel}`;
}
function goToBattle() {
    if (playerTeam.length < 3) { showToast('⚠️ Mínimo 3 Pokémon'); return; }
    launchBattle('');
}
function goToTrainer(id) {
    if (playerTeam.length < 3) { showToast('⚠️ Mínimo 3 Pokémon'); return; }
    launchBattle(`&trainer=${id}`);
}
function goToWild(diff) {
    // Modo salvaje no necesita equipo propio
    const json = JSON.stringify(playerTeam.length ? playerTeam : []);
    const base = `battle.html?wild=${diff}&level=${battleLevel}`;
    window.location.href = base;
}
function launchBattle(extra) {
    const json = JSON.stringify(playerTeam);
    try { localStorage.setItem('kantoTeam', json); sessionStorage.setItem('kantoTeam', json); } catch (e) { }
    window.location.href = `battle.html?team=${encodeURIComponent(json)}&level=${battleLevel}${extra}`;
}

// ─── GUARDAR / CARGAR ─────────────────────────────────────────────────────────
function loadSavedTeams() {
    try { savedTeams = JSON.parse(localStorage.getItem('savedTeams') || '{}'); } catch (e) { savedTeams = {}; }
}
function saveTeam() {
    if (!playerTeam.length) { showToast('⚠️ Equipo vacío'); return; }
    const name = prompt('Nombre para este equipo:', `Equipo ${Object.keys(savedTeams).length + 1}`);
    if (!name) return;
    savedTeams[name] = JSON.parse(JSON.stringify(playerTeam));
    localStorage.setItem('savedTeams', JSON.stringify(savedTeams));
    localStorage.setItem('kantoTeam', JSON.stringify(playerTeam));
    checkSaved();
    showToast(`💾 "${name}" guardado`);
}
function openSavedTeamsModal() {
    renderSavedTeamsList();
    document.getElementById('savedTeamsModal')?.classList.add('open');
}
function closeSavedTeamsModal() {
    document.getElementById('savedTeamsModal')?.classList.remove('open');
}
function renderSavedTeamsList() {
    const list = document.getElementById('savedTeamsList');
    const keys = Object.keys(savedTeams);
    if (!keys.length) { list.innerHTML = '<div style="font-size:8px;color:#475569;text-align:center;padding:20px;">Sin equipos guardados</div>'; return; }
    list.innerHTML = keys.map(name => {
        const team = savedTeams[name];
        const sps = team.map(e => {
            const sp = getSpriteUrl(e.id, 'front');
            return `<img src="${sp}" style="width:30px;height:30px;image-rendering:pixelated;" onerror="onSpriteError(this, e.id)">`;
        }).join('');
        const esc = name.replace(/'/g, "\\'");
        return `<div class="saved-team-row">
            <div class="saved-team-sprites">${sps}</div>
            <div class="saved-team-name">${name}</div>
            <div class="saved-team-actions">
                <button class="stm-btn load" onclick="loadTeamByName('${esc}')">📂 Cargar</button>
                <button class="stm-btn del"  onclick="deleteTeamByName('${esc}')">🗑</button>
            </div>
        </div>`;
    }).join('');
}
function loadTeamByName(name) {
    if (!savedTeams[name]) return;
    playerTeam = savedTeams[name].map(normalizeEntry).filter(Boolean);
    currentEditId = null;
    renderAll();
    closeSavedTeamsModal();
    showToast(`📂 Cargado: "${name}"`);
}
function deleteTeamByName(name) {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    delete savedTeams[name];
    localStorage.setItem('savedTeams', JSON.stringify(savedTeams));
    renderSavedTeamsList();
}

// ─── UTILIDADES ───────────────────────────────────────────────────────────────
function showToast(msg) {
    document.querySelector('.toast')?.remove();
    const t = Object.assign(document.createElement('div'), { className: 'toast', textContent: msg });
    document.body.appendChild(t);
    setTimeout(() => { t.style.cssText = 'opacity:0;transition:opacity .3s'; setTimeout(() => t.remove(), 300); }, 2200);
}
function checkSaved() {
    const el = document.getElementById('savedStatus');
    if (!el) return;
    const raw = localStorage.getItem('kantoTeam');
    if (!raw) { el.style.color = '#ef4444'; el.textContent = '❌ Sin guardar'; return; }
    try {
        const d = JSON.parse(raw);
        el.style.color = '#22c55e';
        el.textContent = `✅ ${d.length} en sesión`;
    } catch { el.style.color = '#ef4444'; el.textContent = '❌ Error'; }
}

// ─── ANÁLISIS DEL EQUIPO ──────────────────────────────────────────────────────
function openAnalysisModal() {
    if (!playerTeam.length) { showToast('⚠️ Equipo vacío'); return; }
    renderTeamAnalysis();
    document.getElementById('teamAnalysisModal')?.classList.add('open');
}

function closeAnalysisModal() {
    document.getElementById('teamAnalysisModal')?.classList.remove('open');
}

function renderTeamAnalysis() {
    const defCont = document.getElementById('analysisDefTable');
    const offCont = document.getElementById('analysisOffTable');
    if (!defCont || !offCont) return;

    const types = Object.keys(TypeColors);

    // ANÁLISIS DEFENSIVO
    const defResults = {};
    types.forEach(type => {
        defResults[type] = { weak: 0, res: 0, neut: 0 };
    });

    playerTeam.forEach(e => {
        const p = PokemonDB[e.id];
        if (!p) return;
        types.forEach(atkT => {
            let mult = 1;
            p.types.forEach(defT => {
                const row = TypeChart[atkT] || {};
                mult *= (row[defT] !== undefined ? row[defT] : 1);
            });
            if (mult > 1) defResults[atkT].weak++;
            else if (mult < 1) defResults[atkT].res++;
            else defResults[atkT].neut++;
        });
    });

    defCont.innerHTML = `<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap:10px;">
        ${types.map(t => {
        const r = defResults[t];
        const score = r.res - r.weak;
        const scoreCol = score > 0 ? '#22c55e' : (score < 0 ? '#ef4444' : '#64748b');
        return `<div style="background:var(--t-panel2); border:1px solid var(--t-border); border-radius:6px; padding:8px;">
                <div class="type-badge ${TypeColors[t]}" style="width:100%; text-align:center; font-size:10px; margin-bottom:5px;">${t}</div>
                <div style="display:flex; justify-content:space-between; font-size:9px;">
                    <span style="color:#ef4444;">Debil: ${r.weak}</span>
                    <span style="color:#22c55e;">Res: ${r.res}</span>
                </div>
                <div style="margin-top:5px; text-align:center; font-weight:bold; color:${scoreCol}">${score > 0 ? '+' : ''}${score}</div>
            </div>`;
    }).join('')}
    </div>`;

    // ANÁLISIS OFENSIVO (Cobertura)
    const teamMoveTypes = new Set();
    playerTeam.forEach(e => {
        e.moves.forEach(mv => {
            const mInfo = getMoveInfo(mv);
            if (mInfo && mInfo.category !== 'status') teamMoveTypes.add(mInfo.type);
        });
    });

    offCont.innerHTML = `<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap:10px;">
        ${types.map(t => {
        const hasMove = teamMoveTypes.has(t);
        return `<div style="background:var(--t-panel2); border:1px solid ${hasMove ? 'var(--t-green)' : 'var(--t-border)'}; border-radius:6px; padding:8px; opacity: ${hasMove ? 1 : 0.4}">
                <div class="type-badge ${TypeColors[t]}" style="width:100%; text-align:center; font-size:10px; margin-bottom:5px;">${t}</div>
                <div style="text-align:center; font-size:9px; color:${hasMove ? 'var(--t-green)' : '#64748b'}">
                    ${hasMove ? '✅ CUBIERTO' : '❌ SIN COBERTURA'}
                </div>
            </div>`;
    }).join('')}
    </div>`;
}

// ─── POKÉMON PREVIEW ─────────────────────────────────────────────────────────
function openPreview(pokeid) {
    const poke = PokemonDB[pokeid];
    if (!poke) return;

    const sprite = getSpriteUrl(pokeid, 'front');
    const bst = Object.values(poke.stats).reduce((a, b) => a + b, 0);
    const typeBadges = poke.types.map(t => `<span class="type-badge ${TypeColors[t]}">${t}</span>`).join('');

    const statRows = Object.entries(poke.stats).map(([k, v]) => {
        const pct = Math.round((v / 255) * 100);
        return `<div style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; font-size:10px; margin-bottom:2px;">
                <span>${k.toUpperCase()}</span>
                <b style="color:var(--t-gold);">${v}</b>
            </div>
            <div style="height:4px; background:rgba(255,255,255,.05); border-radius:2px; overflow:hidden;">
                <div style="width:${pct}%; height:100%; background:var(--t-gold);"></div>
            </div>
        </div>`;
    }).join('');

    const box = document.getElementById('pokePreviewBox');
    if (!box) return;

    box.innerHTML = `
        <div style="padding:20px;">
            <div style="display:flex; align-items:center; gap:15px; margin-bottom:15px;">
                <img src="${sprite}" style="width:80px; height:80px; image-rendering:pixelated;">
                <div>
                    <div style="font-size:16px; color:var(--t-gold);">#${poke.id} ${poke.name}</div>
                    <div style="display:flex; gap:5px; margin:5px 0;">${typeBadges}</div>
                    <div style="font-size:10px; color:#64748b;">Base Stat Total: <b style="color:white;">${bst}</b></div>
                </div>
                <button onclick="closePreview()" style="margin-left:auto; background:transparent; border:none; color:#64748b; font-size:18px; cursor:pointer;">✕</button>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                <div>
                    <div style="font-size:10px; color:var(--t-gold); margin-bottom:10px;">📊 ESTADÍSTICAS BASE</div>
                    ${statRows}
                </div>
                <div>
                    <div style="font-size:10px; color:var(--t-gold); margin-bottom:10px;">⚔️ MOVIMIENTOS</div>
                    <div style="max-height:200px; overflow-y:auto; display:flex; flex-wrap:wrap; gap:4px;">
                        ${(poke.learnset || poke.moves).map(m => `<span style="font-size:9px; background:rgba(255,255,255,.03); padding:2px 6px; border-radius:4px; border:1px solid var(--t-border);">${m}</span>`).join('')}
                    </div>
                </div>
            </div>
            <button onclick="closePreview(); addToTeam(${pokeid})" style="width:100%; margin-top:20px; padding:10px; background:var(--t-gold); color:#000; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">AÑADIR AL EQUIPO</button>
        </div>
    `;

    document.getElementById('pokePreviewModal').classList.add('open');
}

function closePreview() {
    document.getElementById('pokePreviewModal')?.classList.remove('open');
}

init();
