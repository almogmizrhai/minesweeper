

'use strict'


function onChangeDifficulty(level, mines){
    gLevel.SIZE = level
    gLevel.MINES = mines
    console.log('mines on board:', gLevel.MINES)
    gGame.isOn = true
    onInit()
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
    var minesOnBoard = gLevel.MINES


	for (var i = 0; i < gLevel.SIZE; i++) {
		board[i] = []

		for (var j = 0; j < gLevel.SIZE; j++) {
			board[i][j] = createCell()
            if(minesOnBoard != 0){
                board[i][j].isMine = (Math.random() > 0.5) ? true : false
                minesOnBoard --
            }
		}
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

function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1) + min) 
}