export const DOM = {
    // basic elements
    dice: document.querySelectorAll('.dice'),
    components: document.querySelectorAll('[data-id]'),
    buttons: document.querySelectorAll('[data-target]'),

    // dialog boxes
    dialog: document.getElementById('dialog'),
    dialogComponents: document.getElementById('dialog').querySelectorAll('section'),
    dialogButtonPrev: document.getElementById('dialog-prev'),
    dialogButtonNext: document.getElementById('dialog-next'),
    dialogPlayersComponents: document.querySelectorAll('.dialog-section-content'),

    // selection options
    colorOptions: document.querySelectorAll('input[name="color-option"]'),
    playerSelection: document.querySelectorAll('input[name="num-players"]'),

    // game elements
    arrowReminder: document.querySelectorAll('.arrow-reminder'),
    containerPlayerAndDice: document.querySelectorAll('.container-player-and-dice'),

    // control buttons
    buttonExitTheGame: document.getElementById('exitTheGame'),
    buttonsYesOrNo: document.querySelectorAll('.dialog-quit-game-content-container-buttons button'),

    // game board
    getPlayAreaElement: (className) => document.querySelector(`.${className}`),

    // playing field cups
    playingFields: document.querySelectorAll('.playing-field')
};

// helper functions for working with DOM
export function toggleClass(element, className, force) {
    element.classList.toggle(className, force);
}

export function hasClass(element, className) {
    return element.classList.contains(className);
}