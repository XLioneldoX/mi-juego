// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  js/battle-engine.js  —  MOTOR DE CÁLCULOS                              ║
// ║                                                                          ║
// ║  FÓRMULA OFICIAL STATS (Gen 3+):                                         ║
// ║   HP  = floor((2*Base + IV + floor(EV/4)) * Nivel / 100) + Nivel + 10   ║
// ║   Stat = floor(floor((2*Base + IV + floor(EV/4)) * Nivel / 100) + 5)    ║
// ║          * Naturaleza                                                    ║
// ║                                                                          ║
// ║  FÓRMULA OFICIAL DAÑO (Gen 5+):                                          ║
// ║   Dmg = floor(floor(floor(2*Lvl/5+2) * Pow * A/D) / 50 + 2) * Mods     ║
// ║                                                                          ║
// ║  IVs: 31 por defecto (máximo) para todos los Pokémon                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const DEFAULT_IV = 31;

// ─── CÁLCULO DE STATS CON FÓRMULA OFICIAL ────────────────────────────────────
function calcStatHP(base, ev, iv, level) {
    iv = (iv ?? DEFAULT_IV);
    return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
}

function calcStat(base, ev, iv, level, natMult) {
    iv = (iv ?? DEFAULT_IV);
    natMult = natMult ?? 1.0;
    return Math.floor(
        (Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5) * natMult
    );
}

// Construye el objeto stats completo de un Pokémon
// baseStats: stats base del PokemonDB · evs: EVs asignados · level: nivel
function buildStats(baseStats, evs, level, natureName) {
    evs = evs || {};
    level = level || 100;
    const nat = getNatureMultipliers(natureName || 'Seria');
    return {
        hp: calcStatHP(baseStats.hp, evs.hp || 0, DEFAULT_IV, level),
        atk: calcStat(baseStats.atk, evs.atk || 0, DEFAULT_IV, level, nat.atk),
        def: calcStat(baseStats.def, evs.def || 0, DEFAULT_IV, level, nat.def),
        spa: calcStat(baseStats.spa, evs.spa || 0, DEFAULT_IV, level, nat.spa),
        spd: calcStat(baseStats.spd, evs.spd || 0, DEFAULT_IV, level, nat.spd),
        spe: calcStat(baseStats.spe, evs.spe || 0, DEFAULT_IV, level, nat.spe),
    };
}

// ─── MULTIPLICADORES DE NATURALEZA ───────────────────────────────────────────
function getNatureMultipliers(natureName) {
    const nat = NaturesDB[natureName] || {};
    const muls = { atk: 1.0, def: 1.0, spa: 1.0, spd: 1.0, spe: 1.0 };
    if (nat.up) muls[nat.up] = 1.1;
    if (nat.down) muls[nat.down] = 0.9;
    return muls;
}

// ─── ETAPAS DE BOOST/NERF ────────────────────────────────────────────────────
function getStatBoostMultiplier(stage) {
    if (stage >= 0) return (2 + stage) / 2;
    return 2 / (2 + Math.abs(stage));
}

// ─── STATS MODIFICADAS EN COMBATE (objeto + habilidad pasiva + boosts) ────────
// Nota: las stats en pokemon.stats YA tienen naturaleza y EVs aplicados
// via buildStats(). Aquí solo aplicamos boosts de combate, objetos y hab. pasivas.
function getModifiedStats(pokemon) {
    const itemBoost = getItemStatBoost(pokemon);
    const abilityMult = getAbilityPassiveStatMult(pokemon);

    let defBonus = 1;
    if (pokemon.status === 'petrify') {
        defBonus = 1.5; // +50% Defensa Física
    }

    return {
        atk: Math.floor(pokemon.stats.atk * itemBoost.atk * abilityMult.atk * getStatBoostMultiplier(pokemon.statBoosts?.atk || 0)),
        def: Math.floor(pokemon.stats.def * itemBoost.def * abilityMult.def * getStatBoostMultiplier(pokemon.statBoosts?.def || 0) * defBonus),
        spa: Math.floor(pokemon.stats.spa * itemBoost.spa * abilityMult.spa * getStatBoostMultiplier(pokemon.statBoosts?.spa || 0)),
        spd: Math.floor(pokemon.stats.spd * itemBoost.spd * abilityMult.spd * getStatBoostMultiplier(pokemon.statBoosts?.spd || 0)),
        spe: Math.floor(pokemon.stats.spe * itemBoost.spe * abilityMult.spe * getStatBoostMultiplier(pokemon.statBoosts?.spe || 0)),
    };
}

function getEffectiveSpe(pokemon) {
    return Math.floor(getModifiedStats(pokemon).spe * (pokemon.status === 'paralysis' ? 0.5 : 1));
}

// ─── MULTIPLICADORES PASIVOS DE HABILIDAD ────────────────────────────────────
function getAbilityPassiveStatMult(pokemon) {
    const mults = { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 };
    const ab = AbilitiesDB[pokemon.ability];
    if (!ab || ab.trigger !== 'passive') return mults;
    if (ab.effect === 'boost_spe_mult') mults.spe = ab.value;
    if (ab.effect === 'boost_def_mult') mults.def = ab.value;
    if (ab.effect === 'boost_atk_mult') mults.atk = ab.value;
    if (ab.effect === 'boost_spa_mult') mults.spa = ab.value;
    return mults;
}

// ─── EFECTIVIDAD DE TIPOS ─────────────────────────────────────────────────────
// Doble tipo: multiplica ambos modificadores (×0.5 × ×2 = ×1, etc.)
function calculateEffectiveness(attackType, defenderTypes, moveName = null, dualType = null) {
    let mult = 1;
    const chart = TypeChart[attackType];
    if (chart) {
        for (const dt of defenderTypes) {
            if (chart[dt] !== undefined) mult *= chart[dt];
        }
    }

    if (dualType && TypeChart[dualType]) {
        const dualChart = TypeChart[dualType];
        for (const dt of defenderTypes) {
            if (dualChart[dt] !== undefined) mult *= dualChart[dt];
        }
    }

    // Overrides mecánicos
    if (moveName === 'Grease Fire' && defenderTypes.includes('AGUA')) {
        // En lugar de x0.5 al fuego, el agua es x2. El multiplicador base redujo a la mitad,
        // así que multiplicamos por 4 para volverlo x2 (o proporcional si hay otro tipo).
        mult *= 4;
    }

    return mult;
}

// ─── INMUNIDAD POR HABILIDAD ──────────────────────────────────────────────────
function isImmuneByAbility(defender, moveType) {
    const ab = AbilitiesDB[defender.ability];
    if (!ab || ab.effect !== 'immune_type') return false;
    return ab.immune === moveType;
}

// ─── CÁLCULO DE DAÑO — FÓRMULA OFICIAL GEN 5+ ────────────────────────────────
function calculateDamage(attacker, defender, moveName, randomFactor = null) {
    const move = getMoveInfo(moveName);
    if (!move.power || move.category === 'status') return 0;

    let effPower = move.power;
    if (moveName === "Healing Spa" && (attacker.status || defender.status)) {
        effPower *= 2;
    }

    const moveType = move.type;
    const isPhysical = move.category === 'physical';
    const aStats = getModifiedStats(attacker);
    const dStats = getModifiedStats(defender);

    // Si se pasan boosts manuales (para la calculadora), se aplican aquí
    const aBoostLvl = attacker.manualBoosts ? (isPhysical ? attacker.manualBoosts.atk : attacker.manualBoosts.spa) : 0;
    const dBoostLvl = defender.manualBoosts ? (isPhysical ? defender.manualBoosts.def : defender.manualBoosts.spd) : 0;

    const atk = (isPhysical ? aStats.atk : aStats.spa) * (aBoostLvl !== 0 ? getStatBoostMultiplier(aBoostLvl) : 1);
    const def = (isPhysical ? dStats.def : dStats.spd) * (dBoostLvl !== 0 ? getStatBoostMultiplier(dBoostLvl) : 1);
    const lvl = attacker.level || 100;

    // Fórmula base oficial
    let dmg = Math.floor(
        Math.floor(Math.floor(2 * lvl / 5 + 2) * effPower * atk / def) / 50
    ) + 2;

    // ── STAB ─────────────────────────────────────────────────────────────
    let stabMult = attacker.types.includes(moveType) ? 1.5 : 1;

    // ── Habilidad del atacante ────────────────────────────────────────────
    const atkAb = AbilitiesDB[attacker.ability];
    if (atkAb && atkAb.trigger === 'on_attack') {
        switch (atkAb.effect) {
            case 'boost_same_type':
                if (attacker.types.includes(moveType)) stabMult = atkAb.value;
                break;
            case 'boost_type_atk':
                if (moveType === atkAb.boostedType) dmg *= atkAb.value;
                break;
            case 'boost_type_low_hp':
                if (moveType === atkAb.boostedType &&
                    (attacker.currentHp / (attacker.stats.hp || 1)) <= (atkAb.threshold || 0.33))
                    dmg *= atkAb.value;
                break;
            case 'boost_contact_moves':
                if (isPhysical) dmg *= atkAb.value;
                break;
            case 'crit_boost':
                // Nota: El multiplicador x1.5 se aplica ahora en la sección de crits abajo
                // para que sea consistente con el sistema y pueda ser anulado por habilidades.
                break;
            case 'brute_force':
                dmg *= atkAb.value;
                break;
        }
    }

    dmg *= stabMult;

    // ── Efectividad de tipos (doble tipo = multiplicación de multiplicadores)
    const effectiveness = calculateEffectiveness(moveType, defender.types, move.name, move.dualType);
    dmg *= effectiveness;

    // ── Objeto del atacante ───────────────────────────────────────────────
    dmg *= getItemTypeBoost(attacker, moveType);
    dmg *= (getItemStatBoost(attacker).damage || 1);

    // ── Habilidad del defensor ────────────────────────────────────────────
    const defAb = AbilitiesDB[defender.ability];
    if (defAb && defAb.trigger === 'on_hit') {
        switch (defAb.effect) {
            case 'reduce_physical_dmg': if (isPhysical) dmg *= defAb.value; break;
            case 'reduce_special_dmg': if (!isPhysical) dmg *= defAb.value; break;
        }
    }

    // ── Quemadura ────────────────────────────────────────────────────────
    if (attacker.status === 'burn' && isPhysical &&
        AbilitiesDB[attacker.ability]?.effect !== 'counter_burn')
        dmg *= 0.5;

    // ── Factor aleatorio (85–100%) ────────────────────────────────────────
    let finalRandom = (randomFactor !== null) ? randomFactor : (0.85 + Math.random() * 0.15);
    dmg *= finalRandom;

    // ── Golpe Crítico (6.25% de probabilidad) ─────────────────────────────
    let isCrit = false;
    // La probabilidad base es 6.25% (1/16)
    // Habilidad 'Temeridad' asegura críticos (ya se aplica antes, pero mejor aquí para claridad)
    const alwaysCrit = AbilitiesDB[attacker.ability]?.effect === 'crit_boost';

    if (alwaysCrit || Math.random() < 0.0625) {
        isCrit = true;
        // La habilidad 'Escudo Destello' del defensor anula el multiplicador del crítico
        if (AbilitiesDB[defender.ability]?.effect === 'negate_crit') {
            isCrit = false; // No se cuenta como crítico si se anula
        } else {
            dmg *= 1.5;
        }
    }

    return {
        damage: Math.max(1, Math.floor(dmg)),
        isCrit: isCrit
    };
}

// ─── HABILIDADES AL ENTRAR EN COMBATE ────────────────────────────────────────
function applyAbilitySwitchIn(pokemon, opponent, logFn) {
    const ab = AbilitiesDB[pokemon.ability];
    if (!ab || ab.trigger !== 'on_switch_in') return;
    switch (ab.effect) {
        case 'intimidate_atk':
            opponent.statBoosts = opponent.statBoosts || {};
            opponent.statBoosts.atk = (opponent.statBoosts.atk || 0) - 1;
            logFn(`${ab.icon} ${pokemon.name} usa ${ab.name}: ↓ATK de ${opponent.name}!`, 'boost');
            break;
    }
}

// ─── HABILIDADES AL FINAL DEL TURNO ──────────────────────────────────────────
function applyAbilityEndOfTurn(pokemon) {
    const ab = AbilitiesDB[pokemon.ability];
    if (!ab || ab.trigger !== 'end_of_turn' || pokemon.fainted) return null;
    switch (ab.effect) {
        case 'heal_end_turn': {
            const h = Math.floor(pokemon.stats.hp * ab.value);
            pokemon.currentHp = Math.min(pokemon.currentHp + h, pokemon.stats.hp);
            return `${ab.icon} ${ab.name}: ${pokemon.name} recuperó ${h} HP`;
        }
        case 'speed_boost':
            pokemon.statBoosts.spe = Math.min(6, (pokemon.statBoosts.spe || 0) + ab.value);
            return `${ab.icon} ${ab.name}: ¡${pokemon.name} se aceleró!`;
    }
    return null;
}

// ─── HABILIDADES AL RECIBIR GOLPE ────────────────────────────────────────────
function applyAbilityOnHit(defender, attacker, isPhysical, effectiveness, logFn) {
    const ab = AbilitiesDB[defender.ability];
    if (!ab || ab.trigger !== 'on_hit') return;
    switch (ab.effect) {
        case 'retaliate_status':
            if (ab.physicalOnly && !isPhysical) break;
            if (!attacker.status && Math.random() * 100 < ab.value) {
                attacker.status = ab.status;
                const sd = StatusDB[ab.status];
                logFn(`${ab.icon} ${ab.name}: ${sd?.applyMsg?.replace('{pokemon}', attacker.name) || attacker.name + ' fue afectado'}`, 'boost');
            }
            break;
        case 'heal_on_super_effective':
            if (effectiveness > 1) {
                const h = Math.floor(defender.stats.hp * ab.value);
                defender.currentHp = Math.min(defender.currentHp + h, defender.stats.hp);
                logFn(`${ab.icon} ${ab.name}: ${defender.name} absorbió y recuperó ${h} HP`, 'heal');
            }
            break;
    }
}

// ─── INMUNIDAD A ESTADOS ─────────────────────────────────────────────────────
function isImmuneToStatus(pokemon, statusKey) {
    const ab = AbilitiesDB[pokemon.ability];
    if (!ab || ab.effect !== 'immune_status') return false;
    return (ab.immune || []).includes(statusKey);
}

// ─── QUIÉN VA PRIMERO ─────────────────────────────────────────────────────────
function whoGoesFirst(playerMove, enemyMove) {
    const pP = getMoveInfo(playerMove).priority || 0;
    const eP = getMoveInfo(enemyMove).priority || 0;
    if (pP !== eP) return pP > eP ? 'player' : 'enemy';
    const pS = getEffectiveSpe(playerTeam[playerActive]);
    const eS = getEffectiveSpe(enemyTeam[enemyActive]);
    if (pS === eS) {
        const rand = Math.random();
        if (typeof MP !== 'undefined' && MP.active) {
            const absoluteWinner = rand < 0.5 ? 0 : 1;
            return absoluteWinner === MP.playerIdx ? 'player' : 'enemy';
        }
        return rand < 0.5 ? 'player' : 'enemy';
    }
    return pS > eS ? 'player' : 'enemy';
}

// ─── IA ENEMIGA ───────────────────────────────────────────────────────────────
function chooseEnemyMove(attacker, defender) {
    if (Math.random() < 0.7) {
        let best = 0, bestScore = -1;
        attacker.moves.forEach((mv, i) => {
            const move = getMoveInfo(mv);
            if (!move.power) return;
            const score = move.power * calculateEffectiveness(move.type, defender.types, move.name, move.dualType);
            if (score > bestScore) { bestScore = score; best = i; }
        });
        return best;
    }
    return Math.floor(Math.random() * attacker.moves.length);
}

// ─── ESTADOS AL FINAL DEL TURNO ──────────────────────────────────────────────
function applyStatusEffects(pokemon) {
    if (!pokemon.status || pokemon.fainted) return null;
    const sd = StatusDB[pokemon.status];
    if (!sd || !sd.endOfTurnDmg) return null;
    const dmg = Math.floor(pokemon.stats.hp * sd.endOfTurnDmg);
    pokemon.currentHp = Math.max(0, pokemon.currentHp - dmg);
    if (pokemon.currentHp <= 0) { pokemon.currentHp = 0; pokemon.fainted = true; }
    return { dmg, message: sd.turnMsg?.replace('{pokemon}', pokemon.name) || `${pokemon.name} sufre daño` };
}
