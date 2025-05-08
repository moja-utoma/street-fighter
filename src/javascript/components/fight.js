import controls from '../../constants/controls';

export function getHitPower(fighter) {
    const criticalHitChance = Math.random() + 1;
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    const dodgeChance = Math.random() + 1;
    return fighter.defense * dodgeChance;
}

export function getDamage(attacker, defender) {
    const hitPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);
    return Math.max(hitPower - blockPower, 0);
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        let firstHealth = firstFighter.health;
        let secondHealth = secondFighter.health;

        const firstHealthBar = document.getElementById('left-fighter-indicator');
        const secondHealthBar = document.getElementById('right-fighter-indicator');

        const pressedKeys = new Set();
        const criticalCooldown = {
            first: false,
            second: false
        };

        const states = {
            first: { blocking: false },
            second: { blocking: false }
        };

        const logElement = document.querySelector('.arena___battle-log');
        const logAction = text => {
            const entry = document.createElement('div');
            entry.textContent = text;
            logElement.append(entry);
            logElement.scrollTop = logElement.scrollHeight;
        };

        const updateBar = (bar, current, total, position) => {
            const percentage = Math.max(0, (current / total) * 100);

            const updatedBar = { ...bar };
            updatedBar.style.width = `${percentage}%`;
            bar.classList.remove('low', 'medium', 'high');
            bar.style.width = updatedBar.style.width;

            const healthText = document.getElementById(`${position}-health-text`);
            healthText.innerText = `${current.toFixed(2) < 0 ? 0 : current.toFixed(2)}`;

            if (percentage <= 30) {
                bar.classList.add('low');
            } else if (percentage <= 60) {
                bar.classList.add('medium');
            } else {
                bar.classList.add('high');
            }

            bar.setAttribute('data-health', `${Math.round(current)} / ${total}`);
        };

        const cleanup = () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };

        const checkWinner = () => {
            if (firstHealth <= 0) {
                cleanup();
                resolve(secondFighter);
            } else if (secondHealth <= 0) {
                cleanup();
                resolve(firstFighter);
            }
        };

        const onKeyDown = e => {
            pressedKeys.add(e.code);

            if (e.code === controls.PlayerOneAttack && !states.first.blocking) {
                const damage = getDamage(firstFighter, secondFighter);
                secondHealth -= damage;
                updateBar(secondHealthBar, secondHealth, secondFighter.health, 'right');
                logAction(`👊 Player One attacks! Damage: ${damage.toFixed(2)}`);
                checkWinner();
            }

            if (e.code === controls.PlayerTwoAttack && !states.second.blocking) {
                const damage = getDamage(secondFighter, firstFighter);
                firstHealth -= damage;
                updateBar(firstHealthBar, firstHealth, firstFighter.health, 'left');
                logAction(`👊 Player Two attacks! Damage: ${damage.toFixed(2)}`);
                checkWinner();
            }

            if (e.code === controls.PlayerOneBlock) {
                states.first.blocking = true;
                const blockPower = getBlockPower(firstFighter);
                logAction(`🛡️ Player One blocks. Block power: ${blockPower.toFixed(2)}`);
            }

            if (e.code === controls.PlayerTwoBlock) {
                states.second.blocking = true;
                const blockPower = getBlockPower(secondFighter);
                logAction(`🛡️ Player Two blocks. Block power: ${blockPower.toFixed(2)}`);
            }

            const playerOneCritKeys = controls.PlayerOneCriticalHitCombination;
            const playerTwoCritKeys = controls.PlayerTwoCriticalHitCombination;

            const hasAll = keysArray => keysArray.every(key => pressedKeys.has(key));

            if (hasAll(playerOneCritKeys) && !criticalCooldown.first) {
                secondHealth -= firstFighter.attack * 2;
                updateBar(secondHealthBar, secondHealth, secondFighter.health, 'right');
                logAction(`💥 Player One lands CRITICAL HIT! Damage: ${firstFighter.attack * 2}`);
                criticalCooldown.first = true;
                setTimeout(() => {
                    criticalCooldown.first = false;
                }, 10000);
                checkWinner();
            }

            if (hasAll(playerTwoCritKeys) && !criticalCooldown.second) {
                firstHealth -= secondFighter.attack * 2;
                updateBar(firstHealthBar, firstHealth, firstFighter.health, 'left');
                logAction(`💥 Player Two lands CRITICAL HIT! Damage: ${secondFighter.attack * 2}`);
                criticalCooldown.second = true;
                setTimeout(() => {
                    criticalCooldown.second = false;
                }, 10000);
                checkWinner();
            }
        };

        const onKeyUp = e => {
            pressedKeys.delete(e.code);
            if (e.code === controls.PlayerOneBlock) {
                states.first.blocking = false;
            }
            if (e.code === controls.PlayerTwoBlock) {
                states.second.blocking = false;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    });
}
