import { DOM } from './dom.js';
import { initializeDice, handleDiceClick } from './dice.js';
import { initializeBoard } from './board.js';
import {
    handleScreenSwitchClick,
    handleColorSelect,
    handlePlayerSelectionChange,
    handleDialogNextClick,
    handleDialogPrevClick,
    openQuitGameModal,
    quitGame
} from './ui.js';
import { startGame } from './game.js';

// Global variables
let containerFigures = null;

// ИInitializing the application
function init() {
    // Initializing the game board
    containerFigures = initializeBoard();

    // Initialization of cubes
    DOM.dice.forEach(diceElement => {
        initializeDice(diceElement);
        diceElement.addEventListener('click', handleDiceClick);
    });

    // Initializing navigation buttons
    DOM.buttons.forEach(button => {
        button.addEventListener('click', handleScreenSwitchClick);
    });

    // Initializing the player selection dialog
    DOM.dialogButtonPrev.addEventListener('click', handleDialogPrevClick);

    DOM.dialogButtonNext.addEventListener('click', () => {
        const gameSettings = handleDialogNextClick();
        if (gameSettings) {
            startGame(
                gameSettings.color,
                gameSettings.players,
                containerFigures
            );
        }
    });

    // Initializing color selection
    DOM.colorOptions.forEach(option => {
        option.addEventListener('change', handleColorSelect);
    });

    // Initializing the selection of the number of players
    DOM.playerSelection.forEach(element => {
        element.addEventListener('change', handlePlayerSelectionChange);
    });

    // Initializing the Exit Game Button
    DOM.buttonExitTheGame.addEventListener('click', openQuitGameModal);

    // Initializing exit confirmation buttons
    DOM.buttonsYesOrNo.forEach(button => {
        if (button.textContent === 'Yes') {
            button.addEventListener('click', quitGame);
        } else {
            button.addEventListener('click', () => DOM.dialog.close());
        }
    });

    console.log('Ludo Game initialized successfully!');
}

// Launching the application
init();