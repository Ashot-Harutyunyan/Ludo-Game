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
    quitGame,
} from './ui.js';
import { startGame } from './game.js';

// global variables
let containerFigures = null;

// initializing the Application
function init() {
    // initializing the game board
    containerFigures = initializeBoard();

    // initialization of cubes
    DOM.dice.forEach(diceElement => {
        initializeDice(diceElement);
        diceElement.addEventListener('click', ()=> handleDiceClick(event, containerFigures));
    });

    // initializing navigation buttons
    DOM.buttons.forEach(button => {
        button.addEventListener('click', handleScreenSwitchClick);
    });

    // initializing the player selection dialog
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

    // initializing color selection
    DOM.colorOptions.forEach(option => {
        option.addEventListener('change', handleColorSelect);
    });

    // initializing the selection of the number of players
    DOM.playerSelection.forEach(element => {
        element.addEventListener('change', handlePlayerSelectionChange);
    });

    // initializing the Exit Game Button
    DOM.buttonExitTheGame.addEventListener('click', openQuitGameModal);

    // initializing the exit confirmation buttons
    DOM.buttonsYesOrNo.forEach(button => {
        if (button.textContent === 'Yes') {
            button.addEventListener('click', ()=> quitGame(containerFigures));
        } else {
            button.addEventListener('click', () => DOM.dialog.close());
        }
    });

    console.log('Ludo Game initialized successfully!');
}

// launching the application
init();