import { COLORS } from './constants.js';
import { DOM } from './dom.js';

/**
 * Hides or shows players' pieces
 * @param {Object} containerFigures - object with figures of players
 * @param {Array<string>} activeColors - active color array
 */
export function togglePlayerFigures(containerFigures, activeColors) {
    // First, hide all the shapes
    for (let color in containerFigures) {
        containerFigures[color].forEach(figure => {
            figure.classList.add('hidden');
        });
    }

    // Show only active figures
    if (activeColors) {
        activeColors.forEach(color => {
            const players = containerFigures[color];
            players.forEach(player => {
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
 */
export function setupGameUI(selectedColor, playersCount, containerFigures) {
    let activeColors;

    if (playersCount === 2) {
        activeColors = getTwoPlayerColors(selectedColor);
        hideInactiveDice(activeColors);
    } else if (playersCount === 4) {
        activeColors = [COLORS.BLUE, COLORS.RED, COLORS.GREEN, COLORS.YELLOW];
    }

    togglePlayerFigures(containerFigures, activeColors);
    setupArrowReminders(selectedColor);
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
    DOM.containerPlayerAndDice.forEach((element) => {
        const isActive = activeColors.some(color => element.classList.contains(color));
        element.style.visibility = isActive ? '' : 'hidden';
    });
}

/**
 * Sets the reminder arrows for the current player
 * @param {string} selectedColor - current player's color
 */
function setupArrowReminders(selectedColor) {
    DOM.arrowReminder.forEach(element => {
        element.style.visibility = element.classList.contains(selectedColor) ? '' : 'hidden';
    });
}

/**
 * Launches a new game
 * @param {string} selectedColor - Selected color
 * @param {number} playersCount - Number of players
 * @param {Object} containerFigures - Object with player figures
 */
export function startGame(selectedColor, playersCount, containerFigures) {
    console.log('Starting game with:', { selectedColor, playersCount });
    setupGameUI(selectedColor, playersCount, containerFigures);
}