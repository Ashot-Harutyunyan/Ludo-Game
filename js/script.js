const dice = document.querySelectorAll('.dice')
const components = document.querySelectorAll('[data-id]')
const buttons = document.querySelectorAll('[data-target]')
const dialog = document.getElementById('dialog')
const dialogComponents = dialog.querySelectorAll('section')
const dialogButtonPrev = document.getElementById('dialog-prev')
const dialogButtonNext = document.getElementById('dialog-next')
const dialogPlayersComponents = document.querySelectorAll('.dialog-section-content')
const colorOptions = document.querySelectorAll('input[name="color-option"]')
const playerSelection = document.querySelectorAll('input[name="num-players"]')
const arrowReminder = document.querySelectorAll('.arrow-reminder')
const buttonExitTheGame = document.getElementById('exitTheGame')
const buttonsYesOrNo = document.querySelectorAll('.dialog-quit-game-content-container-buttons button')
const containerPlayerAndDice = document.querySelectorAll('.container-player-and-dice')

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

const containerFigures = {}

for (let i = 0; i < playAreaForFigures.length; i++) {
    let element = document.querySelector(`.${playAreaForFigures[i]}`)
    const classArray = element.className.split(' ')
    const colorElement = classArray[classArray.length - 1]
    containerFigures[colorElement] = []
    for (let j = 0; j < 4; j++) {
        const div = document.createElement('div')
        const container = document.createElement('div')
        const img = document.createElement('img')
        img.src = './img/star-sun.svg'
        img.classList.add(`img-star-sun-${j + 1}-${colorElement}`)
        container.classList.add('container-player', colorElement)
        // img.classList.add(`active`)
        container.appendChild(img)
        // div.textContent = j
        const player = document.createElement('img')
        player.src = `./img/player-${colorElement}.svg`
        player.classList.add(`img-player-${j + 1}-${colorElement}`)
        container.appendChild(player)
        div.appendChild(container)
        containerFigures[colorElement].push(container)
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

    if (currentScreen === 'dialog') {
        dialog.showModal()
    }else {
        components.forEach(element => {
            const componentDataId = element.getAttribute('data-id')

            if (componentDataId === currentScreen) {
                element.classList.remove('hidden')
                if(dialog.open) dialog.close()
            } else {
                element.classList.add('hidden')
            }
        })
    }
}

function screenSwitchClick(event) {

    const targetButton = event.currentTarget
    const targetAttribute = targetButton.getAttribute('data-target')

    if (targetAttribute) {
        switchScreen(targetAttribute)
    }
}

let dialogPage = 'first'
let colorValue = undefined
let players = 2

function selectColor(){
    colorValue = this.value
    dialogButtonNext.disabled = false
    dialogButtonNext.setAttribute('data-target', 'game')
}

function switchDialogPage(targetPage) {
    dialogPlayersComponents.forEach(el => {
        el.classList.toggle('hidden', !el.classList.contains(targetPage))
    })
}

function dialogButtonNextClick() {
    if (dialogPage === 'first') {
        switchDialogPage('second')
        dialogButtonPrev.removeAttribute('data-target')
        if(!colorValue) dialogButtonNext.disabled = true
        dialogPage = 'second'
        return
    }

    const target = dialogButtonNext.getAttribute('data-target')
    components.forEach(el => {
        const id = el.getAttribute('data-id')
        el.classList.toggle('hidden', id !== target)
    })
    openGame()
    dialog.close()
}

function dialogButtonPrevClick() {
    if (dialogPage === 'first') return

    switchDialogPage('first')
    dialogButtonNext.disabled = false
    dialogButtonPrev.setAttribute('data-target', 'choose')

    dialogPage = 'first'
}

function playerSelectionChange(e) {
    players = +e.target.value
}

function openGame(){

    console.log(colorValue)

    if(players === 2) {
        switch (colorValue) {
            case 'blue':
            case 'red':
                containerPlayerAndDice.forEach((el) => {
                    if(el.classList.contains('green') || el.classList.contains('yellow')) {
                        el.style.visibility = 'hidden'
                    }
                })
                hideOrShowPlayers(['blue', 'red'])
                break
            case 'green':
            case 'yellow':
                containerPlayerAndDice.forEach((el) => {
                    if(el.classList.contains('blue') || el.classList.contains('red')) {
                        el.style.visibility = 'hidden'
                    }
                })
                hideOrShowPlayers(['green', 'yellow'])
                break
        }
    }

    if(players === 4) {
        hideOrShowPlayers(['blue', 'red', 'green', 'yellow'])
    }

    arrowReminder.forEach(elem => {
        if(!elem.classList.contains(colorValue)) {
            elem.style.visibility = 'hidden'
        }
    })
}

function initialStateDialogPlayers() {
    colorOptions.forEach(option => {
        option.checked = false
    })
    playerSelection.forEach((elem, index) => {
        if(index !== 0 ) elem.checked = false
        else elem.checked = true
    })
    switchDialogPage('first')
    dialogPage = 'first'
    colorValue = undefined
    players = 2
    containerPlayerAndDice.forEach(elem => elem.style.visibility = '')
    arrowReminder.forEach(elem => elem.style.visibility = '')
}

function changeDialogContent(component) {
    dialogComponents.forEach(elem => {
        if (elem.classList.contains(component)) {
            elem.classList.remove('hidden')
        }else {
            elem.classList.add('hidden')
        }
    })
}

function openModalQuitGame(){
    dialog.showModal()
    changeDialogContent('dialog-quit-game')
}

function quitGame() {
    initialStateDialogPlayers()
    changeDialogContent('dialog-players')
    dialog.close()
    currentScreen = 'start'
    components.forEach(el => {
        if(el.classList.contains('container-first')) el.classList.remove('hidden')
        else el.classList.add('hidden')
    })
}

function hideOrShowPlayers(arr) {
    for(let array in containerFigures) {
        containerFigures[array].forEach(el => el.classList.add('hidden'))
    }

    if(arr){
        for(let i = 0; i < arr.length; i++) {
            const players = containerFigures[arr[i]];
            players.forEach(player => player.classList.remove('hidden'));
        }
    }
}

buttons.forEach(button => {
    button.addEventListener('click', screenSwitchClick)
})

dialogButtonPrev.addEventListener('click', dialogButtonPrevClick)

dialogButtonNext.addEventListener('click', dialogButtonNextClick)

colorOptions.forEach(option => {
    option.addEventListener('change', selectColor)
})

playerSelection.forEach(elem => {
    elem.addEventListener('change', playerSelectionChange)
})

buttonExitTheGame.addEventListener('click', openModalQuitGame)

buttonsYesOrNo.forEach(button => {
    if(button.textContent === 'Yes'){
        button.addEventListener('click', quitGame)
    }else {
        button.addEventListener('click', ()=> dialog.close())
    }
})