import { PLAYER_TURNS, positionalFigures, pathArray, homePathEntries, nearTheHouse } from './constants.js';
import { DOM } from './dom.js';

/**
 * Checks if the figure can leave the house
 * @param {string} color - player color
 * @param {number} figureIndex - figure index (0-3)
 * @returns {boolean}
 */
export function canLeaveSafeZone(color, figureIndex) {
    const location = positionalFigures[color][figureIndex + 1];
    return location.startsWith('starting_player') && PLAYER_TURNS.diceNumber === 6;
}

/**
 * Moves a piece from the starting area to the first square of the path
 * @param {HTMLElement} figureElement - figure element
 * @param {string} color - player color
 * @param {number} figureIndex - figure index (0-3)
 */
export function moveFromSafeZone(figureElement, color, figureIndex) {
    const targetCellId = `${color[0]}1`;

    DOM.playingFields.forEach(cell => {
        if (cell.id === targetCellId) {
            cell.appendChild(figureElement);
        }
    });

    positionalFigures[color][figureIndex + 1] = targetCellId;
}

/**
 * Calculates the new position of a piece on the board
 * @param {string} currentPosition - current position
 * @param {number} steps - number of steps
 * @param {string} color - player color
 * @returns {string|null} new position or null if not possible
 */
export function calculateNewPosition(currentPosition, steps, color) {
    // Checking if a figure is on a home path
    const homePathIndex = homePathEntries[color].indexOf(currentPosition);
    if (homePathIndex !== -1) {
        // The figure is already on its way home
        const newHomeIndex = homePathIndex + steps;
        
        if (newHomeIndex >= homePathEntries[color].length) {
            return null; // Going beyond the home path
        }
        
        return homePathEntries[color][newHomeIndex];
    }

    // Figure on the main path
    const currentIndex = pathArray.indexOf(currentPosition);

    if (currentIndex === -1) return null;

    // Checking for entry into the home path
    const nearHouseCell = nearTheHouse[color];
    const nearHouseIndex = pathArray.indexOf(nearHouseCell);

    // We check whether the figure will pass through the entry point into the house
    let newIndex = currentIndex + steps;
    
    // If the index is outside the array bounds, we perform a cyclic transition
    if (newIndex >= pathArray.length) {
        newIndex = newIndex % pathArray.length;
    }

    // Checking the home path entry
    // We need to check if the path goes through nearHouseIndex
    if (currentIndex <= nearHouseIndex && newIndex > nearHouseIndex) {
        // Common case: moving forward through the entry point
        const stepsAfterEntry = newIndex - nearHouseIndex - 1;
        
        if (stepsAfterEntry >= homePathEntries[color].length) {
            return null; // Going beyond the home path
        }
        
        return homePathEntries[color][stepsAfterEntry];
    } else if (currentIndex <= nearHouseIndex && newIndex < currentIndex) {
        // Case with a cyclic transition: the figure passed through 0
        // Check if we passed the entry point to the house
        const totalSteps = (pathArray.length - currentIndex) + newIndex;
        const stepsToEntry = nearHouseIndex - currentIndex;
        
        if (totalSteps > stepsToEntry) {
            // The figure must enter the home path
            const stepsAfterEntry = totalSteps - stepsToEntry - 1;
            
            if (stepsAfterEntry >= homePathEntries[color].length) {
                return null; // Going Beyond Boundaries
            }
            
            return homePathEntries[color][stepsAfterEntry];
        }
    }

    // Normal movement along the main path (taking into account the cyclic transition)
    return pathArray[newIndex];
}

/**
 * Moves a piece around the board
 * @param {HTMLElement} figureElement - figure element
 * @param {string} fromPosition - starting position
 * @param {string} toPosition - final position
 */
export function moveFigure(figureElement, fromPosition, toPosition) {
    // Checking if the target position is a home (home_${color})
    if (toPosition.startsWith('home_')) {
        // Find the corresponding center div
        const homeElement = document.getElementById(toPosition);
        if (homeElement) {
            homeElement.appendChild(figureElement);
            return;
        }
    }
    
    // Normal movement on the playing field
    DOM.playingFields.forEach(cell => {
        if (cell.id === toPosition) {
            cell.appendChild(figureElement);
        }
    });
}

/**
 * Checks the movement capability of a figure
 * @param {string} color - Player color
 * @param {number} figureIndex - Figure index (0-3)
 * @param {number} diceValue - Dice value
 * @returns {boolean}
 */
export function isMovePossible(color, figureIndex, diceValue) {
    const currentPosition = positionalFigures[color][figureIndex + 1];

    // If the figure is in the starting zone
    if (currentPosition.startsWith('starting_player')) {
        return diceValue === 6;
    }

    // Checking the possibility of movement on the board
    const newPosition = calculateNewPosition(currentPosition, diceValue, color);
    return newPosition !== null;
}

/**
 * Performs a complete move of the figure
 * @param {HTMLElement} figureElement - figure element
 * @param {string} color - player color
 * @param {number} figureIndex - figure index (0-3)
 * @returns {boolean} success of the move
 */
export function executeMove(figureElement, color, figureIndex) {
    const currentPosition = positionalFigures[color][figureIndex + 1];
    const steps = PLAYER_TURNS.diceNumber;

    // Exit from the starting area
    if (canLeaveSafeZone(color, figureIndex)) {
        moveFromSafeZone(figureElement, color, figureIndex);
        return true;
    }

    // Normal movement
    const newPosition = calculateNewPosition(currentPosition, steps, color);

    if (!newPosition) {
        return false; // Unable to make a move
    }

    moveFigure(figureElement, currentPosition, newPosition);
    positionalFigures[color][figureIndex + 1] = newPosition;

    return true;
}

/**
 * Checks if the figure has reached the finish line (home)
 * @param {string} position - figure position
 * @param {string} color - player color
 * @returns {boolean}
 */
export function hasReachedHome(position, color) {
    return position === `home_${color}`;
}

/**
 * Checks for a collision with an enemy piece
 * @param {string} position - position on the board
 * @param {string} currentColor - current player color
 * @returns {Object|null} information about the captured figure or null
 */
export function checkCapture(position, currentColor) {
    // Implement the logic for capturing enemy pieces
    return null;
}