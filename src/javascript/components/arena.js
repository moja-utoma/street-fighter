import createElement from '../helpers/domHelper';
import { fight } from './fight';
import { createFighterImage } from './fighterPreview';
import showWinnerModal from './modal/winner';

function createFighter(fighter, position) {
    const imgElement = createFighterImage(fighter);
    const positionClassName = position === 'right' ? 'arena___right-fighter' : 'arena___left-fighter';
    const fighterElement = createElement({
        tagName: 'div',
        className: `arena___fighter ${positionClassName}`
    });

    fighterElement.append(imgElement);
    return fighterElement;
}

function createFighters(firstFighter, secondFighter) {
    const battleField = createElement({ tagName: 'div', className: `arena___battlefield` });
    const firstFighterElement = createFighter(firstFighter, 'left');
    const secondFighterElement = createFighter(secondFighter, 'right');

    battleField.append(firstFighterElement, secondFighterElement);
    return battleField;
}

function createHealthIndicator(fighter, position) {
    const { name, health } = fighter;
    const container = createElement({ tagName: 'div', className: 'arena___fighter-indicator' });
    const fighterName = createElement({ tagName: 'span', className: 'arena___fighter-name' });
    const indicator = createElement({ tagName: 'div', className: 'arena___health-indicator' });
    const bar = createElement({
        tagName: 'div',
        className: 'arena___health-bar',
        attributes: { id: `${position}-fighter-indicator` }
    });

    const healthText = createElement({
        tagName: 'div',
        className: 'arena___health-text',
        attributes: { id: `${position}-health-text` }
    });

    fighterName.innerText = name;
    healthText.innerText = `${health}`;

    indicator.append(bar);
    container.append(fighterName, indicator, healthText);

    return container;
}

function createHealthIndicators(leftFighter, rightFighter) {
    const healthIndicators = createElement({ tagName: 'div', className: 'arena___fight-status' });
    const versusSign = createElement({ tagName: 'div', className: 'arena___versus-sign' });
    const leftFighterIndicator = createHealthIndicator(leftFighter, 'left');
    const rightFighterIndicator = createHealthIndicator(rightFighter, 'right');

    healthIndicators.append(leftFighterIndicator, versusSign, rightFighterIndicator);
    return healthIndicators;
}

function createBattleLog() {
    const log = document.createElement('div');
    log.className = 'arena___battle-log';

    const initialMessage = document.createElement('div');
    initialMessage.textContent = '📜 Battle Log';
    initialMessage.style.fontWeight = 'bold';
    initialMessage.style.marginBottom = '0.5rem';

    log.append(initialMessage);
    return log;
}

function createArena(selectedFighters) {
    const arena = createElement({ tagName: 'div', className: 'arena___root' });
    const healthIndicators = createHealthIndicators(...selectedFighters);
    const fighters = createFighters(...selectedFighters);
    const log = createBattleLog();

    arena.append(healthIndicators, fighters, log);
    return arena;
}

export default async function renderArena(selectedFighters) {
    const root = document.getElementById('root');
    const arena = createArena(selectedFighters);

    root.innerHTML = '';
    root.append(arena);

    await fight(...selectedFighters).then(winner => {
        showWinnerModal(winner);
    });
}
