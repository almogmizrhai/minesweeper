

'use strict'


var gLevel = { 
    SIZE: 4, 
    MINES: 2, 
}

var gGame = { 
    isOn: false, 
    isFirstClick: true,
    gHintMode: false,
    revealedCount: 0, 
    markedCount: 0, 
    secsPassed: 0, 
    live: 3,
}

var gBoard = []
var gCellPos = []
var gBestTimes = []
var gMoveHistory = []
var gIsDarkMode = false
var gHint = 3
var gCellCount = 0
var gStartTime
var gTimerInterval
var gTime 

const FLAG = '🚩'
const BOMB = '💣'
const GAME_FACE = '🤔'
const DEAD_FACE = '💀'
const HAPPY_FACE = '🥳'
const HEART = '❤️'
const BROKEN_HEART = '💔'



function onInit(){ 
    gLevel.SIZE = 4
    gLevel.MINES = 2
    gCellCount = gLevel.SIZE * gLevel.SIZE
    resetGame()
}

function startGame(){
    gGame.isOn = true
    startTimer()
}

function onCellClicked(cellI, cellJ){
    if(!gGame.isOn && !gGame.isFirstClick) return
    
    var cell = gBoard[cellI][cellJ]
    if(cell.isMarked || cell.isRevealed) return

    if(gGame.isFirstClick){
        startGame()
        placeMines(cellI, cellJ)
        gGame.isFirstClick = false
    }

    if(gGame.gHintMode){
        revealCellHint(cellI, cellJ)
        return
    }

    gMoveHistory.push({
        type: 'reveal',
        cellI: cellI,
        cellJ: cellJ,
        wasRevealed: cell.isRevealed
    })

    revealCell(cellI, cellJ)
    checkGameEnd()
}

function revealCell(cellI, cellJ){
    var cell = gBoard[cellI][cellJ]
    if(cell.isRevealed || cell.isMarked) return

    cell.isRevealed = true
    gGame.revealedCount++

    if(cell.isMine){
        handleMineClick()
    } else if(cell.minesAroundCount === 0){
        for(var i = cellI - 1; i <= cellI + 1; i++){
            if(i < 0 || i >= gBoard.length) continue
            for(var j = cellJ - 1; j <= cellJ + 1; j++){
                if(j < 0 || j >= gBoard[0].length) continue
                if(i === cellI && j === cellJ) continue
                revealCell(i, j)
            }
        }
    }
    renderBoard()
}

function onCellMarked(event, cellI, cellJ){
    event.preventDefault()
    if(!gGame.isOn) return
    
    var cell = gBoard[cellI][cellJ]
    if(cell.isRevealed) return

    gMoveHistory.push({
        type: 'mark',
        cellI: cellI,
        cellJ: cellJ,
        wasMarked: cell.isMarked
    })

    if(cell.isMarked){
        cell.isMarked = false
        gGame.markedCount--
    } else {
        cell.isMarked = true
        gGame.markedCount++
    }
    
    renderBoard()
    checkGameEnd()
}

function handleMineClick(){
    gGame.live--
    updateLives()
    
    if(gGame.live <= 0){
        gameOver(false)
    } else {
        var elFace = document.querySelector('.game-face')
        elFace.innerText = DEAD_FACE
        setTimeout(() => {
            elFace.innerText = GAME_FACE
        }, 1500)
    }
}

function checkGameEnd(){
    var revealedNonMines = 0
    var correctFlags = 0
    
    for(var i = 0; i < gBoard.length; i++){
        for(var j = 0; j < gBoard[0].length; j++){
            var cell = gBoard[i][j]
            if(!cell.isMine && cell.isRevealed){
                revealedNonMines++
            }
            if(cell.isMine && cell.isMarked){
                correctFlags++
            }
        }
    }
    
    var totalNonMines = (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES
    
    if(revealedNonMines === totalNonMines){
        gameOver(true)
    }
}

function useHint(){
    if(!gGame.isOn || gHint <= 0) return
    
    gGame.gHintMode = true
    gHint--
    updateHints()
    
    alert('Click on a cell to reveal it and its neighbors for 2 seconds')
}

function useMegaHint(){
    if(!gGame.isOn) return
    alert('Mega Hint feature - coming soon!')
}

function safeClick(){
    if(!gGame.isOn) return
    
    var safeCells = []
    for(var i = 0; i < gBoard.length; i++){
        for(var j = 0; j < gBoard[0].length; j++){
            var cell = gBoard[i][j]
            if(!cell.isMine && !cell.isRevealed && !cell.isMarked){
                safeCells.push({i, j})
            }
        }
    }
    
    if(safeCells.length > 0){
        var randomIndex = Math.floor(Math.random() * safeCells.length)
        var safeCell = safeCells[randomIndex]
        
        var elCell = document.getElementById(`cell-${safeCell.i}-${safeCell.j}`)
        elCell.style.backgroundColor = 'lightgreen'
        
        setTimeout(() => {
            elCell.style.backgroundColor = ''
        }, 2000)
    }
}

function Exterminator(){
    if(!gGame.isOn) return
    
    var mineCount = 0
    for(var i = 0; i < gBoard.length; i++){
        for(var j = 0; j < gBoard[0].length; j++){
            if(gBoard[i][j].isMine && !gBoard[i][j].isMarked){
                gBoard[i][j].isMine = false
                mineCount++
                if(mineCount >= 3) break
            }
        }
        if(mineCount >= 3) break
    }
    
    gLevel.MINES -= mineCount
    
    for(var i = 0; i < gBoard.length; i++){
        for(var j = 0; j < gBoard[0].length; j++){
            if(!gBoard[i][j].isMine){
                gBoard[i][j].minesAroundCount = countMinesAround(i, j)
            }
        }
    }
    
    renderBoard()
}

function undo(){
    if(!gGame.isOn || gMoveHistory.length === 0) return
    
    var lastMove = gMoveHistory.pop()
    var cell = gBoard[lastMove.cellI][lastMove.cellJ]
    
    if(lastMove.type === 'reveal'){
        cell.isRevealed = lastMove.wasRevealed
        gGame.revealedCount--
    } else if(lastMove.type === 'mark'){
        cell.isMarked = lastMove.wasMarked
        if(lastMove.wasMarked){
            gGame.markedCount++
        } else {
            gGame.markedCount--
        }
    }
    
    renderBoard()
}

function darkMode(){
    gIsDarkMode = !gIsDarkMode
    var body = document.body
    
    if(gIsDarkMode){
        body.classList.add('dark-mode-active')
    } else {
        body.classList.remove('dark-mode-active')
    }
}

function resetGame(){
    if(gTimerInterval){
        clearInterval(gTimerInterval)
        gTimerInterval = null
    }
    
    gGame = { 
        isOn: false, 
        isFirstClick: true,
        gHintMode: false,
        revealedCount: 0, 
        markedCount: 0, 
        secsPassed: 0, 
        live: 3,
    }
    
    gHint = 3
    gMoveHistory = []
    
    var elTime = document.querySelector('.time')
    elTime.innerText = 'Time: 0.000'
    
    updateLives()
    updateHints()
    
    gBoard = buildBoard()
    renderBoard()
}