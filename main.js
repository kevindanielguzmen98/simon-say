/* Constantes */
const buttons = {
    easy: document.getElementById('btn-easy'),
    medium: document.getElementById('btn-medium'),
    hard: document.getElementById('btn-hard')
}
var numberLevels = 10
var difficulty = 0
var arrayOfKeys = new Array(difficulty)

function showKeyBoard() {
    document.getElementById('controls').className  = 'no-display'
    document.getElementById('keyboard').className = 'display-flex'
}

function showControls() {
    document.getElementById('controls').className  = 'display-flex'
    document.getElementById('keyboard').className = 'no-display'
}

function loadRandomKeys() {
    let min = 65
    let max = 90
    for (let i=0; i <= numberLevels; i++) {
        arrayOfKeys[i] = Math.round(Math.random() * (max - min) + min) 
    }
}

/* Obtiene el elementos del DOM */
function getElementByKeyCode(keyCode) {
    return document.querySelector(`[data-key="${keyCode}"]`)
}

/* Añade clases al elemento del DOM que tenga el id pasado por parametro */
function activeKeyByKeyCode(keyCode, opts = {}) {
    let element = getElementByKeyCode(keyCode)
    element.classList.add('active')
    if (opts.success) {
        element.classList.add('success')
    } else if (opts.fail) {
        element.classList.add('fail')
    }
    setTimeout(() => desactivate(element), 500)
}

/* Elimina todas las clases del elemento */
function desactivate(element) {
    element.className = 'key'
}

/* Retorna el nivel */
function nextLevel(currentLevel) {
    if (currentLevel == numberLevels) {
        return swal('You win!!', '', 'success')
    }
    swal(`Level ${(currentLevel+1)} of ${numberLevels}`, {
        button: false,
        timer: 1000
    }).then(() => {
        for (let i = 0; i <= currentLevel; i++) {
            setTimeout(() => activeKeyByKeyCode(arrayOfKeys[i]), 1000 * i)
        }
        let i = 0
        let currentKey = arrayOfKeys[i]
        window.addEventListener('keydown', onkeydown)
        /* Add events to buttons */
        for (let codeKey of arrayOfKeys) {
            document.querySelector(`[data-key="${codeKey}"]`).addEventListener('click', (ev) => {
                onkeydown(ev, codeKey)
            })
        } 
        function onkeydown(event, value = -1) {
            if (event.keyCode == currentKey || value == currentKey) {
                activeKeyByKeyCode(arrayOfKeys[i], { success: true })
                i++
                if (i > currentLevel) {
                    window.removeEventListener('keydown', onkeydown)
                    setTimeout(() => nextLevel(i), 1000)
                }
                currentKey = arrayOfKeys[i]
            } else {
                activeKeyByKeyCode(event.keyCode, { fail: true })
                window.removeEventListener('keydown', onkeydown)
                swal({
                    buttons: true,
                    title: `You lost :C`,
                    text: '¿Quieres jugar de nuevo?',
                    buttons: {
                        si: {
                            value: true,
                            text: 'Si'
                        },
                        no: {
                            value: false,
                            text: 'No'
                        }
                    }
                    
                }).then((ok) => {
                    if (ok) {
                        loadRandomKeys()
                        nextLevel(0)
                    } else {
                        showControls()
                    }
                })
            }
        }
    })
}

function run() {
    loadRandomKeys()
    nextLevel(0)
}

/* Funcion inicializadora */
function init() {
    buttons.easy.addEventListener('click', (ev) => {
        difficulty = 0
        numberLevels = 5
        showKeyBoard()
        run()
    })
    buttons.medium.addEventListener('click', (ev) => {
        difficulty = 1
        numberLevels = 10
        showKeyBoard()
        run()
    })
    buttons.hard.addEventListener('click', (ev) => {
        difficulty = 2
        numberLevels = 20
        showKeyBoard()
        run()
    })
}

init()