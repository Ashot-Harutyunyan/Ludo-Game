import { PLAYER_TURNS, positionalFigures } from './constants.js';
import { DOM } from './dom.js';
import { isMovePossible } from './movement.js';

/**
 * Gets pieces that can move
 * @param {string} color - player color
 * @returns {Array<number>} array of indices of pieces that can move
 */
export function getMovableFigures(color) {
    const movableFigures = [];

    for (let i = 1; i <= 4; i++) {
        const position = positionalFigures[color][i];

        // Figures outside the starting area
        if (!position.startsWith('starting_player')) {
            movableFigures.push(i - 1);
        }
    }

    return movableFigures;
}

/**
 * Highlights figures that can move
 * @param {Object} containerFigures - all players' figures
 * @param {string} color - current player's color
 * @param {Array<number>} movableIndices - indices of pieces that can move
 */
export function highlightMovableFigures(containerFigures, color, movableIndices) {
    // Remove the backlight from all figures
    clearAllHighlights(containerFigures);

    // Highlighting available shapes
    movableIndices.forEach(index => {
        const figure = containerFigures[color][index];
        const starIcon = figure.firstElementChild;

        if (starIcon) {
            starIcon.style.display = 'block';
        }
    });
}

/**
 * Removes highlighting from all figures
 * @param {Object} containerFigures - all players' figures
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
 * Switches the turn to the next player
 * @returns {string} next player's color
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
 * Checks whether the die result allows a repeat move.
 * @param {number} diceValue - value on the cube
 * @returns {boolean}
 */
export function shouldGrantExtraTurn(diceValue) {
    return diceValue === 6;
}

/**
 * Updates the visual indicators of the current turn
 * @param {string} currentColor - current player's color
 */
export function updateTurnIndicators(currentColor) {
    // Hide all arrows
    DOM.arrowReminder.forEach(arrow => {
        arrow.style.visibility = 'hidden';
    });

    // Show the current player's arrow
    DOM.arrowReminder.forEach(arrow => {
        if (arrow.classList.contains(currentColor)) {
            arrow.style.visibility = 'visible';
        }
    });
}

/**
 * Determines the available moves after rolling the dice
 * @param {Object} containerFigures - all players' figures
 */
export function determineAvailableMoves(containerFigures) {
    const color = PLAYER_TURNS.color;
    const diceValue = PLAYER_TURNS.diceNumber;

    const movableFigures = getMovableFigures(color);

    // If there are no pieces on the board and 6 has not rolled, we switch the turn
    if (movableFigures.length === 0 && diceValue !== 6) {
        setTimeout(() => {
            switchToNextPlayer();
            updateTurnIndicators(PLAYER_TURNS.color);
        }, 800);
        return;
    }

    // We determine which pieces can move
    const availableIndices = [];

    if (diceValue === 6) {
        // With a six, all pieces can move.
        for (let i = 0; i < 4; i++) {
            if (isMovePossible(color, i, diceValue)) {
                availableIndices.push(i);
            }
        }
    } else {
        // Without the six - only pieces on the board
        movableFigures.forEach(index => {
            if (isMovePossible(color, index, diceValue)) {
                availableIndices.push(index);
            }
        });
    }

    // If there are no available moves, switch players
    if (availableIndices.length === 0) {
        setTimeout(() => {
            switchToNextPlayer();
            updateTurnIndicators(PLAYER_TURNS.color);
        }, 800);
        return;
    }

    // Highlighting available shapes
    setTimeout(() => {
        highlightMovableFigures(containerFigures, color, availableIndices);
    }, 800);
}

/**
 * Ends a player's turn after moving a piece
 * @param {Object} containerFigures - all players' figures
 * @param {boolean} extraTurnGranted - Is an extra move given?
 */
export function completeTurn(containerFigures, extraTurnGranted = false) {
    clearAllHighlights(containerFigures);

    if (!extraTurnGranted) {
        switchToNextPlayer();
    } else {
        // An extra turn is simply allowing the dice to be rolled again.
        PLAYER_TURNS.diceMove = true;
    }

    updateTurnIndicators(PLAYER_TURNS.color);
}