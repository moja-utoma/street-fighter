import { createFighterImage } from '../fighterPreview';
import showModal from './modal';

export default function showWinnerModal(fighter) {
    const bodyElement = createFighterImage(fighter);
    showModal({
        title: `${fighter.name} wins!`,
        bodyElement,
        onClose: () => window.location.reload()
    });
}
