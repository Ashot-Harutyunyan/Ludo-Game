// SCREAMING_SNAKE_CASE for true constants
export const COLORS = {
    GREEN: 'green',
    RED: 'red',
    BLUE: 'blue',
    YELLOW: 'yellow'
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

// camelCase for configuration objects and data structures
export const playerTurns = {
    color: '',
    diceMove: false,
    diceNumber: null
}

export const positionalFigures = {
    red: {
        1: 'starting_player_red_1',
        2: 'starting_player_red_2', 
        3: 'starting_player_red_3', 
        4: 'starting_player_red_4'
    }, 
    yellow: {
        1: 'starting_player_yellow_1', 
        2: 'starting_player_yellow_2', 
        3: 'starting_player_yellow_3', 
        4: 'starting_player_yellow_4'
    },  
    blue: {
        1: 'starting_player_blue_1', 
        2: 'starting_player_blue_2', 
        3: 'starting_player_blue_3', 
        4: 'starting_player_blue_4'
    },  
    green: {
        1: 'starting_player_green_1', 
        2: 'starting_player_green_2', 
        3: 'starting_player_green_3', 
        4: 'starting_player_green_4'
    }
}

export const pathArray = [
    'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 
    'y1', 'y2', 'y3', 'y4', 'y5', 'y6', 'y7', 'y8', 'y9', 'y10', 'y11', 'y12', 'y13',
    'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'b11', 'b12', 'b13',
    'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'g13'
]

export const homePathEntries = {
    red: ['rh1', 'rh2', 'rh3', 'rh4', 'rh5', 'home_red'], 
    yellow: ['yh1', 'yh2', 'yh3', 'yh4', 'yh5', 'home_yellow'],  
    blue: ['bh1', 'bh2', 'bh3', 'bh4', 'bh5', 'home_blue'], 
    green: ['gh1', 'gh2', 'gh3', 'gh4', 'gh5', 'home_green']
}

export const safePaths = [
    'r1', 'r9', 'y1', 'y9', 'b1', 'b9', 'g1', 'g9',
    ...homePathEntries.red,
    ...homePathEntries.yellow,
    ...homePathEntries.blue,
    ...homePathEntries.green
]

export const nearTheHouse = {
    red: 'g12',
    yellow: 'r12',
    blue: 'y12',
    green: 'b12'
}