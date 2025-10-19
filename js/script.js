const dice = document.querySelectorAll('.dice')
const components = document.querySelectorAll('[data-id]')
const buttons = document.querySelectorAll('[data-target]')

const playAreaForFigures = [
    'top-left-green-play-area-for-figures',
    'top-right-red-play-area-for-figures',
    'bottom-left-blue-play-area-for-figures',
    'bottom-right-yellow-play-area-for-figures'
]

const playArea = [
    'top-right-red-play-area',
    'center-left-green-play-area',
    'center-right-yellow-play',
    'bottom-left-blue-play'
]

for (let i = 0; i < playAreaForFigures.length; i++) {
    let element = document.querySelector(`.${playAreaForFigures[i]}`)
    const classArray = element.className.split(' ')
    const colorElement = classArray[classArray.length - 1]
    for (let j = 0; j < 4; j++) {
        const div = document.createElement('div')
        const img = document.createElement('img')
        img.src = './img/star-sun.svg'
        img.classList.add(`img-star-sun-${j + 1}-${colorElement}`)
        // img.classList.add(`active`)
        div.appendChild(img)
        // div.textContent = j
        const player = document.createElement('img')
        player.src = `./img/player-${colorElement}.svg`
        player.classList.add(`img-player-${j + 1}-${colorElement}`)
        div.appendChild(player)
        element.appendChild(div)
    }
}

for (let i = 0; i < playArea.length; i++) {
    const element = document.querySelector(`.${playArea[i]}`)
    const classArray = element.className.split(' ')
    const colorElement = classArray[classArray.length - 1]
    for (let j = 0; j < 3; j++) {
        const parent = document.createElement('div')
        if(colorElement === "yellow" || colorElement === "green") {
            parent.classList.add(`parent-${j + 1}-${colorElement}`)
        } else {
            parent.classList.add(`parent-${j + 1}-${colorElement}`)
        }
        for (let k = 0; k < 6; k++) {
            const child = document.createElement('div')
            // child.textContent = j
            child.classList.add(`child-${j + 1}-${colorElement}`)
            parent.appendChild(child)
        }
        element.append(parent)
    }
}

dice.forEach((element)=>{
    Array.from(element.children).forEach((elem)=>{
        const name = elem.className.split(' ')[1]

        switch (name) {
            case 'front':
                createElem(1, elem)
                break
            case 'back':
                createElem(3, elem)
                break
            case 'left':
                createElem(4, elem)
                break
            case 'right':
                createElem(2, elem)
                break
            case 'top':
                createElem(5, elem)
                break
            case 'button':
                createElem(6, elem)
                break
        }

    })

    element.addEventListener('click', clickDice)
})

function createElem(number, parent) {
    for (let i = 0; i < number; i++) {
        const div = document.createElement('div')
        parent.appendChild(div)
    }
}

function clickDice(e) {
    const dice = e.currentTarget
    const random = Math.floor(Math.random() * 6) + 1;

    dice.style.animation = 'none'
    void dice.offsetWidth
    dice.style.animation = 'cube .5s linear'

    switch (random) {
        case 1:
            dice.style.transform = 'rotateY(0deg) rotateX(0deg)'
            break
        case 2:
            dice.style.transform = 'rotateY(270deg) rotateX(0deg)'
            break
        case 3:
            dice.style.transform = 'rotateY(180deg) rotateX(0deg)'
            break
        case 4:
            dice.style.transform = 'rotateY(90deg) rotateX(0deg)'
            break
        case 5:
            dice.style.transform = 'rotateY(0deg) rotateX(270deg)'
            break
        case 6:
            dice.style.transform = 'rotateY(0deg) rotateX(90deg)'
            break
    }
}

let currentScreen = 'start'

function switchScreen(targetAttribute) {
    if (currentScreen === targetAttribute) return

    currentScreen = targetAttribute

    components.forEach(element => {
        const componentDataId = element.getAttribute('data-id')

        if (componentDataId === currentScreen) {
            element.classList.remove('hidden')
        } else {
            element.classList.add('hidden')
        }
    });
}

function screenSwitchClick(event) {

    const targetButton = event.currentTarget

    const targetAttribute = targetButton.getAttribute('data-target')

    if (targetAttribute) {
        switchScreen(targetAttribute)
    }
}

buttons.forEach(button => {
    button.addEventListener('click', screenSwitchClick)
})