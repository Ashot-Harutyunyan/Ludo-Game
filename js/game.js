import { COLORS, PLAYER_TURNS, positionalFigures } from './constants.js';
import { DOM } from './dom.js';
import { executeMove, checkCapture, returnCapturedFigures } from './movement.js';
import {
    determineAvailableMoves,
    completeTurn,
    shouldGrantExtraTurn,
    clearAllHighlights,
    updateTurnIndicators
} from './turn-manager.js';
import { homeContainerFigures } from './board.js';

/**
 * hides or shows players pieces
 * @param {Object} containerFigures - object with figures of players
 * @param {Array<string>} activeColors - active color array
 */
export function togglePlayerFigures(containerFigures, activeColors) {
    // first, hide all the shapes.
    for (let color in containerFigures) {
        containerFigures[color].forEach(figure => {
            figure.classList.add('hidden');
        });
    }

    // show only active figures
    if (activeColors) {
        activeColors.forEach(color => {
            containerFigures[color].forEach(player => {
                player.classList.remove('hidden');
            });
        });
    }
}

/**
 * adjusts the visibility of players and UI elements
 * @param {string} selectedColor - selected color
 * @param {number} playersCount - number of players
 * @param {Object} containerFigures - object with figures of players
 * @returns {Array<string>} active color array
 */
export function setupGameUI(selectedColor, playersCount, containerFigures) {
    let activeColors;

    if (playersCount === 2) {
        activeColors = getTwoPlayerColors(selectedColor);
        hideInactiveDice(activeColors);
    } else {
        activeColors = [COLORS.BLUE, COLORS.RED, COLORS.GREEN, COLORS.YELLOW];
    }

    togglePlayerFigures(containerFigures, activeColors);
    setupArrowReminders(selectedColor);

    return activeColors;
}

/**
 * defines colors for a 2-player game
 * @param {string} selectedColor - selected color
 * @returns {Array<string>} two color array
 */
function getTwoPlayerColors(selectedColor) {
    const colorPairs = {
        [COLORS.BLUE]: [COLORS.BLUE, COLORS.RED],
        [COLORS.RED]: [COLORS.BLUE, COLORS.RED],
        [COLORS.GREEN]: [COLORS.GREEN, COLORS.YELLOW],
        [COLORS.YELLOW]: [COLORS.GREEN, COLORS.YELLOW]
    };

    return colorPairs[selectedColor];
}

/**
 * hides the dice of inactive players
 * @param {Array<string>} activeColors - active color array
 */
function hideInactiveDice(activeColors) {
    DOM.containerPlayerAndDice.forEach(element => {
        const isActive = activeColors.some(color => element.classList.contains(color));
        element.style.visibility = isActive ? '' : 'hidden';
    });
}

/**
 * Sets the reminder arrows for the current player.
 * @param {string} selectedColor - current players color
 */
function setupArrowReminders(selectedColor) {
    DOM.arrowReminder.forEach(element => {
        element.style.visibility = element.classList.contains(selectedColor) ? '' : 'hidden';
    });
}

/**
 * sorts the array of active colors so that the selected color is first.
 * @param {Array<string>} colors - array of active player colors
 * @param {string} selectedColor - the color the game starts with
 * @returns {Array<string>} sorted array of colors
 */
function sortColorsByTurnOrder(colors, selectedColor) {
    const COLOR_ORDER = ['yellow', 'blue', 'green', 'red'];

    if (colors.length < 3) {
        return colors[0] === selectedColor ? [...colors] : [...colors].reverse();
    }

    const startIndex = COLOR_ORDER.indexOf(selectedColor);
    if (startIndex === -1) return [...colors];

    return COLOR_ORDER
        .slice(startIndex)
        .concat(COLOR_ORDER.slice(0, startIndex))
        .filter(color => colors.includes(color));
}

/**
 * creates a click handler for a shape.
 * @param {HTMLElement} figure - figure element
 * @param {string} color - figure color
 * @param {number} index - figure index
 * @param {Object} containerFigures - all players figures
 * @returns {Function} event handler
 */
function createFigureClickHandler(figure, color, index, containerFigures) {
    return async function handleFigureClick() {
        // we check that the piece is highlighted (available for moving)
        const starIcon = figure.firstElementChild;
        if (!starIcon || starIcon.style.display !== 'block') {
            return;
        }

        // we check that this color is currently in play.
        if (color !== PLAYER_TURNS.color) {
            return;
        }

        // removes highlighting from all figures
        clearAllHighlights(containerFigures);
        // we perform the move
        const newPosition = await executeMove(figure, color, index);

        if (newPosition) {
            // checking the enemy's capture
            const captureInfo = checkCapture(newPosition, color);

            if (captureInfo.length > 0) {
                // returning the captured piece home
                await returnCapturedFigures(captureInfo, containerFigures);
            }

            // check if the throw gives the right to an extra turn
            // also give an extra turn if the piece is captured or goes home
            const extraTurn = shouldGrantExtraTurn(PLAYER_TURNS.diceNumber) || captureInfo.length > 0 || newPosition === `home_${color}`;

            // we finish the move
            completeTurn(extraTurn);
        } else {
            console.log(`The move is impossible for ${color}-${index + 1}`);
        }
    };
}

/**
 * initializes click handlers for all shapes.
 * @param {Object} containerFigures - object with figures of players
 */
function setupFigureClickHandlers(containerFigures) {
    for (let color in containerFigures) {
        containerFigures[color].forEach((figure, index) => {
            const handler = createFigureClickHandler(figure, color, index, containerFigures);
            figure.addEventListener('click', handler);
        });
    }
}

/**
 * launches a new game
 * @param {string} selectedColor - selected color
 * @param {number} playersCount - number of players
 * @param {Object} containerFigures - object with figures of players
 */
export function startGame(selectedColor, playersCount, containerFigures) {
    // customizing the UI and getting active colors
    const activeColors = setupGameUI(selectedColor, playersCount, containerFigures);

    // determining the order of moves
    const turnOrder = sortColorsByTurnOrder(activeColors, selectedColor);

    // initializing the game state
    PLAYER_TURNS.color = turnOrder[0];
    PLAYER_TURNS.diceMove = true;
    PLAYER_TURNS.diceNumber = null;
    PLAYER_TURNS.playerQueueArray = turnOrder;

    // initializing shape click handlers
    setupFigureClickHandlers(containerFigures);

    // updated visual indicators
    updateTurnIndicators(PLAYER_TURNS.color);
}

/**
 * called after the dice are rolled to determine available moves
 * @param {Object} containerFigures - object with figures of players
 */
export function handleDiceRoll(containerFigures) {
    determineAvailableMoves(containerFigures);
}

/**
 * resets the game state
 * @param {Object} containerFigures - object with figures of players
 */
export function resetGameState(containerFigures) {
    clearAllHighlights(containerFigures);

    PLAYER_TURNS.color = '';
    PLAYER_TURNS.diceMove = false;
    PLAYER_TURNS.diceNumber = null;
    PLAYER_TURNS.playerQueueArray = [];

    // return all figures to their original positions
    for (let color in positionalFigures) {
        for (let value in positionalFigures[color]) {
            positionalFigures[color][value] = `starting_player_${color}_${value}`;
            homeContainerFigures[color][value - 1].appendChild(containerFigures[color][value - 1]);
        }
    }
}