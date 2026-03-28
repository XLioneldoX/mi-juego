// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  js/battle-system.js  —  LÓGICA DE BATALLA                               ║
// ║  Turnos, ataques, habilidades, cambios de Pokémon, victoria/derrota.    ║
// ║  Para cambiar datos ve a data/ · Para cambiar fórmulas ve a battle-engine║
// ╚══════════════════════════════════════════════════════════════════════════╝

// generateEnemyTeam() → movido a battle-main.js (soporta trainer + wild)

// ─── TURNO DEL JUGADOR ────────────────────────────────────────────────────────
function playerAttack(moveIndex) {
    if (battleOver || isBusy) return;

    // ── MODO MULTIJUGADOR: enviar movimiento al servidor ─────────────────────
    if (typeof MP !== 'undefined' && MP.active) {
        const moveName = playerTeam[playerActive].moves[moveIndex];
        MP.chooseMove(moveName);
        // En MP, el turno se ejecuta cuando el servidor envía turn_resolve
        return;
    }

    isBusy = true;
    disableMoves();

    const player = playerTeam[playerActive];
    const enemy = enemyTeam[enemyActive];
    const playerMove = player.moves[moveIndex];
    const enemyMove = enemy.moves[chooseEnemyMove(enemy, player)];
    const first = whoGoesFirst(playerMove, enemyMove);

    const pSpe = getEffectiveSpe(player);
    const eSpe = getEffectiveSpe(enemy);

    addLog('━━━━━━━━━━━━━━', 'separator');

    // Log de orden de turno
    const pPrio = getMoveInfo(playerMove).priority || 0;
    const ePrio = getMoveInfo(enemyMove).priority || 0;
    if (pPrio !== ePrio)
        addLog(first === 'player' ? `⚡ ${playerMove} tiene PRIORIDAD` : `⚡ ${enemyMove} tiene PRIORIDAD (rival)`, 'speed-win');
    else if (pSpe !== eSpe)
        addLog(`🏃 ${first === 'player' ? player.name : enemy.name} (SPE ${first === 'player' ? pSpe : eSpe}) ataca primero`, 'speed-win');
    else
        addLog('🎲 Velocidades iguales – orden aleatorio', 'speed-win');

    const doPlayerAtk = (hasMoved, cb) => executeAttack(player, enemy, playerMove, 'player', hasMoved, enemyMove, cb);
    const doEnemyAtk = (hasMoved, cb) => executeAttack(enemy, player, enemyMove, 'enemy', hasMoved, playerMove, cb);

    if (first === 'player') {
        doPlayerAtk(false, () => {
            if (!enemy.fainted && !player.fainted && !battleOver)
                setTimeout(() => doEnemyAtk(true, () => afterTurn()), 800);
            else afterTurn();
        });
    } else {
        doEnemyAtk(false, () => {
            if (!player.fainted && !enemy.fainted && !battleOver)
                setTimeout(() => doPlayerAtk(true, () => afterTurn()), 800);
            else afterTurn();
        });
    }
}


// ─── CHEQUEO DE ESTADO ANTES DE ATACAR ───────────────────────────────────────
// Devuelve true si el Pokémon PUEDE moverse, false si el estado lo bloquea.
// Gestiona: parálisis (25%), sueño (100% hasta despertar), congelación (hasta descongelar)
function checkStatusBlock(pokemon, logFn) {
    const sd = StatusDB[pokemon.status];
    if (!sd || !sd.blockMove) return true; // sin estado bloqueante → puede moverse

    switch (pokemon.status) {

        case 'sleep': {
            // Inicializar contador de sueño si no existe
            if (pokemon.sleepTurns === undefined) {
                const min = sd.turnsMin || 1;
                const max = sd.turnsMax || 3;
                pokemon.sleepTurns = min + Math.floor(Math.random() * (max - min + 1));
            }
            pokemon.sleepTurns--;
            if (pokemon.sleepTurns <= 0) {
                pokemon.status = null;
                pokemon.sleepTurns = undefined;
                logFn(`💤 ${pokemon.name} ${sd.wakeMsg || 'se despertó!'}`, 'boost');
                return true; // se despertó este turno, puede moverse
            }
            logFn(`💤 ${(sd.blockMsg || '{pokemon} está dormido.').replace('{pokemon}', pokemon.name)}`, '');
            return false;
        }

        case 'freeze': {
            const thawChance = sd.thawChance || 20;
            if (Math.random() * 100 < thawChance) {
                pokemon.status = null;
                logFn(`🧊 ${pokemon.name} ${sd.thawMsg || 'se descongeló!'}`, 'boost');
                return true; // se descongeló, puede actuar
            }
            logFn(`🧊 ${(sd.blockMsg || '{pokemon} está congelado.').replace('{pokemon}', pokemon.name)}`, '');
            return false;
        }

        case 'paralysis': {
            const blockChance = sd.blockChance || 25;
            if (Math.random() * 100 < blockChance) {
                logFn(`⚡ ${(sd.blockMsg || '{pokemon} está paralizado.').replace('{pokemon}', pokemon.name)}`, '');
                return false;
            }
            return true;
        }

        case 'confusion': {
            if (pokemon.confusionTurns === undefined) {
                const min = sd.turnsMin || 2;
                const max = sd.turnsMax || 5;
                pokemon.confusionTurns = min + Math.floor(Math.random() * (max - min + 1));
            }
            pokemon.confusionTurns--;
            if (pokemon.confusionTurns <= 0) {
                pokemon.status = null;
                pokemon.confusionTurns = undefined;
                logFn(`✨ ${pokemon.name} ${sd.wakeMsg || 'se curó de su confusión!'}`, 'boost');
                return true; // se curó, puede actuar
            }
            logFn(`💫 ${(sd.blockMsg || '{pokemon} está confundido.').replace('{pokemon}', pokemon.name)}`, '');

            if (Math.random() * 100 < (sd.selfHitChance || 33)) {
                const dmg = calculateConfusionDamage(pokemon);
                pokemon.currentHp = Math.max(0, pokemon.currentHp - dmg);
                logFn(`💥 ¡Se hirió a sí mismo en su confusión!`, 'damage');
                if (pokemon.currentHp <= 0) {
                    pokemon.currentHp = 0;
                    pokemon.fainted = true;
                }
                return false; // Bloquea el ataque principal
            }
            return true;
        }

        default:
            return true;
    }
}

// ─── EJECUTAR UN ATAQUE ───────────────────────────────────────────────────────
function executeAttack(attacker, defender, moveName, side, targetHasMoved, targetMoveName, callback) {
    const move = getMoveInfo(moveName);
    const defSide = side === 'player' ? 'enemy' : 'player';

    // ── Chequeo de estado: ¿puede moverse? ───────────────────────────────
    if (!checkStatusBlock(attacker, (msg, type) => addLog(msg, type))) {
        updateUI();
        setTimeout(callback, 600);
        return;
    }

    // ── Chequeo de Retroceso (Flinch) ────────────────────────────────────
    if (attacker.flinched) {
        addLog(`😵 ¡${attacker.name} retrocedió y no pudo atacar!`, 'important');
        attacker.flinched = false;
        updateUI();
        setTimeout(callback, 600);
        return;
    }

    addLog(`${side === 'player' ? '▶️' : '◀️'} ${attacker.name} usa <b>${moveName}</b>`, side === 'player' ? 'important' : '');

    attacker.lastMoveUsed = moveName;
    if (attacker.destinyBond && moveName !== 'Mismo Destino') {
        attacker.destinyBond = false;
    }

    // ── Chequeo de movimiento anulado (Cuerpo Maldito) ───────────────
    if (attacker.disabledMove && attacker.disabledMove.name === moveName) {
        addLog(`❌ ¡${attacker.name} no puede usar ${moveName} porque está anulado!`, '');
        setTimeout(callback, 600);
        return;
    }

    // ── Chequeo de Protección ────────────────────────────────────────────
    if (defender.protected && moveName !== 'Protección' && move.category !== 'status') {
        addLog(`🛡️ ¡${defender.name} se protegió!`, 'important');
        setTimeout(callback, 600);
        return;
    }

    // ── Lógica especial: Sucker Punch (Golpe Bajo) ────────────────────────
    if (move.effect === 'sucker_punch') {
        const targetMove = targetMoveName ? getMoveInfo(targetMoveName) : null;
        const isTargetAttacking = targetMove && targetMove.category !== 'status';

        if (targetHasMoved || !isTargetAttacking) {
            addLog(`❌ ¡${move.name} falló!`, '');
            setTimeout(callback, 600);
            return;
        }
    }

    // ── Lógica especial: Fake Out (Sorpresa) ──────────────────────────────
    if (move.effect === 'fake_out') {
        if (attacker.turnsInField > 0) {
            addLog(`❌ ¡${move.name} solo funciona en el primer turno!`, '');
            setTimeout(callback, 600);
            return;
        }
    }

    // ── Movimiento de estado ──────────────────────────────────────────────
    if (move.category === 'status') {
        handleStatusMove(attacker, defender, moveName);
        updateUI();
        setTimeout(callback, 600);
        return;
    }

    // ── Inmunidad por tipo de habilidad ──────────────────────────────────
    if (isImmuneByAbility(defender, move.type)) {
        const ab = AbilitiesDB[defender.ability];
        addLog(`${ab.icon} ${ab.name}: ¡${defender.name} es inmune a ${move.type}!`, 'boost');

        if (ab.effect === 'absorb_stat_boost') {
            defender.statBoosts = defender.statBoosts || {};
            defender.statBoosts.atk = Math.min(6, (defender.statBoosts.atk || 0) + 1);
            defender.statBoosts.spa = Math.min(6, (defender.statBoosts.spa || 0) + 1);
            addLog(`⬆️ ¡El Ataque y Ataque Especial de ${defender.name} subieron!`, 'boost');
        }

        if (defSide === 'enemy') revealEnemyStat('ability', defender);
        setTimeout(callback, 600);
        return;
    }

    // ── Precisión (Accuracy) ──────────────────────────────────────────────
    if (move.accuracy !== null) {
        let accMult = getStatBoostMultiplier(attacker.statBoosts?.acc || 0);
        let finalAcc = move.accuracy * accMult;
        if (Math.random() * 100 > finalAcc) {
            addLog(`❌ ¡El ataque falló!`, '');
            setTimeout(callback, 600);
            return;
        }
    }

    const isPhysical = move.category === 'physical';
    const effectiveness = calculateEffectiveness(move.type, defender.types, move.name, move.dualType);
    const dmgResult = calculateDamage(attacker, defender, moveName);
    const dmg = dmgResult.damage;
    const isCrit = dmgResult.isCrit;

    if (isCrit) {
        addLog('✨ ¡Un golpe crítico!', 'important');
    }

    // ── Cinta Focus ───────────────────────────────────────────────────────
    if (defender.currentHp - dmg <= 0 && !defender.itemUsed
        && defender.item === 'Cinta Focus' && defender.currentHp === defender.stats.hp) {
        defender.currentHp = 1;
        defender.itemUsed = true;
        addLog(`💪 ¡Cinta Focus: ${defender.name} aguantó con 1 HP!`, 'boost');
        // FIX #1/#5: eliminada la llamada duplicada a revealEnemyStat/revealPlayerStat
        if (defSide === 'enemy') revealEnemyStat('item', defender);
        else revealPlayerStat('item', defender);
    } else {
        const defHasSub = (defender.substituteHp || 0) > 0;
        if (defHasSub && move.category !== 'status') {
            addLog(`🎭 ¡El sustituto recibió el daño!`, 'important');
            defender.substituteHp -= dmg;
            if (defender.substituteHp <= 0) {
                defender.substituteHp = 0;
                addLog(`💥 ¡El sustituto de ${defender.name} se rompió!`, 'important');
            }
        } else {
            defender.currentHp = Math.max(0, defender.currentHp - dmg);
            if (defender.currentHp <= 0) {
                defender.fainted = true;
                if (defender.destinyBond && move.category !== 'status') {
                    attacker.currentHp = 0;
                    attacker.fainted = true;
                    addLog(`💀 ¡El Mismo Destino de ${defender.name} arrastró a ${attacker.name}!`, 'important');
                }
            }
        }
    }

    // ── Log efectividad ───────────────────────────────────────────────────
    if (effectiveness > 1) addLog('💥 ¡Es súper efectivo!', 'important');
    if (effectiveness < 1 && effectiveness > 0) addLog('💨 No es muy efectivo...', '');
    if (effectiveness === 0) addLog('❌ No tiene efecto', '');
    addLog(`💔 ${Math.floor(dmg)} de daño a ${defender.name}`, 'damage');

    // ── Recoil del movimiento ─────────────────────────────────────────────
    if (move.effect === 'recoil_33') {
        const r = Math.floor(dmg * 0.33);
        attacker.currentHp = Math.max(0, attacker.currentHp - r);
        if (attacker.currentHp <= 0) attacker.fainted = true;
        addLog(`⚡ ${attacker.name} recibe ${r} de retroceso`, 'damage');
        // FIX #1/#5: eliminada la llamada duplicada a revealEnemyStat/revealPlayerStat
        if (side === 'enemy') revealEnemyStat('item', attacker);
        else revealPlayerStat('item', attacker);
    }

    // ── Autodebilitamiento (Supernova) ───────────────────────────────────
    if (move.effect === 'faint_after_use') {
        attacker.currentHp = 0;
        attacker.fainted = true;
        addLog(`💥 ¡${attacker.name} se debilitó tras el ataque!`, 'damage');
    }

    // ── Orbe Vida ─────────────────────────────────────────────────────────
    if (attacker.item === 'Orbe Vida') {
        const o = Math.floor(attacker.stats.hp * 0.1);
        attacker.currentHp = Math.max(0, attacker.currentHp - o);
        if (attacker.currentHp <= 0) attacker.fainted = true;
    }

    // ── Efecto de Drenaje (Puño Drenaje, Gigadrenado) ─────────────────────
    if (move.effect === 'drain_50') {
        const heal = Math.floor(dmg * 0.5);
        attacker.currentHp = Math.min(attacker.stats.hp, attacker.currentHp + heal);
        addLog(`💚 ¡${attacker.name} recuperó salud! (+${heal})`, 'heal');
    }

    // ── Giro Rápido ───────────────────────────────────────────────────────
    if (move.effect === 'rapid_spin') {
        const hz = side === 'player' ? playerHazards : enemyHazards;
        hz.spikes = 0;
        hz.toxicSpikes = 0;
        hz.stickyWeb = false;
        attacker.leechSeed = false;
        addLog(`🌀 ¡Giro Rápido eliminó las trampas del campo de ${attacker.name}!`, 'boost');
    }

    // ── Bajada de Defensas (A Bocajarro, Asalto Cálido) ───────────────────
    if (move.effect === 'drop_self_def_spd_1') {
        attacker.statBoosts.def = Math.max(-6, (attacker.statBoosts.def || 0) - 1);
        attacker.statBoosts.spd = Math.max(-6, (attacker.statBoosts.spd || 0) - 1);
        addLog(`⬇️ ¡La Defensa y Defensa Especial de ${attacker.name} bajaron!`, 'damage');
    }

    // ── Desarme (Knock Off) ──────────────────────────────────────────────
    if (move.effect === 'knock_off' && defender.item !== 'Ninguno') {
        addLog(`🔍 ¡${attacker.name} desarmó a ${defender.name} y le quitó su ${defender.item}!`, 'important');
        defender.item = 'Ninguno';
        defender.itemUsed = true;
    }

    // ── Efectos secundarios del movimiento ────────────────────────────────
    const bruteForce = AbilitiesDB[attacker.ability]?.effect === 'brute_force';
    if (!bruteForce && move.effect && move.effect !== 'recoil_33') {
        const chance = move.effectChance || 0;
        if (chance === 100 || Math.random() * 100 < chance) {
            if (move.effect.startsWith('apply_') && !['apply_toxic_spikes', 'apply_leech_seed'].includes(move.effect)) {
                // FIX #3: apply_leech_seed excluido explícitamente del bloque genérico apply_
                if (!defender.fainted) {
                    const sk = move.effect.replace('apply_', '');
                    if (!defender.status && !isImmuneToStatus(defender, sk)) {
                        defender.status = sk;
                        const sd = StatusDB[sk];
                        addLog(sd?.applyMsg?.replace('{pokemon}', defender.name) || `${defender.name} fue afectado`, 'boost');
                    }
                }
            } else if (move.effect === 'flinch_30') {
                if (!defender.fainted && !targetHasMoved && Math.random() < 0.3) {
                    defender.flinched = true;
                }
            } else if (move.effect === 'fake_out') {
                if (!defender.fainted && !targetHasMoved) {
                    defender.flinched = true;
                }
            } else if (move.effect === 'flinch_20') {
                if (!defender.fainted && !targetHasMoved && Math.random() < 0.2) {
                    defender.flinched = true;
                }
            } else if (move.effect === 'drop_target_def_1_chance_50') {
                if (Math.random() < 0.5 && !defender.fainted) {
                    defender.statBoosts.def = Math.max(-6, (defender.statBoosts.def || 0) - 1);
                    addLog(`⬇️ La Defensa de ${defender.name} bajó`, 'damage');
                }
            } else if (move.effect === 'apply_toxic_spikes') {
                const hz = defSide === 'player' ? playerHazards : enemyHazards;
                if (hz.toxicSpikes < 3) {
                    hz.toxicSpikes++;
                    addLog(`☠️ ¡Púas Tóxicas se esparcieron por el equipo rival!`, 'boost');
                }
            } else if (move.effect === 'apply_spikes') {
                const hz = defSide === 'player' ? playerHazards : enemyHazards;
                if (hz.spikes < 3) {
                    hz.spikes++;
                    addLog(`📌 ¡Se han esparcido Púas por el campo rival!`, 'boost');
                }
            } else if (move.effect === 'drop_self_spa_2') {
                attacker.statBoosts.spa = Math.max(-6, (attacker.statBoosts.spa || 0) - 2);
                addLog(`⬇️ El Ataque Especial de ${attacker.name} bajó drásticamente`, 'damage');
            } else if (move.effect === 'drop_self_atk_2') {
                attacker.statBoosts.atk = Math.max(-6, (attacker.statBoosts.atk || 0) - 2);
                addLog(`⬇️ El Ataque de ${attacker.name} bajó drásticamente`, 'damage');
            } else if (move.effect === 'drop_self_acc_2') {
                attacker.statBoosts.acc = Math.max(-6, (attacker.statBoosts.acc || 0) - 2);
                addLog(`⬇️ La Precisión de ${attacker.name} bajó drásticamente`, 'damage');
            } else if (move.effect === 'drop_target_atk_1' && !defender.fainted) {
                defender.statBoosts.atk = Math.max(-6, (defender.statBoosts.atk || 0) - 1);
                addLog(`⬇️ El Ataque de ${defender.name} bajó`, 'damage');
            } else if (move.effect === 'cure_status_on_hit_and_double_dmg') {
                if (attacker.status) {
                    const msg = StatusCureMessages[attacker.status] || `${attacker.name} se curó de su estado.`;
                    attacker.status = null;
                    addLog(`✨ ${msg}`, 'heal');
                }
                if (!defender.fainted && defender.status) {
                    const msg = StatusCureMessages[defender.status] || `${defender.name} se curó de su estado.`;
                    defender.status = null;
                    addLog(`✨ ${msg}`, 'heal');
                }
            }
        }
    }

    // ── Cuerpo Maldito (incluso si el defensor se debilita) ───────────
    if (AbilitiesDB[defender.ability]?.effect === 'cuerpo_maldito' && !targetHasMoved && move.category !== 'status') {
        const hasSub = (defender.substituteHp || 0) > 0;
        if (!hasSub && Math.random() < 0.3) {
            attacker.disabledMove = { name: moveName, turns: 4 };
            addLog(`👻 ¡El Cuerpo Maldito de ${defender.name} anuló el uso de ${moveName}!`, 'important');
            if (defSide === 'enemy') revealEnemyStat('ability', defender);
        }
    }

    // ── Habilidad del defensor al recibir golpe ───────────────────────────
    if (!defender.fainted) {
        applyAbilityOnHit(defender, attacker, isPhysical, effectiveness, (msg, type) => addLog(msg, type));
    }

    // ── Baya Zidra ────────────────────────────────────────────────────────
    if (!defender.fainted && !defender.itemUsed && defender.item === 'Baya Zidra'
        && (defender.currentHp / defender.stats.hp) < 0.25) {
        const h = Math.floor(defender.stats.hp / 3);
        defender.currentHp = Math.min(defender.currentHp + h, defender.stats.hp);
        defender.itemUsed = true;
        addLog(`🍓 ¡Baya Zidra restauró ${h} HP a ${defender.name}!`, 'heal');
    }

    animHit(defSide);
    updateUI();

    if (defender.fainted && attacker.fainted) {
        setTimeout(() => {
            if (typeof MP !== 'undefined' && MP.active) {
                handleFaint('enemy');
                handleFaint('player', callback);
            } else {
                handleFaint('enemy', () => {
                    handleFaint('player', callback);
                });
            }
        }, 600);
        return;
    }
    if (defender.fainted) { setTimeout(() => handleFaint(defSide, callback), 600); return; }
    if (attacker.fainted) { setTimeout(() => handleFaint(side, callback), 600); return; }
    setTimeout(callback, 600);
}

// ─── MOVIMIENTOS DE ESTADO ────────────────────────────────────────────────────
function handleStatusMove(user, target, moveName) {
    const move = getMoveInfo(moveName);

    if (move.effect === 'heal_50') {
        const h = Math.floor(user.stats.hp * 0.5);
        user.currentHp = Math.min(user.currentHp + h, user.stats.hp);
        addLog(`💚 ${user.name} recuperó ${h} HP`, 'heal');
        return;
    }

    // ── Drenadoras ────────────────────────────────────────────────────────
    if (move.effect === 'apply_leech_seed') {
        if (target.types.includes('PLANTA')) {
            addLog(`🌿 ¡No tiene efecto sobre los Pokémon de tipo Planta!`, '');
            return;
        }
        if (target.leechSeed) {
            addLog(`🌿 ¡${target.name} ya tiene una semilla plantada!`, '');
            return;
        }
        target.leechSeed = true;
        addLog(`🌱 ¡Una semilla fue plantada en ${target.name}!`, 'boost');
        return;
    }

    if (move.effect === 'heal_100_sleep') {
        user.currentHp = user.stats.hp;
        user.status = 'sleep';
        addLog(`💚 ${user.name} se durmió y recuperó todo el HP`, 'heal');
        return;
    }

    if (move.effect === 'apply_sticky_web') {
        const hz = user === playerTeam[playerActive] ? enemyHazards : playerHazards;
        if (hz.stickyWeb === undefined) hz.stickyWeb = false;
        if (!hz.stickyWeb) {
            hz.stickyWeb = true;
            addLog(`🕸️ ¡Una Red Viscosa rodea el campo del equipo rival!`, 'boost');
        } else {
            addLog(`❌ Ya hay una Red Viscosa en el campo.`, '');
        }
        return;
    }

    if (move.effect === 'heal_100_petrify') {
        user.currentHp = user.stats.hp;
        user.status = 'petrify';
        addLog(`🗿 ${user.name} se petrificó y recuperó todo el HP`, 'heal');
        return;
    }

    if (move.effect === 'substitute') {
        if ((user.substituteHp || 0) > 0) {
            addLog(`❌ ¡${user.name} ya tiene un sustituto!`);
            return;
        }
        const cost = Math.floor(user.stats.hp / 4);
        if (user.currentHp > cost) {
            user.currentHp -= cost;
            user.substituteHp = cost;
            addLog(`🎭 ¡${user.name} creó un sustituto a cambio de vida!`, 'important');
            updateUI();
        } else {
            addLog(`❌ ¡No hay suficiente vida para crear un sustituto!`);
        }
        return;
    }

    if (move.effect === 'change_type_flying') {
        target.types = ["VOLADOR"];
        addLog(`💨 ¡El tipo de ${target.name} cambió a Volador!`, 'boost');
        return;
    }

    if (move.effect === 'destiny_bond') {
        user.destinyBond = true;
        addLog(`🔗 ¡${user.name} se prepara para llevarse consigo a su atacante!`, 'important');
        return;
    }

    if (move.effect === 'disable_last_move') {
        if (!target.lastMoveUsed || target.disabledMove) {
            addLog(`❌ ¡Pero falló!`, '');
        } else {
            target.disabledMove = { name: target.lastMoveUsed, turns: 4 };
            addLog(`🚫 ¡Anulación desactivó ${target.lastMoveUsed} de ${target.name}!`, 'important');
        }
        return;
    }

    if (move.effect === 'apply_toxic_spikes') {
        const hz = user === playerTeam[playerActive] ? enemyHazards : playerHazards;
        if (hz.toxicSpikes < 3) {
            hz.toxicSpikes++;
            addLog(`☠️ ¡Púas Tóxicas se esparcieron por el equipo rival!`, 'boost');
        } else {
            addLog(`❌ Las púas tóxicas no pueden apilarse más.`, '');
        }
        return;
    }

    if (move.effect === 'apply_spikes') {
        const hz = user === playerTeam[playerActive] ? enemyHazards : playerHazards;
        if (hz.spikes < 3) {
            hz.spikes++;
            addLog(`📌 ¡Se han esparcido Púas por el campo rival!`, 'boost');
        } else {
            addLog(`❌ Las púas no pueden apilarse más.`, '');
        }
        return;
    }

    if (move.effect === 'boost_atk_spe') {
        user.statBoosts.atk = Math.min(6, (user.statBoosts.atk || 0) + 1);
        user.statBoosts.spe = Math.min(6, (user.statBoosts.spe || 0) + 1);
        addLog(`⬆️ ${user.name}: ↑ ATK y ↑ SPE`, 'boost');
        return;
    }

    if (move.effect === 'boost_spe') {
        user.statBoosts.spe = Math.min(6, (user.statBoosts.spe || 0) + 1);
        addLog(`⬆️ ${user.name}: ↑ SPE`, 'boost');
        return;
    }

    if (move.effect === 'protect') {
        user.protected = true;
        addLog(`🛡️ ${user.name} se protege este turno`, 'boost');
        return;
    }

    if (move.effect === 'apply_trick_room') {
        if (window.trickRoomActive && window.trickRoomActive.turns > 0) {
            window.trickRoomActive.turns = 0;
            addLog(`⌛ ¡Las dimensiones volvieron a la normalidad!`, 'important');
        } else {
            window.trickRoomActive = { turns: 5 };
            addLog(`🌀 ¡${user.name} retorció las dimensiones!`, 'important');
        }
        updateWeatherAndTerrainUI();
        return;
    }

    if (move.effect === 'apply_weather_sun') {
        window.battleWeather = { type: 'sun', turns: 5 };
        addLog(`☀️ ¡El sol brilla con fuerza!`, 'important');
        updateWeatherAndTerrainUI();
        return;
    }

    if (move.effect === 'apply_weather_rain') {
        window.battleWeather = { type: 'rain', turns: 5 };
        addLog(`🌧️ ¡Empezó a llover!`, 'important');
        updateWeatherAndTerrainUI();
        return;
    }

    if (move.effect === 'apply_weather_sand') {
        window.battleWeather = { type: 'sand', turns: 5 };
        addLog(`🏜️ ¡Se desató una tormenta de arena!`, 'important');
        updateWeatherAndTerrainUI();
        return;
    }

    if (move.effect === 'apply_weather_hail') {
        window.battleWeather = { type: 'hail', turns: 5 };
        addLog(`❄️ ¡Empezó a granizar!`, 'important');
        updateWeatherAndTerrainUI();
        return;
    }

    if (move.effect?.startsWith('apply_')) {
        const sk = move.effect.replace('apply_', '');
        if (move.accuracy !== null && Math.random() * 100 > (move.accuracy || 100)) {
            addLog(`✗ ${moveName} falló`, ''); return;
        }
        if (target.status) { addLog(`${target.name} ya tiene un estado`, ''); return; }
        if (isImmuneToStatus(target, sk)) {
            const ab = AbilitiesDB[target.ability];
            addLog(`${ab.icon} ${ab.name}: ${target.name} es inmune`, 'boost'); return;
        }
        target.status = sk;
        const sd = StatusDB[sk];
        addLog(sd?.applyMsg?.replace('{pokemon}', target.name) || `${target.name} fue afectado`, 'boost');
    }
}

// ─── FIN DE TURNO ─────────────────────────────────────────────────────────────
function afterTurn() {
    if (battleOver) return;

    // ── Clima y Espacio Raro (Contadores) ─────────────────────────────
    if (window.battleWeather && window.battleWeather.turns > 0) {
        window.battleWeather.turns--;
        if (window.battleWeather.turns <= 0) {
            window.battleWeather.type = null;
            addLog(`⌛ El clima volvió a la normalidad.`, 'important');
            updateWeatherAndTerrainUI();
        }
    }
    if (window.trickRoomActive && window.trickRoomActive.turns > 0) {
        window.trickRoomActive.turns--;
        if (window.trickRoomActive.turns <= 0) {
            addLog(`⌛ El espacio volvió a la normalidad.`, 'important');
            updateWeatherAndTerrainUI();
        }
    }

    turnCount++;
    const tb = document.getElementById('turnBadge');
    if (tb) tb.textContent = `Turno ${turnCount}`;

    [
        { p: playerTeam[playerActive] },
        { p: enemyTeam[enemyActive] },
    ].forEach(({ p }) => {
        if (p.fainted) return;

        // ── Restos ────────────────────────────────────────────────────────
        if (p.item === 'Restos') {
            const h = Math.floor(p.stats.hp / 16);
            p.currentHp = Math.min(p.currentHp + h, p.stats.hp);
            addLog(`♻️ Restos: ${p.name} recuperó ${h} HP`, 'heal');
            // FIX #6: eliminada la llamada duplicada a revealEnemyStat
            if (enemyTeam.includes(p)) revealEnemyStat('item', p);
        }

        // ── Drenadoras ────────────────────────────────────────────────────
        // FIX #10: drenadoras respetan el Sustituto del objetivo
        if (p.leechSeed && !p.fainted) {
            const hasSub = (p.substituteHp || 0) > 0;
            if (hasSub) {
                addLog(`🎭 ¡El sustituto de ${p.name} bloqueó las Drenadoras!`, '');
            } else {
                const drain = Math.floor(p.stats.hp / 8);
                p.currentHp = Math.max(0, p.currentHp - drain);
                addLog(`🌿 ¡Drenadoras drenaron ${drain} HP de ${p.name}!`, 'damage');
                if (p.currentHp <= 0) p.fainted = true;

                const isPlayer = playerTeam.includes(p);
                const receiver = isPlayer ? enemyTeam[enemyActive] : playerTeam[playerActive];
                if (receiver && !receiver.fainted) {
                    receiver.currentHp = Math.min(receiver.stats.hp, receiver.currentHp + drain);
                    addLog(`💚 ${receiver.name} absorbió ${drain} HP`, 'heal');
                }
            }
        }

        // ── Habilidades de fin de turno ───────────────────────────────────
        const abMsg = applyAbilityEndOfTurn(p);
        if (abMsg) addLog(abMsg, 'heal');

        // ── Daño por Clima ────────────────────────────────────────────────
        if (window.battleWeather && window.battleWeather.turns > 0) {
            const w = window.battleWeather.type;
            if (w === 'sand') {
                if (!p.types.includes('ROCA') && !p.types.includes('TIERRA') && !p.types.includes('ACERO')) {
                    const d = Math.floor(p.stats.hp / 16);
                    p.currentHp = Math.max(0, p.currentHp - d);
                    addLog(`🏜️ La tormenta de arena daña a ${p.name}`, 'damage');
                    if (p.currentHp <= 0) p.fainted = true;
                }
            } else if (w === 'hail') {
                if (!p.types.includes('HIELO')) {
                    const d = Math.floor(p.stats.hp / 16);
                    p.currentHp = Math.max(0, p.currentHp - d);
                    addLog(`❄️ El granizo daña a ${p.name}`, 'damage');
                    if (p.currentHp <= 0) p.fainted = true;
                }
            }
        }

        // ── Estados que dañan (veneno, quemadura, etc.) ───────────────────
        const statusRes = applyStatusEffects(p);
        if (statusRes) {
            addLog(statusRes.message, 'damage');
            if (p.currentHp <= 0) { p.currentHp = 0; p.fainted = true; }
        }

        // ── Limpiar estados de turno ──────────────────────────────────────
        p.protected = false;
        p.flinched = false;
        p.turnsInField++;

        // ── Movimientos anulados ──────────────────────────────────────────
        if (p.disabledMove) {
            p.disabledMove.turns--;
            if (p.disabledMove.turns <= 0) {
                addLog(`✨ ¡${p.name} ya puede volver a usar ${p.disabledMove.name}!`, 'boost');
                p.disabledMove = null;
            }
        }
    });

    updateUI();

    // Detectar fainted por daño pasivo y llamar handleFaint correctamente
    const pFainted = playerTeam[playerActive].fainted;
    const eFainted = enemyTeam[enemyActive].fainted;

    if (pFainted && eFainted) {
        if (playerTeam.every(p => p.fainted)) { endBattle(false); return; }
        if (typeof MP !== 'undefined' && MP.active) {
            handleFaint('enemy');
            handleFaint('player');
        } else {
            handleFaint('enemy', () => {
                if (enemyTeam.every(p => p.fainted)) endBattle(true);
                else handleFaint('player', () => { isBusy = false; renderMoves(); });
            });
        }
        return;
    }
    if (eFainted) { handleFaint('enemy', () => { isBusy = false; renderMoves(); }); return; }
    if (pFainted) { handleFaint('player', () => { }); return; }
    if (playerTeam.every(p => p.fainted)) { endBattle(false); return; }
    if (enemyTeam.every(p => p.fainted)) { endBattle(true); return; }

    isBusy = false;
    renderMoves();
}

// ─── APLICACIÓN DE TRAMPAS AL ENTRAR AL CAMPO ─────────────────────────────────
function applyHazardsOnSwitchIn(pokemon, side) {
    if (pokemon.fainted) return;
    const hazards = side === 'player' ? playerHazards : enemyHazards;

    // ── Red Viscosa ───────────────────────────────────────────────────────
    if (hazards.stickyWeb) {
        const isGrounded = !pokemon.types.includes("VOLADOR") && AbilitiesDB[pokemon.ability]?.effect !== 'immune_ground';
        if (isGrounded) {
            pokemon.statBoosts = pokemon.statBoosts || {};
            pokemon.statBoosts.spe = Math.max(-6, (pokemon.statBoosts.spe || 0) - 1);
            addLog(`🕸️ ¡${pokemon.name} fue atrapado por la red viscosa! Su Velocidad bajó.`, 'damage');
        }
    }

    // ── Púas Tóxicas ──────────────────────────────────────────────────────
    if (hazards.toxicSpikes > 0) {
        const isGrounded = !pokemon.types.includes("VOLADOR") && AbilitiesDB[pokemon.ability]?.effect !== 'immune_ground';
        if (isGrounded) {
            if (pokemon.types.includes("VENENO")) {
                hazards.toxicSpikes = 0;
                addLog(`🧹 ¡${pokemon.name} absorbió las Púas Tóxicas!`, 'heal');
            } else if (!pokemon.types.includes("ACERO")) {
                if (!pokemon.status && !isImmuneToStatus(pokemon, 'poison') && !isImmuneToStatus(pokemon, 'badPoison')) {
                    const tox = hazards.toxicSpikes >= 3 ? 'badPoison' : 'poison';
                    pokemon.status = tox;
                    addLog(`☠️ ¡${pokemon.name} fue envenenado por las púas tóxicas!`, 'damage');
                }
            }
        }
    }

    // ── Púas (Normales) ───────────────────────────────────────────────────
    if (hazards.spikes > 0) {
        const isGrounded = !pokemon.types.includes("VOLADOR") && AbilitiesDB[pokemon.ability]?.effect !== 'immune_ground';
        if (isGrounded) {
            const fractions = [0, 0.125, 0.166, 0.25]; // 1/8, 1/6, 1/4
            const dmg = Math.floor(pokemon.stats.hp * fractions[Math.min(3, hazards.spikes)]);
            pokemon.currentHp = Math.max(0, pokemon.currentHp - dmg);
            addLog(`📌 ¡${pokemon.name} fue herido por las púas! (-${dmg})`, 'damage');
            if (pokemon.currentHp <= 0) pokemon.fainted = true;
        }
    }
}

// ─── DEBILITAMIENTO ───────────────────────────────────────────────────────────
function handleFaint(side, callback) {
    const team = side === 'player' ? playerTeam : enemyTeam;
    const active = side === 'player' ? playerActive : enemyActive;
    addLog(`😵 ¡${team[active].name} se debilitó!`, 'important');
    animFaint(side);

    if (team.every(p => p.fainted)) {
        setTimeout(() => endBattle(side === 'enemy'), 1200);
        return;
    }
    setTimeout(() => {
        if (typeof MP !== 'undefined' && MP.active) {
            if (side === 'player') {
                switchForced = true;
                isBusy = false;
                openSwitch(true);
            }
        } else {
            if (side === 'enemy') {
                enemyActive = enemyTeam.findIndex(p => !p.fainted);
                const newEnemy = enemyTeam[enemyActive];
                // FIX #4/#5: el nuevo Pokémon que entra no hereda leechSeed
                newEnemy.leechSeed = false;
                newEnemy.turnsInField = 0;
                newEnemy.flinched = false;
                addLog(`🔄 ¡El rival envió a ${newEnemy.name}!`, 'important');
                applyAbilitySwitchIn(newEnemy, playerTeam[playerActive], (msg, t) => { addLog(msg, t); if (msg) revealEnemyStat('ability', newEnemy); });
                applyHazardsOnSwitchIn(newEnemy, 'enemy');
                updateUI();
                if (callback) callback();
            } else {
                switchForced = true;
                isBusy = false;
                openSwitch(true);
            }
        }
    }, 1000);
}

// ─── CAMBIO DE POKÉMON ────────────────────────────────────────────────────────
function openSwitch(forced = false) {
    switchForced = forced;
    const available = playerTeam.map((p, i) => ({ p, i })).filter(o => !o.p.fainted && o.i !== playerActive);
    if (!available.length) { addLog('⚠️ No hay Pokémon disponibles', ''); return; }

    const titleEl = document.getElementById('switchTitle');
    if (titleEl) titleEl.textContent = forced ? '¡DEBES ELEGIR UN POKÉMON!' : 'SELECCIONA UN POKÉMON';
    document.getElementById('switchModal').classList.add('open');

    const grid = document.getElementById('switchGrid');
    grid.innerHTML = '';
    available.forEach(({ p, i }) => {
        const hpPct = (p.currentHp / p.stats.hp) * 100;
        const col = hpPct > 50 ? '#22c55e' : hpPct > 20 ? '#eab308' : '#ef4444';
        const sprite = getSpriteUrl(p.id, 'front');
        const ab = AbilitiesDB[p.ability];
        const card = document.createElement('div');
        card.className = 'switch-card';
        card.innerHTML = `
            <img src="${sprite}" onerror="onSpriteError(this,p.id)">
            <div class="switch-card-name">${p.name}</div>
            <div style="font-size:6px;color:#94a3b8;margin-bottom:2px;">${ab ? ab.icon + ' ' + ab.name : ''}</div>
            <div class="switch-card-hp" style="color:${col};">${Math.floor(p.currentHp)}/${p.stats.hp}</div>
            <div style="height:4px;background:#1e293b;border-radius:2px;margin-top:4px;overflow:hidden;">
                <div style="height:100%;width:${hpPct}%;background:${col};border-radius:2px;"></div>
            </div>
        `;
        card.onclick = () => switchTo(i);
        grid.appendChild(card);
    });

    const cancelBtn = document.getElementById('switchCancelBtn');
    if (cancelBtn) cancelBtn.style.display = forced ? 'none' : 'block';
}

function closeSwitch() {
    if (switchForced) return;
    document.getElementById('switchModal').classList.remove('open');
}

function switchTo(newIndex) {
    const oldName = playerTeam[playerActive].name;
    // FIX #4: limpiar leechSeed del Pokémon que sale (jugador)
    playerTeam[playerActive].leechSeed = false;

    // ── MODO MULTIJUGADOR ─────────────────────────────────────────────────────
    if (typeof MP !== 'undefined' && MP.active) {
        if (switchForced) {
            MP.forcedSwitch(newIndex);
        } else {
            // FIX #2: en MP, limpiar leechSeed también cuando el enemigo cambia
            // Esto se gestiona desde el servidor al recibir el evento de cambio
            MP.chooseSwitch(newIndex);
            document.getElementById('switchModal').classList.remove('open');
            return;
        }
    }

    playerActive = newIndex;
    const newPoke = playerTeam[playerActive];
    newPoke.turnsInField = 0;
    newPoke.flinched = false;

    document.getElementById('switchModal').classList.remove('open');
    addLog('━━━━━━━━━━━━━━', 'separator');
    addLog(`🔄 ${oldName} regresa. ¡Adelante, ${newPoke.name}!`, 'important');

    applyAbilitySwitchIn(newPoke, enemyTeam[enemyActive], (msg, t) => addLog(msg, t));
    applyHazardsOnSwitchIn(newPoke, 'player');

    updateUI();
    renderMoves();

    if (!switchForced) {
        isBusy = true;
        disableMoves();
        const enemy = enemyTeam[enemyActive];
        const emIdx = chooseEnemyMove(enemy, newPoke);
        setTimeout(() => executeAttack(enemy, newPoke, enemy.moves[emIdx], 'enemy', true, null, () => afterTurn()), 800);
    } else {
        switchForced = false;
        isBusy = false;
    }
}

// ─── FIN DE BATALLA ───────────────────────────────────────────────────────────
function endBattle(playerWon) {
    battleOver = true;
    isBusy = true;

    if (typeof currentBGM !== 'undefined' && currentBGM) {
        currentBGM.pause();
        currentBGM = null;
    }

    addLog('━━━━━━━━━━━━━━', 'separator');
    addLog(playerWon ? '🏆 ¡VICTORIA TOTAL!' : '💀 HAS SIDO DERROTADO', 'important');
    setTimeout(() => {
        const modal = document.getElementById('resultModal');
        document.getElementById('resultTitle').innerHTML = playerWon
            ? '<span style="color:#fbbf24;">🎉 ¡VICTORIA!</span>'
            : '<span style="color:#ef4444;">💀 DERROTA</span>';
        document.getElementById('resultMsg').textContent = playerWon
            ? '¡Has derrotado a todos los Pokémon rivales!'
            : 'Todos tus Pokémon fueron derrotados... ¡Entrena más!';
        modal.classList.add('open');
    }, 1800);
}

function confirmSurrender() {
    if (!confirm('¿Seguro que quieres rendirte?')) return;
    if (typeof MP !== 'undefined' && MP.active) {
        MP.surrender();
    }
    endBattle(false);
}
