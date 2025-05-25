

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
    gHintMode: false,
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
const HINT = '🔎'
const HEART = '❤️'
const BROKEN_HEART = '💔'
var gHint = 3
var gBoard
var gTime 
var gBestTimes = []
var gCellCount =0

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
                oncontextmenu="onCellMarked(this,${i},${j})" 
                onclick="onCellClicked(this,${i},${j})"
                class="${className}">
                <span class="hide">${BOMB}</span>
                </td>`  
            }else{
                minesNegsCount = setMinesNegsCount(i,j)
                if(minesNegsCount === 0) minesNegsCount = ''
                gBoard[i][j].minesAroundCount = minesNegsCount
                strHTML += `<td id ="${tdId}" 
                oncontextmenu="onCellMarked(this,${i},${j})"
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
            if(gBoard[i][j].isRevealed || gBoard[i][j].isMarked) return
        }
    }
}

function onCellClicked(elCell,cellI,cellJ){
    console.log('check  if gGame is On:', gGame.isOn)
    if(!gGame.isOn) return
    if(gGame.gHintMode) revealCell(elCell,cellI, cellJ)
    // console.log('elCell:',elCell)
    gGame.revealedCount ++
    const cell =gBoard[cellI][cellJ]
    if(cell.isMarked) return
    console.log('clicked on cell, i:',cellI,'j:',cellJ)
    cell.isRevealed =true
    const elSpan = elCell.querySelector('span')
    updateInfo()
    // console.log('elSpan:',elSpan)
    elSpan.classList.remove('hide')
    elCell.classList.add('clicked')
    checkForBomb(elCell,cellI,cellJ)
    checkForEmptyCell(elCell,cellI,cellJ)
    checkVictory()
}

function useHint(){
    if(!gGame.isOn) return
    gGame.gHintMode = true
    gHint--
    const elHint = document.querySelector('.hint')
    if(gHint === 2) elHint.innerHTML = `<td> 🔎 </td> <td> 🔎 </td> <td class = "inUse"> 🔎 </td>  `
    if(gHint === 1) elHint.innerHTML = `<td> 🔎 </td><td class = "inUse"> 🔎 </td> <td class = "inUse"> 🔎 </td>`
    if(gHint === 0) elHint.innerHTML = `<td class = "inUse"> 🔎 </td><td class = "inUse"> 🔎 </td> <td class = "inUse"> 🔎 </td>`
}

function revealCell(elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            const neighborSpan = elCell.querySelector('span')
            // console.log('neighborSpan:',neighborSpan)
            neighborSpan.classList.remove('hide')
            neighborCell.classList.add('clicked')
        }
    }
    gGame.gHintMode = false
}

function onCellMarked(elCell, cellI,cellJ){
    if(!gGame.isOn) return
    // console.log('elCell:',elCell)
    elCell.addEventListener("contextmenu", (e) => {e.preventDefault()})
    const cell =gBoard[cellI][cellJ]
    if(cell.isRevealed) return
    if(cell.isMarked){
        console.log('unmarked cell, i:',cellI,'j:',cellJ)
        elCell.innerText = ''
        cell.isMarked = false
        gGame.markedCount--
    }else{
        if(elCell.innerText === BOMB){
            console.log('marked cell, i:',cellI,'j:',cellJ)
            elCell.innerText = FLAG
            cell.isMarked =true
            gGame.markedCount++
        }
    }
}

function checkForBomb(elCell,cellI,cellJ){
    const elSpan = elCell.querySelector('span')
    // console.log('elSpan:',elSpan)
    const elInfo = updateInfo()
    // console.log('elInfo:', elInfo)
    const cell =gBoard[cellI][cellJ]
    if(elSpan.innerText === BOMB) {
        if(gGame.live >= 1){
            checkLost(elInfo)
            setTimeout(() => {
                elSpan.classList.add('hide')
                elCell.classList.remove('clicked')
            }, 1000)
            cell.isRevealed = false
        }else{
            showLostMsg()
            gGame.isOn = false
            stopTimer()
        }
        
    }
}

function checkForEmptyCell(elCell,cellI,cellJ){
    for(var i= cellI-1; i<=cellI+1; i++){
        if( i<0 || i>=gBoard.length) continue
        for(var j=cellJ-1; j<=cellJ+1; j++){
            if(j<0 || j>=gBoard[0].length) continue
            const elSpan = elCell.querySelector('span')
            // console.log('elSpan:',elSpan)
            if(elSpan.innerText === '') {
                elSpan.classList.remove('hide')
                elCell.classList.add('clicked')
            }
        }
    }
}

function checkVictory(){
    var openCell = gLevel.SIZE * gLevel.SIZE - gLevel.MINES
    if(gGame.markedCount === gLevel.MINES && gGame.revealedCount === openCell){
        showVictoryMsg()
        var elFace = document.querySelector('.game-face')
        elFace.innerText = HAPPY_FACE
        gGame.isOn = false
        stopTimer()       
    }
}

function checkLost(elInfo){
    console.log('you lost a live')
    gGame.live--
    const elLive = document.querySelector('.live')
    if(gGame.live ===2) elLive.innerHTML = `<td> ${HEART} </td> <td> ${HEART} </td><td> ${BROKEN_HEART} </td>`
    if(gGame.live ===1) elLive.innerHTML = `<td> ${HEART} </td> <td> ${BROKEN_HEART} </td><td> ${BROKEN_HEART} </td>`
    if(gGame.live ===0) elLive.innerHTML = `<td> ${BROKEN_HEART} </td> <td> ${BROKEN_HEART} </td><td> ${BROKEN_HEART} </td>`
    var elFace = elInfo.querySelector('.game-face')
    elFace.innerText = DEAD_FACE
    setTimeout(() => {
        elFace.innerText = GAME_FACE
    }, 2000)
}

function starToPlay(){
    console.log('start the game')
    gGame.isOn = true
    startTimer()
}

function resetGame(){
    const elInfo = document.querySelector('.game-info')
    var elTime = elInfo.querySelector('.time')
    elTime.innerText = 'Time:' + 0.000
    gGame.live = 3
    const elLive = document.querySelector('.live')
    var liveMsg =  `<td> ${HEART} </td> <td> ${HEART} </td><td> ${HEART} </td>`
    elLive.innerText = liveMsg
    onInit()
    gGame = { 
        isOn: false, 
        revealedCount: 0, 
        markedCount: 0, 
        secsPassed: 0, 
        live: 3,
    }
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

function updateScoreBoard(){

    var strHTML = ''
    var sortedTimes = [...gBestTimes]
    sortedTimes.sort((a,b)=> a-b)
    sortedTimes.slice(0,5)
    
    const elScoreBoard = document.querySelector('.top-5-score')
    strHTML += '<ol>'

    for(var i=0; i<5; i++){
        strHTML += `<li>${sortedTimes[i]}</li>`
    }
    strHTML += '</ol>'
    elScoreBoard.innerHTML = strHTML
}

function useMegaHint(){
    if(!gGame.isOn) return
    console.log('use Mega Hint')
}

function safeClick(){
    if(!gGame.isOn) return
    console.log('safe Click')
}

function Exterminator(){
    if(!gGame.isOn) return
    console.log('Exterminator')
}

function undo(){
    if(!gGame.isOn) return
    console.log('undo')
}

function darkMode(){
    if(!gGame.isOn) return
    console.log('dark Mode')
}