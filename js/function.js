

'use strict'

var gStartTime
var gTimerInterval


function onCustomMode(){
    gLevel.SIZE = +prompt('Please enter the number of rows and columns you would like:')
    gLevel.MINES = +prompt('Please enter the number of bombs on the board:')
    console.log('mines on board:', gLevel.MINES)
    // gGame.isOn = true
    gCellCount = gLevel.SIZE * gLevel.SIZE
    resetGame()
}

function onChangeDifficulty(level, mines){
    gLevel.SIZE = level
    gLevel.MINES = mines
    console.log('mines on board:', gLevel.MINES)
    // gGame.isOn = true
    gCellCount = level * level
    onInit()
    resetGame()
}

function createCell(){
    gBoardCell = { 
        minesAroundCount: 0, 
        isRevealed: false, 
        isMine: false, 
        isMarked: false, 
    }
    return gBoardCell
}

function buildBoard() {
	const board = []
    const pos = []
    var temp 

	for (var i = 0; i < gLevel.SIZE; i++) {
		board[i] = []

		for (var j = 0; j < gLevel.SIZE; j++) {
			board[i][j] = createCell()
            pos.push({i,j})
		}
	}

    shuffle(pos)
    console.log('pos:',pos)

    for(i=0; i<gLevel.MINES; i++){
        temp = pos.pop()
        board[temp.i][temp.j].isMine = true
    }
        
    // board[2][1].isMine = true
    // board[0][2].isMine = true
    // board[3][2].isMine = true

	return board
}

function setMinesNegsCount(cellI, cellJ){
    var minesAroundCount = 0
    for(var i= cellI-1; i<=cellI+1; i++){
        if( i<0 || i>=gBoard.length) continue
        for(var j=cellJ-1; j<=cellJ+1; j++){
            if(j<0 || j>=gBoard[0].length) continue
            if(gBoard[i][j].isMine === true) minesAroundCount++
        }
    }
    return minesAroundCount
}

function startTimer(){
    gStartTime = Date.now()

    const elInfo = document.querySelector('.game-info')
    var elTime = elInfo.querySelector('.time')

    gTimerInterval = setInterval(() => {
        var diff = (Date.now() - gStartTime) / 1000
        elTime.innerText = 'Time:' + diff
    }, 100)
}

function stopTimer(){
    const elInfo = document.querySelector('.game-info')
    gTime = (Date.now() - gStartTime) / 1000
    // console.log('gtime:', gTime)
    gBestTimes.push(gTime)
    clearInterval(gTimerInterval)
    updateScoreBoard()
}

function shuffle(nums) {
    for (var i = nums.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var temp = nums[i]
        nums[i] = nums[j]
        nums[j] = temp
    }
}

function showVictoryMsg() {
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = `
        <h2>🎉 You Won! 🎉</h2>
        <button onclick="resetGame()">Start Over</button>
    `
}

function showLostMsg() {
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = `
        <h2>Oh No, You Lost, Try Again.</h2>
        <button onclick="resetGame()">Start Over</button>
    `
}
