'use strict'


var gBoardCell = { 
    minesAroundCount: 4, 
    isRevealed: false, 
    isMine: false, 
    isMarked: false, 
}

var gLevel = { 
    SIZE: 4, 
    MINES: 2, 
}

var gGame = { 
    isOn: false, 
    revealedCount: 0, 
    markedCount: 0, 
    secsPassed: 0, 
}

const FLAG = '🚩'
const BOMB = '💣'
const GAME_FACE = '🤔'
const DEAD_FACE = '💀'
const HAPPY_FACE = '🥳'
var gBoard

function onInit(){ 
    renderBoard()
}

function renderBoard(){
    var strHTML = ''
    gBoard = generateMat()
    console.table(gBoard)

    for(var i=0; i<gLevel.SIZE; i++){
        strHTML += '<tr>'
        for(var j=0; j<gLevel.SIZE; j++){
            if(gBoard[i][j].isMine === true){
                strHTML += `<td class="cell">${BOMB}</td>`  
            }else{
                strHTML += `<td class="cell">${''}</td>` 
            }
        }
        strHTML +='</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}