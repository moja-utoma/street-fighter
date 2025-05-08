import createElement from '../helpers/domHelper';
import renderArena from './arena';
import versusImg from '../../../resources/versus.png';
import { createFighterPreview } from './fighterPreview';
import fighterService from '../services/fightersService';

const fighterDetailsMap = new Map();

export async function getFighterInfo(fighterId) {
    if (fighterDetailsMap.has(fighterId)) {
        return fighterDetailsMap.get(fighterId);
    }

    try {
        const fighterDetails = await fighterService.getFighterDetails(fighterId);
        fighterDetailsMap.set(fighterId, fighterDetails);

        return fighterDetails;
    } catch (error) {
        console.error(`Failed to fetch fighter details for ID ${fighterId}:`, error);
        return null;
    }
}

function startFight(selectedFighters) {
    renderArena(selectedFighters);
}

function createVersusBlock(selectedFighters) {
    const canStartFight = selectedFighters.filter(Boolean).length === 2;
    const onClick = () => startFight(selectedFighters);
    const container = createElement({ tagName: 'div', className: 'preview-container___versus-block' });
    const image = createElement({
        tagName: 'img',
        className: 'preview-container___versus-img',
        attributes: { src: versusImg }
    });
    const disabledBtn = canStartFight ? '' : 'disabled';
    const fightBtn = createElement({
        tagName: 'button',
        className: `preview-container___fight-btn ${disabledBtn}`
    });

    fightBtn.addEventListener('click', onClick, false);
    fightBtn.innerText = 'Fight';
    container.append(image, fightBtn);

    return container;
}

function renderSelectedFighters(selectedFighters, onRemoveFighter) {
    const fightersPreview = document.querySelector('.preview-container___root');
    const [playerOne, playerTwo] = selectedFighters;
    const firstPreview = createFighterPreview(playerOne, 'left');
    const secondPreview = createFighterPreview(playerTwo, 'right');
    const versusBlock = createVersusBlock(selectedFighters);

    if (playerOne) {
        firstPreview.addEventListener('click', () => {
            onRemoveFighter(0);
        });
    }
    if (playerTwo) {
        secondPreview.addEventListener('click', () => {
            onRemoveFighter(1);
        });
    }

    fightersPreview.innerHTML = '';
    fightersPreview.append(firstPreview, versusBlock, secondPreview);
}

export function createFightersSelector() {
    let selectedFighters = [];

    function removeFighter(index) {
        selectedFighters[index] = null;
        renderSelectedFighters(selectedFighters, removeFighter);
    }

    return async (event, fighterId) => {
        if (selectedFighters.some(f => f && f._id === fighterId)) return;

        const fighter = await getFighterInfo(fighterId);
        const [playerOne, playerTwo] = selectedFighters;

        const firstFighter = playerOne ?? fighter;
        const secondFighter = playerOne ? playerTwo ?? fighter : playerTwo;

        selectedFighters = [firstFighter, secondFighter];

        renderSelectedFighters(selectedFighters, removeFighter);
    };
}
