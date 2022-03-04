const canvas = document.getElementById("maze-game")
const ctx = canvas.getContext("2d")
const canvasWidth = 1000
const canvasHeight = 500
const moveSpeed = 10
const turnSpeed = 0.2
const playerSize = 15
let bulletCounter = 0

const squareMaze1 = [
	[1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 1, 1],
	[1, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 1],
	[1, 0, 0, 0, 1, 0, 0, 1],
	[1, 0, 0, 1, 1, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 1],
	[1, 1, 0, 0, 0, 0, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1],
]

class Player {
	constructor(name, xPosition, yPosition, direction, color) {
		this.name = name
		this.xPosition = xPosition
		this.yPosition = yPosition
		this.direction = direction
		this.color = color
	}
	draw() {
		const xDirection =
			this.xPosition + Math.cos(this.direction) * playerSize
		const yDirection =
			this.yPosition - Math.sin(this.direction) * playerSize
		ctx.fillStyle = this.color
		ctx.strokeStyle = "green"
		ctx.beginPath()
		ctx.arc(this.xPosition, this.yPosition, playerSize, 0, 2 * Math.PI)
		ctx.closePath()
		ctx.fill()
		ctx.beginPath()
		ctx.moveTo(this.xPosition, this.yPosition)
		ctx.lineTo(xDirection, yDirection)
		ctx.closePath()
		ctx.stroke()
	}
	move(key, maze) {
		let newXposition = 0
		let newYposition = 0
		switch (key) {
			case "ArrowRight":
			case "d":
				this.direction -= turnSpeed
				break
			case "ArrowLeft":
			case "q":
				this.direction += turnSpeed
				break
			case "ArrowUp":
			case "z":
				newXposition =
					this.xPosition + Math.cos(this.direction) * moveSpeed
				newYposition =
					this.yPosition - Math.sin(this.direction) * moveSpeed
				if (!maze.isWall(newXposition, newYposition)) {
					this.xPosition = newXposition
					this.yPosition = newYposition
				}
				break
			case "ArrowDown":
			case "s":
				newXposition = this.xPosition - Math.cos(this.direction) * moveSpeed
				newYposition = this.yPosition + Math.sin(this.direction) * moveSpeed
				if (!maze.isWall(newXposition, newYposition)) {
					this.xPosition = newXposition
					this.yPosition = newYposition
				}
				break
		}
		maze.clearCanvas()
		maze.drawMaze()
	}
}

class Bullet {
	constructor({xPosition, yPosition, direction}, id) {
		this.xPosition = xPosition
		this.yPosition = yPosition
		this.direction = direction
		this.id = id
	}
	move(maze) {
		newXposition = this.xPosition + Math.cos(this.direction) * moveSpeed
		newYposition = this.yPosition - Math.sin(this.direction) * moveSpeed
		if (!maze.isWall(newXposition, newYposition)) {
      this.xPosition = newXposition
      this.yPosition = newYposition
			maze.clearCanvas()
			maze.drawMaze()
      this.move(maze)
		}
    else {
      const bulletIndex = maze.bullets.findIndex(el=>el.id = this.id)
      maze.bullets.splice(bulletIndex, 1)
    }
	}
}

class Maze {
	constructor(grid2D, players, bullets) {
		this.grid2D = grid2D
		this.players = players
		this.bullets = bullets
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
}

const player1 = new Player("John", 300, 100, 0.2, "red")
const player2 = new Player("John", 500, 400, 1, "pink")

const game = new Maze(squareMaze1, [player1, player2])

game.drawMaze()

document.addEventListener("keydown", movePlayer)

function movePlayer(event) {
	console.log(event.key)
	if (
		event.key === "ArrowRight" ||
		event.key === "ArrowLeft" ||
		event.key === "ArrowUp" ||
		event.key === "ArrowDown"
	) {
		player1.move(event.key, game)
	}
	if (
		event.key === "z" ||
		event.key === "s" ||
		event.key === "q" ||
		event.key === "d"
	) {
		player2.move(event.key, game)
	}
	if (event.key === "Shift"){
    bulletCounter++
    const bullet = new Bullet({...player2}, bulletCounter)
    bullet.shoot(game)
  }
	if (event.key === "Control"){
    bulletCounter++
    const bullet = new Bullet({...player1}, bulletCounter)
    bullet.shoot(game)
  }
}
