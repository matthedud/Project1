
class Game {
	constructor(grid2D, players) {
		this.grid2D = grid2D
		this.players = players
		this.scale = 0.3
		this.cellWidth = (this.scale * canvasWidth) / grid2D[0].length
		this.cellheight = (this.scale * canvasHeight) / grid2D.length
		this.xOffset = canvasWidth / 2 - (canvasWidth * this.scale) / 2
	}
	drawMaze(rays) {
		this.grid2D.forEach((line, lineInd) => {
			line.forEach((cell, cellInd) => {
				this.drawCell(cell, cellInd, lineInd)
			})
		})
		// rays.forEach((ray) => {
		// 	ctx.strokeStyle = colors.rays
		// 	ctx.beginPath()
		// 	ctx.moveTo(ray.player.xPosition + ray.player.xOffset, ray.player.yPosition)
		// 	ctx.lineTo(
		// 		ray.player.xPosition+ ray.player.xOffset + Math.cos(ray.angle) * ray.distance,
		// 		ray.player.yPosition + Math.sin(ray.angle) * ray.distance
		// 	)
		// 	ctx.closePath()
		// 	ctx.stroke()
		// })
		this.players.forEach((player) => {
			player.draw(this.xOffset)
		})

		this.bullets.forEach((bullet) => {
			bullet.draw(this.xOffset)
		})
	}
	drawCell(cell, cellInd, lineInd) {
		ctx.fillStyle = cell ? colors.minimapWall : colors.minimapFloor
		const x =
			cellInd * this.cellWidth +
			canvasWidth / 2 -
			(this.scale * canvasWidth) / 2
		const y = lineInd * this.cellheight
		ctx.beginPath()
		ctx.fillRect(x, y, this.cellWidth, this.cellheight)
	}
	isWall(x, y) {
		const cellIndex = Math.floor(x / this.cellWidth)
		const lineIndex = Math.floor(y / this.cellheight)
		if (
			lineIndex < 0 ||
			cellIndex < 0 ||
			lineIndex > this.grid2D.length ||
			cellIndex > this.grid2D[0].length
		)
			return true
		return this.grid2D[lineIndex][cellIndex]
	}

	isPlayer(x, y, viewingPlayer) {
		for (const player of this.players) {
			if (
				x > player.xPosition - playerSize &&
				x < player.xPosition + playerSize &&
				y > player.yPosition - playerSize &&
				y < player.yPosition + playerSize
			) {
				if (viewingPlayer?.id !== player.id)
					return player
			}
		}
		return false
	}
}


class Shooter extends Game{
	constructor(grid2D, players){
		super(grid2D, players)
		this.bullets = []
		this.bulletCounter = 0
	}
	shoot(player) {
		if (player.canShoot) {
			this.bulletCounter++
			const bullet = new Bullet({ ...player }, this.bulletCounter)
			this.bullets.push(bullet)
			bullet.move(this)
			player.canShoot = false
			setTimeout(() => (player.canShoot = true), 500)
		}
	}
}

class Tag extends Game{
	constructor(grid2D, players){
		super(grid2D, players)
		this.timer=0
	}
}

class MegaShooter extends Shooter{
	constructor(grid2D, players){
		super(grid2D, players)
		this.scale = 1
		this.cellWidth = (this.scale * canvasWidth) / grid2D[0].length
		this.cellheight = (this.scale * canvasHeight) / grid2D.length
		this.xOffset = canvasWidth / 2 - (canvasWidth * this.scale) / 2
	}
}