export const COLORS = {
    GREEN: 'green',
    RED: 'red',
    BLUE: 'blue',
    YELLOW: 'yellow'
};

export const PLAYERS_COUNT = {
    TWO: 2,
    FOUR: 4
};

export const FIGURES = [
    'top-left-green-play-area-for-figures',
    'top-right-red-play-area-for-figures',
    'bottom-left-blue-play-area-for-figures',
    'bottom-right-yellow-play-area-for-figures'
]

export const DICE_FACES = {
    FRONT: 1,
    RIGHT: 2,
    BACK: 3,
    LEFT: 4,
    TOP: 5,
    BOTTOM: 6
};

export const SCREENS = {
    START: 'start',
    CHOOSE: 'choose',
    DIALOG: 'dialog',
    GAME: 'game'
};

export const DIALOG_PAGES = {
    FIRST: 'first',
    SECOND: 'second'
};

export const IMAGE_PATHS = {
    STAR_SUN: './img/star-sun.svg',
    PLAYER: (color) => `./img/player-${color}.svg`
};