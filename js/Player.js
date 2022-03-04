const playerSize = 15
const turnSpeed = 0.1
const moveSpeed = 5
// const FOV = toRadiants(60)

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
		maze.clearCanvas()
		maze.drawMaze()
	}
	setRotate(key, maze) {
		if (!this.rotateState) {
			switch (key) {
				case "ArrowRight":
				case "d":
					this.rotateState = setInterval(
						() => this.rotate(maze, -turnSpeed),
						20
					)
					break
				case "ArrowLeft":
				case "q":
					this.rotateState = setInterval(
						() => this.rotate(maze, turnSpeed),
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
	rotate(maze, newRotate) {
		this.direction += newRotate
		maze.clearCanvas()
		maze.drawMaze()
	}
  getRay() {
    const initialAngle = this.direction - FOV / 2
    const numberOfRays = canvasWidth
    const angleStep = FOV / numberOfRays
    return Array.from({ length: numberOfRays }, (_, i) => {
      const angle = initialAngle + i * angleStep
      const ray = castRay(angle)
    })
  }
  getVCollision(angle) {
    const right = Math.abs(Math.floor((angle - Math.PI / 2) / Math.PI) % 2)
    const firstX = right
      ? Math.floor(player.xPosition / cellSize) * cellSize + cellSize
      : Math.floor(player.xPosition / cellSize) * cellSize
    const firstY = player.yPosition + (firstX - player.x) * Math.tan(angle)
    const xA = right ? cellSize : - cellSize
    const yA = xA * Math.tan(angle)
    let wall
    let nextX = firstX
    let nextY = firstY
    while (!Wall) {
      const cellX = right
        ? Math.floor(nextX / cellSize)
        : Math.floor(nextX / cellSize) - 1
      const cellY = Math.floor(nextY / cellSize)
      if (outOfBounds(cellX, cellY)) {
        break
      }
      wall = map[cellY][cellX]
      if (!wall) {
        nextX = xA
        nextY = yA
      }
    }
    return {
      angle,
      distance: distance(player.xPosition, player.yPosition, nextX, nextY),
      vertical: true,
    }
  }
  getHCollision(angle) {
    const up = Math.abs(Math.floor(angle / Math.PI) % 2)
  
    const firstY = up
      ? Math.floor(player.yPosition / cellSize) * cellSize
      : Math.floor(player.yPosition / cellSize) * cellSize + cellSize
  
    const firstX =
      player.xPosition + (firstY - player.yPosition) / Math.tan(angle)
  
    const yA = up ? -cellSize : cellSize
    const xA = yA / Math.tan(angle)
  
    let wall
    let nextX = firstX
    let nextY = firstY
    while (!Wall) {
      const cellX = Math.floor(nextX / cellSize)
      const cellY = up
        ? Math.floor(nextY / cellSize) - 1
        : Math.floor(nextY / cellSize)
  
      if (outOfBounds(cellX, cellY)) {
        break
      }
      wall = map[cellY][cellX]
      if (!wall) {
        nextX = xA
        nextY = yA
      }
    }
    return {
      angle,
      distance: distance(player.xPosition, player.yPosition, nextX, nextY),
      vertical: false,
    }
  }  
}