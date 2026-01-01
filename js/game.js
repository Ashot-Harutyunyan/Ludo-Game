import { COLORS, PLAYER_TURNS, positionalFigures } from './constants.js';
import { DOM } from './dom.js';
import { executeMove, hasReachedHome } from './movement.js';
import {
    determineAvailableMoves,
    completeTurn,
    shouldGrantExtraTurn,
    clearAllHighlights,
    updateTurnIndicators
} from './turn-manager.js';
import { homeContainerFigures } from './board.js'

/**
 * Hides or shows players' pieces
 * @param {Object} containerFigures - object with figures of players
 * @param {Array<string>} activeColors - active color array
 */
export function togglePlayerFigures(containerFigures, activeColors) {
    // First, hide all the shapes.
    for (let color in containerFigures) {
        containerFigures[color].forEach(figure => {
            figure.classList.add('hidden');
        });
    }

    // Show only active figures
    if (activeColors) {
        activeColors.forEach(color => {
            containerFigures[color].forEach(player => {
                player.classList.remove('hidden');
            });
        });
    }
}

/**
 * Adjusts the visibility of players and UI elements
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
 * Defines colors for a 2-player game
 * @param {string} selectedColor - selected color
 * @returns {Array<string>} two-color array
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
 * Hides the dice of inactive players
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
 * @param {string} selectedColor - current player's color
 */
function setupArrowReminders(selectedColor) {
    DOM.arrowReminder.forEach(element => {
        element.style.visibility = element.classList.contains(selectedColor) ? '' : 'hidden';
    });
}

/**
 * Sorts the array of active colors so that the selected color is first.
 * @param {Array<string>} colors - Array of active player colors
 * @param {string} selectedColor - The color the game starts with
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
 * Creates a click handler for a shape.
 * @param {HTMLElement} figure - figure element
 * @param {string} color - figure color
 * @param {number} index - figure index
 * @param {Object} containerFigures - all players' figures
 * @returns {Function} event handler
 */
function createFigureClickHandler(figure, color, index, containerFigures) {
    return function handleFigureClick() {
        // We check that the piece is highlighted (available for moving)
        const starIcon = figure.firstElementChild;
        if (!starIcon || starIcon.style.display !== 'block') {
            return;
        }

        // We check that this color is currently in play
        if (color !== PLAYER_TURNS.color) {
            return;
        }

        // We perform the move
        const moveSuccessful = executeMove(figure, color, index);

        if (moveSuccessful) {
            // We check whether the throw gives the right to an extra turn
            const extraTurn = shouldGrantExtraTurn(PLAYER_TURNS.diceNumber);

            // We finish the move
            completeTurn(containerFigures, extraTurn);

            console.log(`Figure ${color}-${index + 1} moved successfully`);
        } else {
            console.log(`Move not possible for ${color}-${index + 1}`);
        }
    };
}

/**
 * Initializes click handlers for all shapes.
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
 * Launches a new game
 * @param {string} selectedColor - selected color
 * @param {number} playersCount - number of players
 * @param {Object} containerFigures - object with figures of players
 */
export function startGame(selectedColor, playersCount, containerFigures) {
    console.log('Starting game:', { selectedColor, playersCount });

    // Customizing the UI and getting active colors
    const activeColors = setupGameUI(selectedColor, playersCount, containerFigures);

    // Determining the order of moves
    const turnOrder = sortColorsByTurnOrder(activeColors, selectedColor);

    // Initializing the game state
    PLAYER_TURNS.color = turnOrder[0];
    PLAYER_TURNS.diceMove = true;
    PLAYER_TURNS.diceNumber = null;
    PLAYER_TURNS.playerQueueArray = turnOrder;

    // Initializing shape click handlers
    setupFigureClickHandlers(containerFigures);

    // Updated visual indicators
    updateTurnIndicators(PLAYER_TURNS.color);

    console.log('Game initialized:', { turnOrder, firstPlayer: PLAYER_TURNS.color });
}

/**
 * Called after the dice are rolled to determine available moves
 * @param {Object} containerFigures - object with figures of players
 */
export function handleDiceRoll(containerFigures) {
    determineAvailableMoves(containerFigures);
}

/**
 * Resets the game state
 * @param {Object} containerFigures - object with figures of players
 */
export function resetGameState(containerFigures) {
    clearAllHighlights(containerFigures);

    PLAYER_TURNS.color = '';
    PLAYER_TURNS.diceMove = false;
    PLAYER_TURNS.diceNumber = null;
    PLAYER_TURNS.playerQueueArray = [];

    for(let color in positionalFigures) {
        for(let key in positionalFigures[color]) {
            positionalFigures[color][key] = `starting_player_${color}_${key}`;
            homeContainerFigures[color][key - 1].appendChild(containerFigures[color][key - 1])
        }
    }
}