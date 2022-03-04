const bulletVelocity = 30

class Bullet {
	constructor({ xPosition, yPosition, direction }, id) {
		this.xPosition = xPosition
		this.yPosition = yPosition
		this.direction = direction
		this.id = id
	}
	draw() {
		ctx.fillStyle = "black"
		ctx.beginPath()
		ctx.arc(this.xPosition, this.yPosition, 2, 0, 2 * Math.PI)
		ctx.closePath()
		ctx.fill()
		ctx.stroke()
	}
	move(maze) {
		const newXposition =
			this.xPosition + Math.cos(this.direction) * bulletVelocity
		const newYposition =
			this.yPosition - Math.sin(this.direction) * bulletVelocity
		if (maze.isPlayer(newXposition, newYposition)) {
			maze.bullets = []
		} else if (!maze.isWall(newXposition, newYposition)) {
			this.xPosition = newXposition
			this.yPosition = newYposition
			maze.clearCanvas()
			maze.drawMaze()
			setTimeout(() => {
				if (this.move) this.move(maze)
			}, 100)
		} else {
			const bulletIndex = maze.bullets.findIndex(
				(el) => (el.id = this.id)
			)
			maze.bullets.splice(bulletIndex, 1)
			maze.clearCanvas()
			maze.drawMaze()
		}
	}
}