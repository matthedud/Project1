const playerSize = 15
const turnSpeed = 0.1
const moveSpeed = 5
// const FOV = toRadiants(0.5)
const FOV = (0.01)
const cellSize = 10

class Player {
	constructor(name, xPosition, yPosition, direction, color) {
		this.name = name
		this.xPosition = xPosition
		this.yPosition = yPosition
		this.direction = direction
		this.color = color
		this.moveState = null
		this.rotateState = null
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
		ctx.fillStyle = "black"
		ctx.font = "10px Arial"
		ctx.fillText(`${this.name}`, this.xPosition, this.yPosition - 18)
	}
	setMove(key, maze) {
		let newXposition = 0
		let newYposition = 0
		if (!this.moveState) {
			switch (key) {
				case "ArrowUp":
				case "z":
					newXposition = Math.cos(this.direction) * moveSpeed
					newYposition = -Math.sin(this.direction) * moveSpeed
					break
				case "ArrowDown":
				case "s":
					newXposition = -Math.cos(this.direction) * moveSpeed
					newYposition = +Math.sin(this.direction) * moveSpeed
					break
			}
			this.moveState = setInterval(
				() => this.move(maze, newXposition, newYposition),
				20
			)
		}
	}
	resetMove() {
		clearInterval(this.moveState)
		this.moveState = null
	}
	move(maze, xMove, yMove) {
		if (!maze.isWall(this.xPosition + xMove, this.yPosition + yMove)) {
			this.xPosition += xMove
			this.yPosition += yMove
		} else {
			this.resetMove()
		}
	}
	setRotate(key) {
		if (!this.rotateState) {
			switch (key) {
				case "ArrowRight":
				case "d":
					this.rotateState = setInterval(
						() => this.rotate(-turnSpeed),
						20
					)
					break
				case "ArrowLeft":
				case "q":
					this.rotateState = setInterval(
						() => this.rotate(turnSpeed),
						20
					)
					break
			}
		}
	}
	resetRotate() {
		clearInterval(this.rotateState)
		this.rotateState = null
	}
	rotate(newRotate) {
		this.direction += newRotate
	}

}



