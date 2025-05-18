'use strict'


function generateMat() {
	const mat = []

	for (var i = 0; i < gLevel.SIZE; i++) {
		mat[i] = []

		for (var j = 0; j < gLevel.SIZE; j++) {
			mat[i][j] = gBoardCell
		}
	}
	return mat
}

function onChangeDifficulty(level){
    gLevel.SIZE = level
    gLevel.MINES = (level/2)
    // console.log(gLevel)
    onInit()
}

function getRandomInt(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1) + min) 
}