export const DOM = {
    // Basic elements
    dice: document.querySelectorAll('.dice'),
    components: document.querySelectorAll('[data-id]'),
    buttons: document.querySelectorAll('[data-target]'),

    // Dialog boxes
    dialog: document.getElementById('dialog'),
    dialogComponents: document.getElementById('dialog').querySelectorAll('section'),
    dialogButtonPrev: document.getElementById('dialog-prev'),
    dialogButtonNext: document.getElementById('dialog-next'),
    dialogPlayersComponents: document.querySelectorAll('.dialog-section-content'),

    // Selection options
    colorOptions: document.querySelectorAll('input[name="color-option"]'),
    playerSelection: document.querySelectorAll('input[name="num-players"]'),

    // Game elements
    arrowReminder: document.querySelectorAll('.arrow-reminder'),
    containerPlayerAndDice: document.querySelectorAll('.container-player-and-dice'),

    // Control buttons
    buttonExitTheGame: document.getElementById('exitTheGame'),
    buttonsYesOrNo: document.querySelectorAll('.dialog-quit-game-content-container-buttons button'),

    // Game board
    getPlayAreaElement: (className) => document.querySelector(`.${className}`),

    playingFields: document.querySelectorAll('.playing-field')
};

// Helper functions for working with DOM
export function addClass(element, className) {
    element.classList.add(className);
}

export function removeClass(element, className) {
    element.classList.remove(className);
}

export function toggleClass(element, className, force) {
    element.classList.toggle(className, force);
}

export function hasClass(element, className) {
    return element.classList.contains(className);
}