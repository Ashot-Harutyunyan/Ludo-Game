import { SCREENS, DIALOG_PAGES } from './constants.js';
import { DOM, toggleClass, hasClass } from './dom.js';
import { resetGameState } from './game.js';

// UI state
let currentScreen = SCREENS.START;
let dialogPage = DIALOG_PAGES.FIRST;
let selectedColor = undefined;
let selectedPlayers = 2;

/**
 * shows the victory screen
 * @param {string} winnerColor - winner's color
 * @param {Array<string>} winners - array of winners by place
 */
export function showVictoryScreen(winnerColor, winners) {
    DOM.dialog.showModal();
    changeDialogContent('dialog-quit-game');

    const dialogContent = document.querySelector('.dialog-quit-game-content');
    const h2 = dialogContent.querySelector('h2');
    const buttonsContainer = dialogContent.querySelector('.dialog-quit-game-content-container-buttons');

    // we generate text depending on the number of players
    if (winners.length === 2) {
        h2.textContent = `${getColorName(winnerColor).toUpperCase()} WINS!`;
    } else {
        // for 4 players, we show the locations
        h2.textContent = 'GAME OVER!';
    }

    // create a list of places
    const resultsList = document.createElement('div');
    resultsList.style.cssText = `
        margin: 20px 0;
        font-family: 'Luckiest Guy', cursive;
        font-size: 20px;
        color: white;
        text-align: center;
    `;

    winners.forEach((color, index) => {
        const place = document.createElement('p');
        place.textContent = `${index + 1}. ${getColorName(color).toUpperCase()}`;
        place.style.cssText = `
            margin: 10px 0;
            color: ${getColorHex(color)};
            text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
        `;
        resultsList.appendChild(place);
    });

    // insert a list before the buttons
    dialogContent.insertBefore(resultsList, buttonsContainer);

    DOM.homeBorder.forEach((elem)=>{
        elem.style.animation = 'none';
        void elem.offsetWidth;
    })

    // changing the button text
    const buttons = buttonsContainer.querySelectorAll('button');
    buttons[0].textContent = 'New Game';
    buttons[1].style.display = 'none'; // hiding the "No" button
}

/**
 * gets the name of the color
 * @param {string} color - color code
 * @returns {string}
 */
function getColorName(color) {
    const names = {
        red: 'Red',
        blue: 'Blue',
        green: 'Green',
        yellow: 'Yellow'
    };
    return names[color] || color;
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
 * switches between application screens
 * @param {string} targetScreen - target screen name
 */
export function switchScreen(targetScreen) {
    if (currentScreen === targetScreen) return;

    currentScreen = targetScreen;

    if (currentScreen === SCREENS.DIALOG) {
        DOM.dialog.showModal();
    } else {
        DOM.components.forEach(element => {
            const componentDataId = element.getAttribute('data-id');
            toggleClass(element, 'hidden', componentDataId !== currentScreen);
        });

        if (DOM.dialog.open) {
            DOM.dialog.close();
        }
    }
}

/**
 * click handler for the screen switch button
 * @param {Event} event - click event
 */
export function handleScreenSwitchClick(event) {
    const targetButton = event.currentTarget;
    const targetAttribute = targetButton.getAttribute('data-target');

    if (targetAttribute) {
        switchScreen(targetAttribute);
    }
}

/**
 * switches pages within a dialog
 * @param {string} targetPage - landing page name
 */
function switchDialogPage(targetPage) {
    DOM.dialogPlayersComponents.forEach(el => {
        toggleClass(el, 'hidden', !hasClass(el, targetPage));
    });
}

/**
 * color picker handler
 * @param {Event} event - change event
 */
export function handleColorSelect(event) {
    selectedColor = event.target.value;
    DOM.dialogButtonNext.disabled = false;
    DOM.dialogButtonNext.setAttribute('data-target', SCREENS.GAME);
}

/**
 * handler for changing the number of players
 * @param {Event} event - change event
 */
export function handlePlayerSelectionChange(event) {
    selectedPlayers = +event.target.value;
}

/**
 * handler for clicking the "Next" button in a dialog
 * @returns {Object|undefined} game settings or undefined
 */
export function handleDialogNextClick() {
    if (dialogPage === DIALOG_PAGES.FIRST) {
        switchDialogPage(DIALOG_PAGES.SECOND);
        DOM.dialogButtonPrev.removeAttribute('data-target');

        if (!selectedColor) {
            DOM.dialogButtonNext.disabled = true;
        }

        dialogPage = DIALOG_PAGES.SECOND;
        return;
    }

    const target = DOM.dialogButtonNext.getAttribute('data-target');
    DOM.components.forEach(el => {
        const id = el.getAttribute('data-id');
        toggleClass(el, 'hidden', id !== target);
    });

    DOM.dialog.close();

    // returning data to launch the game
    return {
        color: selectedColor,
        players: selectedPlayers
    };
}

/**
 * handler for clicking the "Back" button in a dialog
 */
export function handleDialogPrevClick() {
    if (dialogPage === DIALOG_PAGES.FIRST) return;

    switchDialogPage(DIALOG_PAGES.FIRST);
    DOM.dialogButtonNext.disabled = false;
    DOM.dialogButtonPrev.setAttribute('data-target', SCREENS.CHOOSE);

    dialogPage = DIALOG_PAGES.FIRST;
}

/**
 * resets the dialog state to the initial one.
 */
export function resetDialogState() {
    DOM.colorOptions.forEach(option => {
        option.checked = false;
    });

    DOM.playerSelection.forEach((elem, index) => {
        elem.checked = index === 0;
    });

    switchDialogPage(DIALOG_PAGES.FIRST);
    dialogPage = DIALOG_PAGES.FIRST;
    selectedColor = undefined;
    selectedPlayers = 2;

    DOM.containerPlayerAndDice.forEach(elem => {
        elem.style.visibility = '';
        elem.style.opacity = '';
        elem.style.pointerEvents = '';

        // restoring player avatars
        const playerAvatar = elem.querySelector(`[class^="player-"]`);
        if (playerAvatar) {
            playerAvatar.style.display = '';
        }

        // removing location indicators
        const placeIndicator = elem.querySelector('.place-indicator');
        if (placeIndicator) {
            placeIndicator.remove();
        }
    });

    DOM.arrowReminder.forEach(elem => {
        elem.style.visibility = '';
    });

    // restoring the original contents of the victory dialog
    const dialogContent = document.querySelector('.dialog-quit-game-content');
    const h2 = dialogContent.querySelector('h2');
    const buttonsContainer = dialogContent.querySelector('.dialog-quit-game-content-container-buttons');
    const buttons = buttonsContainer.querySelectorAll('button');

    h2.textContent = 'QUIT GAME?';
    buttons[0].textContent = 'Yes';
    buttons[1].style.display = '';
    buttons[1].textContent = 'No';

    // delete the results list if there is one.
    const resultsList = dialogContent.querySelector('div[style*="margin: 20px 0"]');
    if (resultsList) {
        resultsList.remove();
    }
}

/**
 * toggles the contents of the dialog
 * @param {string} component - component class to display
 */
export function changeDialogContent(component) {
    DOM.dialogComponents.forEach(elem => {
        toggleClass(elem, 'hidden', !hasClass(elem, component));
    });
}

/**
 * opens a modal window to exit the game.
 */
export function openQuitGameModal() {
    DOM.dialog.showModal();
    changeDialogContent('dialog-quit-game');
}

/**
 * exit the game and return to the main screen
 * @param {Object} containerFigures - object with figures of players
 */
export function quitGame(containerFigures) {
    // resetting the game state
    resetGameState(containerFigures);

    // reset UI
    resetDialogState();
    changeDialogContent('dialog-players');
    DOM.dialog.close();
    currentScreen = SCREENS.START;

    DOM.components.forEach(el => {
        if (hasClass(el, 'container-first')) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });

    // resetting the dice
    DOM.dice.forEach(diceElement => {
        diceElement.style.animation = 'none';
        diceElement.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
}