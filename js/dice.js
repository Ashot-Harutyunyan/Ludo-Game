import { DICE_FACES, PLAYER_TURNS } from './constants.js';
import { DOM } from './dom.js';
import { handleDiceRoll } from './game.js';

/**
 * Creates dots on the face of a cube
 * @param {number} number - number of points
 * @param {HTMLElement} parent - parent element
 */
export function createDiceDots(number, parent) {
    for (let i = 0; i < number; i++) {
        const div = document.createElement('div');
        parent.appendChild(div);
    }
}

/**
 * Initializes all faces of the cube
 * @param {HTMLElement} diceElement - cube element
 */
export function initializeDice(diceElement) {
    const faces = Array.from(diceElement.children);

    faces.forEach(face => {
        const faceName = face.className.split(' ')[1];

        switch (faceName) {
            case 'front':
                createDiceDots(DICE_FACES.FRONT, face);
                break;
            case 'back':
                createDiceDots(DICE_FACES.BACK, face);
                break;
            case 'left':
                createDiceDots(DICE_FACES.LEFT, face);
                break;
            case 'right':
                createDiceDots(DICE_FACES.RIGHT, face);
                break;
            case 'top':
                createDiceDots(DICE_FACES.TOP, face);
                break;
            case 'button':
                createDiceDots(DICE_FACES.BOTTOM, face);
                break;
        }
    });
}

/**
 * Rolls a die and returns the result
 * @param {HTMLElement} diceElement - cube element
 * @param {Object} containerFigures - object with figures of players
 * @returns {number} throw result (1-6)
 */
export function rollDice(diceElement, containerFigures) {
    const random = Math.floor(Math.random() * 6) + 1;

    // Updating the game state
    PLAYER_TURNS.diceMove = false;
    PLAYER_TURNS.diceNumber = random;

    // Hide all reminder arrows
    DOM.arrowReminder.forEach(element => {
        element.style.visibility = 'hidden';
    });

    // Dice roll animation
    animateDice(diceElement, random);

    // Determine the available moves after the throw
    handleDiceRoll(containerFigures);

    return random;
}

/**
 * Animates a dice roll
 * @param {HTMLElement} diceElement - cube element
 * @param {number} value - dropped value
 */
function animateDice(diceElement, value) {
    // Reset animation
    diceElement.style.animation = 'none';
    void diceElement.offsetWidth; // Trigger reflow

    // Starting animation
    diceElement.style.animation = 'cube .5s linear';

    // Setting the final position
    applyDiceTransform(diceElement, value);
}

/**
 * Applies a transformation to the dice depending on the number rolled
 * @param {HTMLElement} diceElement - cube element
 * @param {number} value - value (1-6)
 */
function applyDiceTransform(diceElement, value) {
    const transforms = {
        1: 'rotateY(0deg) rotateX(0deg)',
        2: 'rotateY(270deg) rotateX(0deg)',
        3: 'rotateY(180deg) rotateX(0deg)',
        4: 'rotateY(90deg) rotateX(0deg)',
        5: 'rotateY(0deg) rotateX(270deg)',
        6: 'rotateY(0deg) rotateX(90deg)'
    };

    diceElement.style.transform = transforms[value];
}

/**
 * Cube click handler
 * @param {Event} event - click event
 * @param {Object} containerFigures - object with figures of players
 * @returns {number|null} the result of the throw or null
 */
export function handleDiceClick(event, containerFigures) {
    const diceElement = event.currentTarget;

    // We check that this is the current player's dice and that a roll is allowed.
    if (diceElement.dataset.diceMove === PLAYER_TURNS.color && PLAYER_TURNS.diceMove) {
        return rollDice(diceElement, containerFigures);
    }

    return null;
}