

'use strict'


var gBoardCell = { 
    minesAroundCount: 0, 
    isRevealed: false, 
    isMine: false, 
    isMarked: false, 
}

var gLevel = { 
    SIZE: 0, 
    MINES: 0, 
}

var gGame = { 
    isOn: false, 
    revealedCount: 0, 
    markedCount: 0, 
    secsPassed: 0, 
    live: 3,
}

const FLAG = '🚩'
const BOMB = '💣'
const GAME_FACE = '🤔'
const DEAD_FACE = '💀'
const HAPPY_FACE = '🥳'
var gBoard
var gTime

function onInit(){ 
    renderBoard()
}

function renderBoard(){
    var strHTML = ''
    gBoard = buildBoard()
    console.table(gBoard)
    var minesNegsCount = 0
    var className = 'cell'

    for(var i=0; i<gBoard.length; i++){
        strHTML += '<tr>'
        for(var j=0; j<gBoard[0].length; j++){
            var tdId = `cellI-${i}-cellJ-${j}`
            if(gBoard[i][j].isMine === true){
                strHTML += `<td id ="${tdId}" 
                onclick="onCellClicked(this,${i},${j})"
                class="${className}">
                <span class="hide">${BOMB}</span>
                </td>`  
            }else{
                minesNegsCount = setMinesNegsCount(i,j)
                gBoard[i][j].minesAroundCount = minesNegsCount
                strHTML += `<td id ="${tdId}" 
                onclick="onCellClicked(this,${i},${j})"
                class="${className}">
                <span class="hide">${minesNegsCount}</span>
                </td>` 
                
            }
        }
        strHTML +='</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    updateInfo()
}

function isFirstClick(){
    for(var i=0; i<gBoard.length; i++){
        for(var j=0; j<gBoard[0].length; j++){

        }
    }
}

function onCellClicked(elCell,cellI,cellJ){
    console.log('check  if gGame is On:', gGame.isOn)
    if(!gGame.isOn) return
    // console.log('elCell:',elCell)
    gGame.revealedCount ++
    console.log('clicked on cell, i:',cellI,'j:',cellJ)
    const elSpan = elCell.querySelector('span')
    updateInfo()
    // console.log('elSpan:',elSpan)
    elSpan.classList.remove('hide')
    elCell.classList.add('clicked')
    gGame.revealedCount ++
    checkForBomb(elCell) 
}

function onCellMarked(elCell, cellI,cellJ){
    // console.log('elCell:',elCell)
    console.log('elCell:',elCell)
    elCell.innerText = FLAG
}

function checkForBomb(elCell){
    const elSpan = elCell.querySelector('span')
    // console.log('elSpan:',elSpan)
    const elInfo = updateInfo()
    // console.log('elInfo:', elInfo)
    if(elSpan.innerText === BOMB) {
        if(gGame.live > 0){
            console.log('you lost a live')
            gGame.live--
            const elLive = elInfo.querySelector('.live')
            var liveMsg = 'Live:' + gGame.live
            elLive.innerText = liveMsg
            var elFace = elInfo.querySelector('.game-face')
            elFace.innerText = DEAD_FACE
            setTimeout(() => {
                elFace.innerText = GAME_FACE
            }, 2000)
        }else{
            showLostMsg()
            gGame.isOn = false
            stopTimer()
        }
        
    }
}

function starToPlay(){
    console.log('start the game')
    gGame.isOn = true
    startTimer()
}

function updateInfo(){
    const elInfo = document.querySelector('.game-info')
    // console.log('elInfo:', elInfo)
    const elBomb=elInfo.querySelector('.bomb')
    var msgBomb = 'Bomb on Board:'+ gLevel.MINES
    elBomb.innerText = msgBomb
    const elFace = elInfo.querySelector('.game-face')
    elFace.innerText = GAME_FACE

    return elInfo
}