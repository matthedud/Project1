const canvas = document.getElementById("maze-game")
const ctx = canvas.getContext("2d")
let bulletCounter = 0

const maze1 = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

const player1 = new Player("Bill", 300, 100, 0.2, "red")
const player2 = new Player("Bob", 500, 400, 1, "pink")

const game = new Maze(maze1, [player1, player2])

game.drawMaze()

document.addEventListener("keydown", movePlayer)
document.addEventListener("keyup", stopPlayer)

function movePlayer(event) {
	console.log(event.key)
	if (event.key === "ArrowRight" || event.key === "ArrowLeft")
		player1.setRotate(event.key, game)
	if (event.key === "ArrowUp" || event.key === "ArrowDown") {
		player1.setMove(event.key, game)
	}
	if (event.key === "z" || event.key === "s") {
		player2.setMove(event.key, game)
	}
	if (event.key === "q" || event.key === "d") {
		player2.setRotate(event.key, game)
	}
	if (event.key === "a") {
		bulletCounter++
		const bullet = new Bullet({ ...player2 }, bulletCounter)
		game.bullets.push(bullet)
		bullet.move(game)
	}
	if (event.key === ":") {
		bulletCounter++
		const bullet = new Bullet({ ...player1 }, bulletCounter)
		game.bullets.push(bullet)
		bullet.move(game)
	}
}

function stopPlayer(event) {
	console.log(event.key)
	if (event.key === "ArrowRight" || event.key === "ArrowLeft")
		player1.resetRotate(event.key, game)
	if (event.key === "ArrowUp" || event.key === "ArrowDown") {
		player1.resetMove(event.key, game)
	}
	if (event.key === "z" || event.key === "s") {
		player2.resetMove(event.key, game)
	}
	if (event.key === "q" || event.key === "d") {
		player2.resetRotate(event.key, game)
	}
}

function outOfBounds(x, y) {
	return x < 0 || x > canvasWidth || y < 0 || y > canvasHeight
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}


function castRay(angle) {
	const vCollision = getVCollision(angle)
	const hCollision = getHCollision(angle)

	return hCollision > vCollision ? hCollision : vCollision
}

function renderScene(rays) {
	rays.forEach((ray, i) => {
		const distance = fixFishEye(ray.distance, ray.angle, player.angle) 
		const wallHeight = ((cellSize * 5) / distance) * 277
		constext.fillStyle = ray.vertical ? "red" : "green"
		ctx.fillRect(i, canvasHeight / 2 - wallHeight / 2, 1, wallHeight)
		ctx.fillStyle = "yellow"
		ctx.fillRect(
			i,
			canvasHeight / 2 + wallHeight / 2,
			1,
			canvasHeight / 2 - wallHeight / 2
		)
    ctx.fillStyle = "blue"
		ctx.fillRect(
			i,
			0,
			1,
			canvasHeight / 2 - wallHeight / 2
		)
	})
}

function fixFishEye(distance, angle, playerAngle){
  const diff = angle - playerAngle
  return distance * Math.cos(diff)
}


