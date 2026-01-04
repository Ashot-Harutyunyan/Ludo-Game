import { SCREENS, DIALOG_PAGES } from './constants.js';
import { DOM, toggleClass, hasClass } from './dom.js';
import { resetGameState } from './game.js';

// UI state
let currentScreen = SCREENS.START;
let dialogPage = DIALOG_PAGES.FIRST;
let selectedColor = undefined;
let selectedPlayers = 2;

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
    });

    DOM.arrowReminder.forEach(elem => {
        elem.style.visibility = '';
    });
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