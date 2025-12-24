export const DOM = {
    // Basic Elements
    dice: document.querySelectorAll('.dice'),
    components: document.querySelectorAll('[data-id]'),
    buttons: document.querySelectorAll('[data-target]'),

    // Dialog Boxes
    dialog: document.getElementById('dialog'),
    dialogComponents: document.getElementById('dialog').querySelectorAll('section'),
    dialogButtonPrev: document.getElementById('dialog-prev'),
    dialogButtonNext: document.getElementById('dialog-next'),
    dialogPlayersComponents: document.querySelectorAll('.dialog-section-content'),

    // Selection Options
    colorOptions: document.querySelectorAll('input[name="color-option"]'),
    playerSelection: document.querySelectorAll('input[name="num-players"]'),

    // Game Elements
    arrowReminder: document.querySelectorAll('.arrow-reminder'),
    containerPlayerAndDice: document.querySelectorAll('.container-player-and-dice'),

    // Control Buttons
    buttonExitTheGame: document.getElementById('exitTheGame'),
    buttonsYesOrNo: document.querySelectorAll('.dialog-quit-game-content-container-buttons button'),

    // Game Board
    getPlayAreaElement: (className) => document.querySelector(`.${className}`)
};

// DOM Helper Functions
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