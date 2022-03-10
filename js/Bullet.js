const bulletVelocity = 9

class Bullet {
	constructor(player, id) {
		this.xPosition = player.xPosition
		this.yPosition = player.yPosition
		this.direction = player.direction
		this.player = player
		this.id = id
	}
	draw(xOffset) {
		ctx.fillStyle = colors.bullet
		ctx.beginPath()
		ctx.arc(this.xPosition + xOffset, this.yPosition, 1, 0, 2 * Math.PI)
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
			this.player.score++
			maze.resetGame(player)
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
