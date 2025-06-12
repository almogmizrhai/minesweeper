

'use strict'


function onCustomMode(){
    var size = +prompt('Please enter the board size (4-20):')
    if(size < 4 || size > 20 || isNaN(size)){
        alert('Please enter a valid size between 4 and 20')
        return
    }
    
    var maxMines = Math.floor((size * size) * 0.8)
    var mines = +prompt(`Please enter the number of mines (1-${maxMines}):`)
    
    if(mines < 1 || mines > maxMines || isNaN(mines)){
        alert(`Please enter a valid number of mines between 1 and ${maxMines}`)
        return
    }
    
    gLevel.SIZE = size
    gLevel.MINES = mines
    gCellCount = size * size
    resetGame()
}

function onChangeDifficulty(size, mines){
    gLevel.SIZE = size
    gLevel.MINES = mines
    gCellCount = size * size
    resetGame()
}


function createCell(){
    return { 
        minesAroundCount: 0, 
        isRevealed: false, 
        isMine: false, 
        isMarked: false, 
    }
}

function buildBoard() {
    const board = []
    gCellPos = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = createCell()
            gCellPos.push({i, j})
        }
    }
    return board
}

function placeMines(firstClickI, firstClickJ){
    var minesPlaced = 0
    shuffle(gCellPos)
    
    while(minesPlaced < gLevel.MINES && gCellPos.length > 0){
        var pos = gCellPos.pop()
        if(Math.abs(pos.i - firstClickI) <= 1 && Math.abs(pos.j - firstClickJ) <= 1) {
            continue
        }
        gBoard[pos.i][pos.j].isMine = true
        minesPlaced++
    }
    
    for(var i = 0; i < gBoard.length; i++){
        for(var j = 0; j < gBoard[0].length; j++){
            if(!gBoard[i][j].isMine){
                gBoard[i][j].minesAroundCount = countMinesAround(i, j)
            }
        }
    }
}

function countMinesAround(cellI, cellJ){
    var count = 0
    for(var i = cellI - 1; i <= cellI + 1; i++){
        if(i < 0 || i >= gBoard.length) continue
        for(var j = cellJ - 1; j <= cellJ + 1; j++){
            if(j < 0 || j >= gBoard[0].length) continue
            if(i === cellI && j === cellJ) continue
            if(gBoard[i][j].isMine) count++
        }
    }
    return count
}


function renderBoard(){
    var strHTML = ''

    for(var i = 0; i < gBoard.length; i++){
        strHTML += '<tr>'
        for(var j = 0; j < gBoard[0].length; j++){
            var tdId = `cell-${i}-${j}`
            var cell = gBoard[i][j]
            var cellClass = 'cell'
            var cellContent = ''

            if(cell.isRevealed){
                cellClass += ' clicked'
                if(cell.isMine){
                    cellContent = BOMB
                } else if(cell.minesAroundCount > 0){
                    cellContent = cell.minesAroundCount
                    cellClass += ` mine-number-${cell.minesAroundCount}`
                }
            } else if(cell.isMarked){
                cellContent = FLAG
            }

            strHTML += `<td id="${tdId}" 
                oncontextmenu="onCellMarked(event, ${i}, ${j})" 
                onclick="onCellClicked(${i}, ${j})"
                class="${cellClass}">
                ${cellContent}
            </td>`
        }
        strHTML += '</tr>'
    }
    
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    elBoard.addEventListener("contextmenu", (e) => { e.preventDefault() })
    updateInfo()
}

function gameOver(isVictory){
    gGame.isOn = false
    stopTimer()
    
    var elFace = document.querySelector('.game-face')
    var elBoard = document.querySelector('.board')
    
    if(isVictory){
        elFace.innerText = HAPPY_FACE
        elBoard.innerHTML = `
            <tr><td colspan="${gLevel.SIZE}">
                <h2>🎉 You Won! 🎉</h2>
                <p>Time: ${gTime.toFixed(2)} seconds</p>
                <button onclick="resetGame()">Play Again</button>
            </td></tr>
        `
    } else {
        elFace.innerText = DEAD_FACE
        for(var i = 0; i < gBoard.length; i++){
            for(var j = 0; j < gBoard[0].length; j++){
                if(gBoard[i][j].isMine){
                    gBoard[i][j].isRevealed = true
                }
            }
        }
        renderBoard()
        
        setTimeout(() => {
            elBoard.innerHTML = `
                <tr><td colspan="${gLevel.SIZE}">
                    <h2>💣 Game Over! 💣</h2>
                    <button onclick="resetGame()">Try Again</button>
                </td></tr>
            `
        }, 2000)
    }
}

function startTimer(){
    gStartTime = Date.now()
    var elTime = document.querySelector('.time')

    gTimerInterval = setInterval(() => {
        var diff = (Date.now() - gStartTime) / 1000
        elTime.innerText = 'Time: ' + diff.toFixed(3)
    }, 100)
}

function stopTimer(){
    if(gTimerInterval){
        gTime = (Date.now() - gStartTime) / 1000
        gBestTimes.push(gTime.toFixed(2))
        clearInterval(gTimerInterval)
        gTimerInterval = null
        updateScoreBoard()
    }
}

function updateInfo(){
    var elBomb = document.querySelector('.bomb')
    var minesLeft = gLevel.MINES - gGame.markedCount
    elBomb.innerText = 'Mines: ' + minesLeft
    
    var elFace = document.querySelector('.game-face')
    if(!gGame.isOn && gGame.isFirstClick){
        elFace.innerText = GAME_FACE
    }
}

function updateLives(){
    var elLive = document.querySelector('.live')
    var heartsHTML = '<tr>'
    
    for(var i = 0; i < 3; i++){
        if(i < gGame.live){
            heartsHTML += `<td>${HEART}</td>`
        } else {
            heartsHTML += `<td>${BROKEN_HEART}</td>`
        }
    }
    heartsHTML += '</tr>'
    elLive.innerHTML = heartsHTML
}

function updateHints(){
    var elHint = document.querySelector('.hint')
    var hintsHTML = '<tr>'
    
    for(var i = 0; i < 3; i++){
        if(i < gHint){
            hintsHTML += '<td>🔎</td>'
        } else {
            hintsHTML += '<td class="inUse">🔎</td>'
        }
    }
    hintsHTML += '</tr>'
    elHint.innerHTML = hintsHTML
}

function updateScoreBoard(){
    var sortedTimes = [...gBestTimes].sort((a, b) => parseFloat(a) - parseFloat(b)).slice(0, 5)
    var elScoreBoard = document.querySelector('.top-5-score')
    var strHTML = '<ol>'

    for(var i = 0; i < 5; i++){
        if(sortedTimes[i]){
            strHTML += `<li>${sortedTimes[i]}s</li>`
        } else {
            strHTML += '<li>---</li>'
        }
    }
    strHTML += '</ol>'
    elScoreBoard.innerHTML = strHTML
}

function revealCellHint(cellI, cellJ){
    var cellsToReveal = []
    
    for(var i = cellI - 1; i <= cellI + 1; i++){
        if(i < 0 || i >= gBoard.length) continue
        for(var j = cellJ - 1; j <= cellJ + 1; j++){
            if(j < 0 || j >= gBoard[0].length) continue
            var cell = gBoard[i][j]
            if(!cell.isRevealed && !cell.isMarked){
                cellsToReveal.push({i, j, wasRevealed: cell.isRevealed})
                cell.isRevealed = true
            }
        }
    }
    
    renderBoard()
    
    setTimeout(() => {
        cellsToReveal.forEach(pos => {
            gBoard[pos.i][pos.j].isRevealed = pos.wasRevealed
        })
        renderBoard()
        gGame.gHintMode = false
    }, 2000)
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}
