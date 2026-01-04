import { PLAYER_TURNS, positionalFigures, pathArray, homePathEntries, nearTheHouse, safePaths } from './constants.js';
import { DOM } from './dom.js';
import { homeContainerFigures } from './board.js';
import { completeTurn } from './turn-manager.js';

/**
 * delay for animation
 * @param {number} ms - milliseconds
 * @returns {Promise}
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * checks if the figure can leave the house
 * @param {string} color - player color
 * @param {number} figureIndex - figure index (0-3)
 * @returns {boolean}
 */
export function canLeaveSafeZone(color, figureIndex) {
    const location = positionalFigures[color][figureIndex + 1];
    return location.startsWith('starting_player') && PLAYER_TURNS.diceNumber === 6;
}

/**
 * moves a piece from the starting area to the first square of the path
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
 * gets the shape's movement path (array of positions)
 * @param {string} currentPosition - current position
 * @param {number} steps - number of steps
 * @param {string} color - player color
 * @returns {Array<string>|null} array of positions or null
 */
export function getMovementPath(currentPosition, steps, color) {
    const path = [];

    // checking if a figure is on a home path
    const homePathIndex = homePathEntries[color].indexOf(currentPosition);

    if (homePathIndex !== -1) {
        // the figure is already on its home path - moving along it
        for (let i = 1; i <= steps; i++) {
            const newHomeIndex = homePathIndex + i;

            if (newHomeIndex >= homePathEntries[color].length) {
                return null;
            }

            path.push(homePathEntries[color][newHomeIndex]);
        }
        return path;
    }

    // figure on the main path
    const currentIndex = pathArray.indexOf(currentPosition);
    if (currentIndex === -1) return null;

    const nearHouseCell = nearTheHouse[color];
    const nearHouseIndex = pathArray.indexOf(nearHouseCell);

    let hasEnteredHome = false;
    let stepsInHome = 0;

    for (let i = 1; i <= steps; i++) {
        if (hasEnteredHome) {
            // we continue moving along the home path
            if (stepsInHome >= homePathEntries[color].length) {
                return null;
            }
            path.push(homePathEntries[color][stepsInHome]);
            stepsInHome++;
        } else {
            // movement along the main route
            let newIndex = (currentIndex + i) % pathArray.length;

            // let check if we need to enter the home path
            if (currentIndex <= nearHouseIndex &&
                (currentIndex + i) > nearHouseIndex &&
                (currentIndex + i) < pathArray.length) {
                // entering the home path
                hasEnteredHome = true;
                path.push(homePathEntries[color][0]);
                stepsInHome = 1;
            } else if (currentIndex <= nearHouseIndex && (currentIndex + i) >= pathArray.length) {
                // checking the cyclic transition through the entrance to the house
                const passedThroughEntry = (currentIndex + i) > nearHouseIndex;

                if (passedThroughEntry) {
                    // we enter the house after a cyclic transition
                    hasEnteredHome = true;
                    const stepsAfterEntry = (currentIndex + i) - nearHouseIndex - 1;

                    if (stepsAfterEntry >= homePathEntries[color].length) {
                        return null;
                    }

                    path.push(homePathEntries[color][stepsAfterEntry]);
                    stepsInHome = stepsAfterEntry + 1;
                } else {
                    path.push(pathArray[newIndex]);
                }
            } else {
                path.push(pathArray[newIndex]);
            }
        }
    }

    return path;
}

/**
 * calculates the new position of a piece on the board (final position)
 * @param {string} currentPosition - current position
 * @param {number} steps - number of steps
 * @param {string} color - player color
 * @returns {string|null} new position or null if not possible
 */
export function calculateNewPosition(currentPosition, steps, color) {
    const path = getMovementPath(currentPosition, steps, color);

    if (!path || path.length === 0) {
        return null;
    }

    // returning the last position in the path
    return path[path.length - 1];
}

/**
 * moves a piece one square
 * @param {HTMLElement} figureElement - figure element
 * @param {string} toPosition - target position
 */
function moveFigureToCell(figureElement, toPosition) {
    // check if the target position is a home (home_${color})
    if (toPosition.startsWith('home_')) {
        completeTurn()
        const homeElement = document.getElementById(toPosition);
        if (homeElement) {
            homeElement.appendChild(figureElement);
            return;
        }
    }

    // normal movement on the playing field
    DOM.playingFields.forEach(cell => {
        if (cell.id === toPosition) {
            cell.appendChild(figureElement);
        }
    });
}

/**
 * moves a piece around the board with animation (step by step)
 * @param {HTMLElement} figureElement - figure element
 * @param {string} fromPosition - starting position
 * @param {string} toPosition - final position
 * @param {string} color - player color
 * @param {number} steps - number of steps
 */
export async function moveFigure(figureElement, fromPosition, toPosition, color, steps) {
    // we obtain the full path of movement
    const movementPath = getMovementPath(fromPosition, steps, color);

    if (!movementPath || movementPath.length === 0) {
        return false;
    }

    // we go through each cell with a delay
    for (let i = 0; i < movementPath.length; i++) {
        const position = movementPath[i];
        moveFigureToCell(figureElement, position);

        // delay between steps (300ms)
        if (i < movementPath.length - 1) {
            await delay(300);
        }
    }

    return movementPath[movementPath.length - 1];
}

/**
 * checks the movement capability of a figure
 * @param {string} color - player color
 * @param {number} figureIndex - figure index (0-3)
 * @param {number} diceValue - value on the cube
 * @returns {boolean}
 */
export function isMovePossible(color, figureIndex, diceValue) {
    const currentPosition = positionalFigures[color][figureIndex + 1];

    // if the figure is in the starting zone
    if (currentPosition.startsWith('starting_player')) {
        return diceValue === 6;
    }

    // checking the possibility of movement on the board
    const newPosition = calculateNewPosition(currentPosition, diceValue, color);
    return newPosition !== null;
}

/**
 * performs a complete move of the figure
 * @param {HTMLElement} figureElement - figure element
 * @param {string} color - player color
 * @param {number} figureIndex - figure index (0-3)
 * @returns {Promise<boolean>} success of the move
 */
export async function executeMove(figureElement, color, figureIndex) {
    const currentPosition = positionalFigures[color][figureIndex + 1];
    const steps = PLAYER_TURNS.diceNumber;

    // exit from the starting area
    if (canLeaveSafeZone(color, figureIndex)) {
        moveFromSafeZone(figureElement, color, figureIndex);
        return positionalFigures[color][figureIndex + 1];
    }

    // normal movement with animation
    const newPosition = calculateNewPosition(currentPosition, steps, color);

    if (!newPosition) {
        return false; // unable to make a move
    }

    const success = await moveFigure(figureElement, currentPosition, newPosition, color, steps);

    if (success) {
        positionalFigures[color][figureIndex + 1] = newPosition;
    }

    return success;
}

/**
 * checks for a collision with an enemy piece
 * @param {string} position - position on the board
 * @param {string} currentColor - current player color
 * @returns {Object|null} information about the captured figure or null
 */
export function checkCapture(position, currentColor) {
    // Checking if the position is safe
    if (safePaths.includes(position)) {
        return [];
    }

    let captured = [];

    // We are looking for opponents' pieces in this position
    for (const color in positionalFigures) {
        // let skip our color
        if (color === currentColor) continue;

        for (const [index, pos] of Object.entries(positionalFigures[color])) {
            if (pos === position) {
                captured.push({
                    color,
                    index: parseInt(index),
                    position: pos
                });
            }
        }
    }

    return captured;
}

/**
 * returns captured pieces to the starting area
 * @param {Array<Object>} capturedFigures - array of captured figures
 * @param {Object} containerFigures - all players figures
 * @returns {Promise<number>} number of returned pieces
 */
export async function returnCapturedFigures(capturedFigures, containerFigures) {
    if (!capturedFigures || capturedFigures.length === 0) {
        return 0;
    }

    // we process each captured figure
    for (const captureInfo of capturedFigures) {
        await returnSingleFigure(captureInfo, containerFigures);
    }

    return capturedFigures.length;
}

/**
 * returns the captured piece to the starting area
 * @param {Object} captureInfo - information about the captured figure
 * @param {Object} containerFigures - all players figures
 */
export async function returnSingleFigure(captureInfo, containerFigures) {
    const { color, index } = captureInfo;
    const figureIndex = index - 1;
    const figure = containerFigures[color][figureIndex];

    if (!figure) return;

    // adding a visual capture effect
    figure.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    figure.style.transform = 'scale(0.5)';
    figure.style.opacity = '0.5';

    await delay(400);

    // return the figure to its original position
    const startingPosition = `starting_player_${color}_${index}`;
    const homeContainer = homeContainerFigures[color][figureIndex];

    if (homeContainer) {
        homeContainer.appendChild(figure);
    }

    // updating the position in the data
    positionalFigures[color][index] = startingPosition;

    // restoring visual state
    await delay(100);
    figure.style.transform = 'none';
    figure.style.opacity = '1';

    await delay(300);
    figure.style.transition = '';
}