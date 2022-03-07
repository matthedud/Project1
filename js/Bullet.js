const bulletVelocity = 9

class Bullet {
	constructor({ xPosition, yPosition, direction }, id) {
		this.xPosition = xPosition
		this.yPosition = yPosition
		this.direction = direction
		this.id = id
		this.xOffset = canvasWidth / 2 - canvasWidth*scale/2
	}
	draw() {
		ctx.fillStyle = colors.bullet
		ctx.beginPath()
		ctx.arc(this.xPosition + this.xOffset, this.yPosition, 1, 0, 2 * Math.PI)
		ctx.closePath()
		ctx.fill()
		ctx.stroke()
	}
	move(maze) {
		const newXposition =
			this.xPosition + Math.cos(this.direction) * bulletVelocity
		const newYposition =
			this.yPosition + Math.sin(this.direction) * bulletVelocity
        const player = maze.isPlayer(newXposition, newYposition)
		if (player) {
            player.name = window.prompt(
                `${player.name} lost, name him:`,
                player.name
            )
			maze.bullets = []
		} else if (!maze.isWall(newXposition, newYposition)) {
			this.xPosition = newXposition
			this.yPosition = newYposition
			setTimeout(() => {
				if (this) this.move(maze)
			}, 30)
		} else {
			const bulletIndex = maze.bullets.findIndex(
				(el) => (el.id = this.id)
			)
			maze.bullets.splice(bulletIndex, 1)
		}
	}
}
