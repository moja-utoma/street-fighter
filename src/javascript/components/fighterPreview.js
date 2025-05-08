import createElement from '../helpers/domHelper';

function createStatRow(label, value) {
    const row = createElement({ tagName: 'p' });
    row.innerHTML = `<strong>${label}:</strong> ${value}`;
    return row;
}

function createFighterStats(fighter) {
    const { name, health, attack, defense } = fighter;

    const statsWrapper = createElement({ tagName: 'div', className: 'fighter-preview___info' });

    const nameEl = createStatRow('Name', name);
    const healthEl = createStatRow('Health', health);
    const attackEl = createStatRow('Attack', attack);
    const defenseEl = createStatRow('Defense', defense);

    statsWrapper.append(nameEl, healthEl, attackEl, defenseEl);
    return statsWrapper;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (!fighter) return fighterElement;

    const image = createFighterImage(fighter);
    const stats = createFighterStats(fighter);

    fighterElement.appendChild(image);
    fighterElement.appendChild(stats);

    return fighterElement;
}
