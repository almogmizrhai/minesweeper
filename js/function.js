'use strict'


function createCell(){
    var gBoardCell = { 
        minesAroundCount: 4, 
        isRevealed: false, 
        isMine: false, 
        isMarked: false, 
    }
    return gBoardCell
}

function generateMat() {
	const mat = []


	for (var i = 0; i < gLevel.SIZE; i++) {
		mat[i] = []

		for (var j = 0; j < gLevel.SIZE; j++) {
			mat[i][j] = createCell()
		}
	}

    mat[2][1].isMine = true
    mat[0][2].isMine = true

	return mat
}

function onChangeDifficulty(level, mines){
    gLevel.SIZE = level
    gLevel.MINES = mines
    console.log('mines on board:', gLevel.MINES)
    onInit()
}

function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1) + min) 
}