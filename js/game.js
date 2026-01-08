import { COLORS, playerTurns, positionalFigures } from './constants.js';
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
import { showVictoryScreen } from './ui.js';

// array for tracking winners
let winners = [];
let totalPlayers = 2;

/**
 * checks if the player has won (all 4 house pieces)
 * @param {string} color - player color
 * @returns {boolean}
 */
export function checkVictory(color) {
    const homePosition = `home_${color}`;
    let figuresAtHome = 0;

    for (let i = 1; i <= 4; i++) {
        if (positionalFigures[color][i] === homePosition) {
            figuresAtHome++;
        }
    }

    return figuresAtHome === 4;
}

/**
 * processes a player's victory
 * @param {string} color - the color of the winning player
 */
function handlePlayerVictory(color) {
    // adding a player to the list of winners
    winners.push(color);
    const place = winners.length;

    // if there are 2 players, the game ends.
    if (totalPlayers === 2) {
        const secondPlace = playerTurns.playerQueueArray.find(el => el !== color);
        winners.push(secondPlace);
        showVictoryScreen(color, winners);
        return true;
    }

    // if there are 4 players playing
    if (totalPlayers === 4) {
        // we mark the player and show his place
        hidePlayerUI(color, place);

        // if there is one player left, he is the last one.
        if (winners.length === 3) {
            const lastPlayer = playerTurns.playerQueueArray.find(
                p => !winners.includes(p)
            );
            winners.push(lastPlayer);
            hidePlayerUI(lastPlayer, 4);

            // there is a slight delay before the final screen is shown.
            setTimeout(() => {
                showVictoryScreen(color, winners);
            }, 1000);
            return true;
        }

        // remove the winning player from the queue
        playerTurns.playerQueueArray = playerTurns.playerQueueArray.filter(
            p => p !== color
        );

        // if the current player wins, switch to the next one
        if (playerTurns.color === color) {
            const nextIndex = 0;
            playerTurns.color = playerTurns.playerQueueArray[nextIndex];
            playerTurns.diceMove = true;
            updateTurnIndicators(playerTurns.color);
        }

        return false;
    }
}

/**
 * marks the UI elements of the winning player
 * @param {string} color - player color
 * @param {number} place - player's place (1, 2, 3)
 */
function hidePlayerUI(color, place) {
    DOM.containerPlayerAndDice.forEach(element => {
        if (element.classList.contains(color)) {
            // making it translucent
            element.style.opacity = '0.5';
            element.style.pointerEvents = 'none';

            // hiding the player's avatar
            const playerAvatar = element.querySelector(`[class^="player-"]`);
            if (playerAvatar) {
                playerAvatar.style.display = 'none';
            }

            // create a location indicator if it doesn't exist yet
            let placeIndicator = element.querySelector('.place-indicator');
            if (!placeIndicator) {
                placeIndicator = document.createElement('div');
                placeIndicator.className = 'place-indicator';
                placeIndicator.style.cssText = `
                    font-family: 'Luckiest Guy', cursive;
                    font-size: clamp(20px, 4vw, 28px);
                    color: ${getColorHex(color)};
                    text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                `;

                // we insert in place of the avatar
                if (playerAvatar && playerAvatar.parentNode) {
                    playerAvatar.parentNode.insertBefore(placeIndicator, playerAvatar);
                }
            }

            // setting the seat number
            placeIndicator.textContent = `${place}${getPlaceSuffix(place)}`;
        }
    });
}

/**
 * receives a suffix for place (st, nd, rd, th)
 * @param {number} place - seat number
 * @returns {string}
 */
function getPlaceSuffix(place) {
    if (place === 1) return 'st';
    if (place === 2) return 'nd';
    if (place === 3) return 'rd';
    return 'th';
}

/**
 * gets the HEX color code
 * @param {string} color - color name
 * @returns {string}
 */
function getColorHex(color) {
    const colors = {
        red: '#EE3107',
        blue: '#0089D9',
        green: '#6FCE66',
        yellow: '#FED403'
    };
    return colors[color] || '#FFFFFF';
}

/**
 * resets data on winners
 */
export function resetVictoryState() {
    winners = [];
}

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

    totalPlayers = playersCount;

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
 * sets the reminder arrows for the current player.
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
        if (color !== playerTurns.color) {
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

            // checking the victory after the move
            if (checkVictory(color)) {
                const gameEnded = handlePlayerVictory(color);
                if (gameEnded) {
                    return; // game over
                }
            }

            // check if the throw gives the right to an extra turn
            // also give an extra turn if the piece is captured or goes home
            const extraTurn = shouldGrantExtraTurn(playerTurns.diceNumber) ||
                captureInfo.length > 0 ||
                newPosition === `home_${color}`;

            // we finish the move
            completeTurn(extraTurn);
        } else {
            console.log(`The move is impossible for ${color}-${index + 1}`);
        }
    };
}

/**
 * initializes click handlers for all shapes
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
    // resetting the winners' data
    resetVictoryState();

    // customizing the UI and getting active colors
    const activeColors = setupGameUI(selectedColor, playersCount, containerFigures);

    // determining the order of moves
    const turnOrder = sortColorsByTurnOrder(activeColors, selectedColor);

    // initializing the game state
    playerTurns.color = turnOrder[0];
    playerTurns.diceMove = true;
    playerTurns.diceNumber = null;
    playerTurns.playerQueueArray = turnOrder;

    // initializing shape click handlers
    setupFigureClickHandlers(containerFigures);

    // updated visual indicators
    updateTurnIndicators(playerTurns.color);
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

    playerTurns.color = '';
    playerTurns.diceMove = false;
    playerTurns.diceNumber = null;
    playerTurns.playerQueueArray = [];

    // we're dropping the winners
    resetVictoryState();

    // return all figures to their original positions
    for (let color in positionalFigures) {
        for (let value in positionalFigures[color]) {
            positionalFigures[color][value] = `starting_player_${color}_${value}`;
            homeContainerFigures[color][value - 1].appendChild(containerFigures[color][value - 1]);
        }
    }
}