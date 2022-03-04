const canvasWidth = 1000
const canvasHeight = 500

class Maze {
	constructor(grid2D, players) {
		this.grid2D = grid2D
		this.players = players
		this.bullets = []
		this.cellWidth = canvasWidth / grid2D[0].length
		this.cellheight = canvasHeight / grid2D.length
	}
	clearCanvas() {
		ctx.clearRect(0, 0, canvasWidth, canvasHeight)
	}
	drawMaze() {
		this.grid2D.forEach((line, lineInd) => {
			line.forEach((cell, cellInd) => {
				if (cell) this.drawWall(cellInd, lineInd)
			})
		})
		this.players.forEach((player) => {
			player.draw()
		})
		this.bullets.forEach((bullet) => {
			bullet.draw()
		})
	}
	drawWall(cellInd, lineInd) {
		const x = cellInd * this.cellWidth
		const y = lineInd * this.cellheight
		ctx.beginPath()
		ctx.fillStyle = "blue"
		ctx.fillRect(x, y, this.cellWidth, this.cellheight)
	}
	isWall(x, y) {
		const cellIndex = Math.floor(x / this.cellWidth)
		const lineIndex = Math.floor(y / this.cellheight)
		return this.grid2D[lineIndex][cellIndex]
	}
	isPlayer(x, y) {
		for (const player of this.players) {
			if (
				x > player.xPosition - playerSize &&
				x < player.xPosition + playerSize &&
				y > player.yPosition - playerSize &&
				y < player.yPosition + playerSize
			) {
				player.name = window.prompt(
					`${player.name} lost, name him:`,
					player.name
				)
				return true
			}
		}
		return false
	}

}

