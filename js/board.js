import { FIGURES, IMAGE_PATHS } from './constants.js';
import { DOM } from './dom.js';

// The object on which the player figures are marked with color is always in its original location
export let homeContainerFigures = {};

/**
 * Creates player figures for each color
 * @returns {Object} an object with player figures sorted by color
 */
export function createPlayerFigures() {
    const containerFigures = {};

    FIGURES.forEach((className) => {
        const element = DOM.getPlayAreaElement(className);
        const color = extractColor(element);

        containerFigures[color] = [];
        homeContainerFigures[color] = [];

        for (let j = 0; j < 4; j++) {
            const figureContainer = createFigureContainer(color, j);
            containerFigures[color].push(figureContainer.querySelector('.container-player'));
            homeContainerFigures[color].push(figureContainer);
            element.appendChild(figureContainer);
        }
    });    

    return containerFigures;
}

/**
 * Creates a container for one shape.
 * @param {string} color - Player color
 * @param {number} index - Piece index (0-3)
 * @returns {HTMLElement} Piece container
 */
function createFigureContainer(color, index) {
    const div = document.createElement('div');
    const container = document.createElement('div');
    const starIcon = createStarIcon(color, index);
    const playerIcon = createPlayerIcon(color, index);

    container.classList.add('container-player', color);
    container.appendChild(starIcon);
    container.appendChild(playerIcon);
    container.setAttribute('data-starting-position', `starting_player_${color}_${index + 1}`)
    div.id = `starting_player_${color}_${index + 1}`
    div.appendChild(container);
    
    return div;
}

/**
 * Creates a star icon
 * @param {string} color - player color
 * @param {number} index - figure index
 * @returns {HTMLElement} star icon element
 */
function createStarIcon(color, index) {
    const img = document.createElement('img');
    img.src = IMAGE_PATHS.STAR_SUN;
    img.classList.add(`img-star-sun-${index + 1}-${color}`);
    return img;
}

/**
 * Creates a player icon
 * @param {string} color - player color
 * @param {number} index - figure index
 * @returns {HTMLElement} player icon element
 */
function createPlayerIcon(color, index) {
    const player = document.createElement('img');
    player.src = IMAGE_PATHS.PLAYER(color);
    player.classList.add(`img-player-${index + 1}-${color}`);
    return player;
}

/**
 * Extracts color from element classes
 * @param {HTMLElement} element - DOM element
 * @returns {string} color
 */
function extractColor(element) {
    const classArray = element.className.split(' ');
    return classArray[classArray.length - 1];
}

/**
 * Initializes the game board
 * @returns {Object} object with figures of players
 */
export function initializeBoard() {
    const containerFigures = createPlayerFigures();
    return containerFigures;
}