'use strict'

var gBoardCell

var gBoardCell = { 
    minesAroundCount: 4, 
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
}

const FLAG = '🚩'
const BOMB = '💣'
const GAME_FACE = '🤔'
const DEAD_FACE = '💀'
const HAPPY_FACE = '🥳'
var gBoard

function onInit(){ 
    if(gGame.isOn){
        renderBoard()
    }
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

}

function onCellClicked(elCell,cellI,cellJ){
    // console.log('elCell:',elCell)
    console.log('clicked on cell, i:',cellI,'j:',cellJ)
    const elSpan = elCell.querySelector('span')
    // console.log('elSpan:',elSpan)
    elSpan.classList.remove('hide')
    elCell.classList.add('clicked')
    gGame.revealedCount ++
    checkForBomb(elCell)
}

function onCellMarked(elCell, cellI,cellJ){
    console.log('elCell:',elCell)
    elCell.innerText = FLAG
}

function checkForBomb(elCell){
    const elSpan = elCell.querySelector('span')
    // console.log('elSpan:',elSpan)

}