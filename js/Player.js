const playerSize = 5
const turnSpeed = 0.05
const moveSpeed = 1
const FOV = 0.7

class Player {
	constructor(
		name,
		xPosition = 0,
		yPosition = 0,
		direction = 0,
		color,
		index = 0,
		role = "mouse"
	) {
		this.id = index
		this.index = index
		this.name = name
		this.xPosition = xPosition
		this.yPosition = yPosition
		this.direction = direction
		this.color = color
		this.controller = null
		this.canShoot = true
		this.role = role
		this.score = 0
		this.playerTopImage = new Image()
		this.playerTopImage.src = "./Image/player/topgun.gif"
		this.gunImage = new Image()
		this.gunImage.src = "./Image/gun/PngItem_967910.png"
		this.gunImageIndex = 0
	}
	draw(xOffset) {
		// ctx.save()
		// ctx.translate(this.xPosition + xOffset , this.yPosition )
		// ctx.rotate(this.direction)
		// ctx.drawImage(
		// 	this.playerTopImage,
		// 	-( playerSize * 2.5),
		// 	-( playerSize * 2.5),
		// 	playerSize * 5,
		// 	playerSize * 5
		// )
		// ctx.restore()

		const xDirection =
			this.xPosition + Math.cos(this.direction) * playerSize
		const yDirection =
			this.yPosition + Math.sin(this.direction) * playerSize
		ctx.fillStyle = this.color
		ctx.strokeStyle = "green"
		ctx.beginPath()
		ctx.arc(
			this.xPosition + xOffset,
			this.yPosition,
			playerSize,
			0,
			2 * Math.PI
		)
		ctx.closePath()
		ctx.fill()
		ctx.beginPath()
		ctx.moveTo(this.xPosition + xOffset, this.yPosition)
		ctx.lineTo(xDirection + xOffset, yDirection)
		ctx.closePath()
		ctx.stroke()
		ctx.fillStyle = "black"
		ctx.font = "10px Arial"
		ctx.fillText(
			`${this.name}`,
			this.xPosition + xOffset,
			this.yPosition - 18
		)
	}
	setMove(maze) {
		if (this.controller) {
			if (this.controller.id[0] === "K") {
				if (this.controller.up) {
					const newXposition = Math.cos(this.direction) * moveSpeed
					const newYposition = Math.sin(this.direction) * moveSpeed
					this.move(maze, newXposition, newYposition)
				} else if (this.controller.down) {
					const newXposition = -Math.cos(this.direction) * moveSpeed
					const newYposition = -Math.sin(this.direction) * moveSpeed
					this.move(maze, newXposition, newYposition)
				}
				if (this.controller.turnRight) this.rotate(turnSpeed, maze)
				else if (this.controller.turnLeft) this.rotate(-turnSpeed, maze)
				if (this.controller.shoot) {
					if (this.canShoot) {
						game.shoot(this)
						this.shoot()
						this.canShoot = false
					}
				}
			} else {
				const gp = navigator.getGamepads()[this.controller?.index]
				const newXposition =
					-Math.cos(this.direction) *
					moveSpeed *
					Number(gp.axes[1].toFixed(1))
				const newYposition =
					-Math.sin(this.direction) *
					moveSpeed *
					Number(gp.axes[1].toFixed(1))
				const xStrafe = -Math.cos(this.direction-Math.PI/2) * moveSpeed * Number((gp.axes[0]).toFixed(1))
				const yStrafe = -Math.sin(this.direction-Math.PI/2) * moveSpeed * Number((gp.axes[0]).toFixed(1))
				this.move(maze, newXposition + xStrafe, newYposition+yStrafe)
				// this.move(maze,  xStrafe, yStrafe )
				const newRotate = turnSpeed * gp.axes[2]
				this.rotate(newRotate, maze)
				// this.direction = Math.atan(gp.axes[3], gp.axes[2])
				if (gp.buttons[7].pressed) {
					if (this.canShoot) {
						game.shoot(this)
						this.shoot()
						this.canShoot = false
					}
				}
			}
		}
	}
	shoot() {
		setTimeout(() => {
			if (this.gunImageIndex > 400) {
				this.canShoot = true
				this.gunImageIndex = 0
			} else {
				this.gunImageIndex += 110
				this.shoot()
			}
		}, 150)
	}

	// controlerMove(maze) {
	// 	if (this.controller !== null) {
	// 		const gp = navigator.getGamepads()[this.controller]
	// 		const newXposition =
	// 			this.xPosition + Number(gp.axes[0].toFixed(1)) * moveSpeed
	// 		const newYposition =
	// 			this.yPosition + Number(gp.axes[1].toFixed(1)) * moveSpeed
	// 		if (!maze.isWall(newXposition, newYposition)) {
	// 			this.xPosition = newXposition
	// 			this.yPosition = newYposition
	// 		}
	// 		this.direction = Math.atan(gp.axes[3], gp.axes[2])
	// 		if (gp.buttons[7].pressed) game.shoot(this)
	// 	}
	// }
	move(maze, xMove, yMove) {
		if (!maze.isWall(this.xPosition + xMove, this.yPosition + yMove)) {
			this.xPosition += xMove
			this.yPosition += yMove
		}
	}
	rotate(newRotate, maze) {
		this.direction += newRotate + 2 * Math.PI
		this.direction %= 2 * Math.PI
	}
}
