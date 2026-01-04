import { PLAYER_TURNS, positionalFigures } from './constants.js';
import { DOM } from './dom.js';
import { isMovePossible } from './movement.js';

/**
 * gets pieces that can move
 * @param {string} color - player color
 * @returns {Array<number>} array of indices of pieces that can move
 */
export function getMovableFigures(color) {
    const movableFigures = [];

    for (let i = 1; i <= 4; i++) {
        const position = positionalFigures[color][i];

        // figures outside the starting area
        if (!position.startsWith('starting_player')) {
            movableFigures.push(i - 1);
        }
    }

    return movableFigures;
}

/**
 * highlights figures that can move
 * @param {Object} containerFigures - all players figures
 * @param {string} color - current players color
 * @param {Array<number>} movableIndices - indices of pieces that can move
 */
export function highlightMovableFigures(containerFigures, color, movableIndices) {
    // remove the backlight from all figures
    clearAllHighlights(containerFigures);

    // highlighting available shapes
    movableIndices.forEach(index => {
        const figure = containerFigures[color][index];
        const starIcon = figure.firstElementChild;

        if (starIcon) {
            starIcon.style.display = 'block';
        }
    });
}

/**
 * removes highlighting from all figures
 * @param {Object} containerFigures - all players figures
 */
export function clearAllHighlights(containerFigures) {
    for (let color in containerFigures) {
        containerFigures[color].forEach(figure => {
            const starIcon = figure.firstElementChild;
            if (starIcon) {
                starIcon.removeAttribute('style');
            }
        });
    }
}

/**
 * switches the turn to the next player
 * @returns {string} next players color
 */
export function switchToNextPlayer() {
    const currentIndex = PLAYER_TURNS.playerQueueArray.indexOf(PLAYER_TURNS.color);
    const nextIndex = (currentIndex + 1) % PLAYER_TURNS.playerQueueArray.length;

    PLAYER_TURNS.color = PLAYER_TURNS.playerQueueArray[nextIndex];
    PLAYER_TURNS.diceMove = true;
    PLAYER_TURNS.diceNumber = null;

    return PLAYER_TURNS.color;
}

/**
 * checks whether the die result allows a repeat move.
 * @param {number} diceValue - value on the cube
 * @returns {boolean}
 */
export function shouldGrantExtraTurn(diceValue) {
    return diceValue === 6;
}

/**
 * updates the visual indicators of the current turn
 * @param {string} currentColor - current players color
 */
export function updateTurnIndicators(currentColor) {
    // hide all arrows
    DOM.arrowReminder.forEach(arrow => {
        arrow.style.visibility = 'hidden';
    });

    // show the current player's arrow
    DOM.arrowReminder.forEach(arrow => {
        if (arrow.classList.contains(currentColor)) {
            arrow.style.visibility = 'visible';
        }
    });
}

/**
 * determines the available moves after rolling the dice.
 * @param {Object} containerFigures - all players figures
 */
export function determineAvailableMoves(containerFigures) {
    const color = PLAYER_TURNS.color;
    const diceValue = PLAYER_TURNS.diceNumber;

    const movableFigures = getMovableFigures(color);

    // if there are no pieces on the board and 6 has not rolled, we switch the turn
    if (movableFigures.length === 0 && diceValue !== 6) {
        setTimeout(() => {
            switchToNextPlayer();
            updateTurnIndicators(PLAYER_TURNS.color);
        }, 800);
        return;
    }

    // we determine which pieces can move
    const availableIndices = [];

    if (diceValue === 6) {
        // with a six, all pieces can move.
        for (let i = 0; i < 4; i++) {
            if (isMovePossible(color, i, diceValue)) {
                availableIndices.push(i);
            }
        }
    } else {
        // without the six - only pieces on the board
        movableFigures.forEach(index => {
            if (isMovePossible(color, index, diceValue)) {
                availableIndices.push(index);
            }
        });
    }

    // if there are no available moves, switch players
    if (availableIndices.length === 0) {
        setTimeout(() => {
            switchToNextPlayer();
            updateTurnIndicators(PLAYER_TURNS.color);
        }, 800);
        return;
    }

    // highlighting available shapes
    setTimeout(() => {
        highlightMovableFigures(containerFigures, color, availableIndices);
    }, 800);
}

/**
 * ends a players turn after moving a piece
 * @param {boolean} extraTurnGranted - is an extra move given?
 */
export function completeTurn(extraTurnGranted = false) {
    if (!extraTurnGranted) {
        switchToNextPlayer();
    } else {
        // an extra turn is simply allowing the dice to be rolled again.
        PLAYER_TURNS.diceMove = true;
    }

    updateTurnIndicators(PLAYER_TURNS.color);
}