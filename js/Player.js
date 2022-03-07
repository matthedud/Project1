const playerSize = 5
const turnSpeed = 0.05
const moveSpeed = 1
// const FOV = toRadiants(0.5)
const FOV = 0.7
const cellSize = 10

class Player {
	constructor(name, xPosition = 0, yPosition = 0, direction = 0, color) {
		this.name = name
		this.xPosition = xPosition
		this.yPosition = yPosition
		this.direction = direction
		this.color = color
		this.moveState = null
		this.rotateState = null
		this.controllerIndex = null
		this.canShoot = true
		this.xOffset = canvasWidth / 2 - (canvasWidth * scale) / 2
	}
	draw() {
		const xDirection =
			this.xPosition + Math.cos(this.direction) * playerSize
		const yDirection =
			this.yPosition + Math.sin(this.direction) * playerSize
		ctx.fillStyle = this.color
		ctx.strokeStyle = "green"
		ctx.beginPath()
		ctx.arc(
			this.xPosition + this.xOffset,
			this.yPosition,
			playerSize,
			0,
			2 * Math.PI
		)
		ctx.closePath()
		ctx.fill()
		ctx.beginPath()
		ctx.moveTo(this.xPosition + this.xOffset, this.yPosition)
		ctx.lineTo(xDirection + this.xOffset, yDirection)
		ctx.closePath()
		ctx.stroke()
		ctx.fillStyle = "black"
		ctx.font = "10px Arial"
		ctx.fillText(
			`${this.name}`,
			this.xPosition + this.xOffset,
			this.yPosition - 18
		)
	}
	setMove(key, maze) {
		let newXposition = 0
		let newYposition = 0
		if (!this.moveState) {
			switch (key) {
				case "ArrowUp":
				case "z":
					newXposition = Math.cos(this.direction) * moveSpeed
					newYposition = Math.sin(this.direction) * moveSpeed
					break
				case "ArrowDown":
				case "s":
					newXposition = -Math.cos(this.direction) * moveSpeed
					newYposition = -Math.sin(this.direction) * moveSpeed
					break
			}
			this.moveState = {
				interval: setInterval(
					() => this.move(maze, newXposition, newYposition),
					20
				),
				key,
			}
		}
	}
	controlerMove(maze) {
		if (this.controllerIndex !== null) {
			const gp = navigator.getGamepads()[this.controllerIndex]
			const newXposition =
				this.xPosition + Number(gp.axes[0].toFixed(1)) * moveSpeed
			const newYposition =
				this.yPosition + Number(gp.axes[1].toFixed(1)) * moveSpeed
			if (!maze.isWall(newXposition, newYposition)) {
				this.xPosition = newXposition
				this.yPosition = newYposition
			}
			this.direction = Math.atan2(gp.axes[3], gp.axes[2])
			if (gp.buttons[7].pressed) game.shoot(this)
		}
	}
	resetMove() {
		clearInterval(this.moveState.interval)
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
	setRotate(key, maze) {
		if (!this.rotateState) {
			switch (key) {
				case "ArrowRight":
				case "d":
					this.rotateState = setInterval(
						() => this.rotate(turnSpeed, maze),
						20
					)
					break
				case "ArrowLeft":
				case "q":
					this.rotateState = setInterval(
						() => this.rotate(-turnSpeed, maze),
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
	rotate(newRotate, maze) {
		this.direction += newRotate
		this.direction %= 2 * Math.PI
		if (this.moveState) {
            const key=this.moveState.key
			this.resetMove()
			this.setMove(key, maze)
		}
	}
}
