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

const player1 = new Player("Bill", 100, 100, -0.6, "red")
const player2 = new Player("Bob", 600, 400, 1, "pink")

const game = new Maze(maze1, [player1, player2])


document.addEventListener("keydown", movePlayer)
document.addEventListener("keyup", stopPlayer)

function movePlayer(event) {
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

function getVCollision(angle) {
	const right = Math.abs(Math.floor((angle - Math.PI / 2) / Math.PI) % 2)
	const firstX = right
		? Math.floor(player1.xPosition / game.cellWidth) * game.cellWidth +
		  game.cellWidth
		: Math.floor(player1.xPosition / game.cellWidth) * game.cellWidth
	const firstY =
		player1.yPosition + (firstX - player1.xPosition) * Math.tan(angle)
	const xA = right ? game.cellWidth : -game.cellWidth
	const yA = xA * Math.tan(angle)
	let wall
	let nextX = firstX
	let nextY = firstY
	while (!wall) {
		const cellX = right
			? Math.floor(nextX / game.cellWidth)
			: Math.floor(nextX / game.cellWidth) - 1
		const cellY = Math.floor(nextY / game.cellWidth)
		if (outOfBounds(cellX, cellY)) {
			break
		}
		wall = game.grid2D[cellY][cellX]
		if (!wall) {
			nextX = xA
			nextY = yA
		}
	}
	return {
		angle,
		distance: distance(player1.xPosition, player1.yPosition, nextX, nextY),
		vertical: true,
	}
}
function castRay(angle) {
	const vCollision = getVCollision(angle)
	const hCollision = getHCollision(angle)
	return hCollision > vCollision ? hCollision : vCollision
}
function getHCollision(angle) {
	const up = Math.abs(Math.floor(angle / Math.PI) % 2)

	const firstY = up
		? Math.floor(player1.yPosition / game.cellheight) * game.cellheight
		: Math.floor(player1.yPosition / game.cellheight) * game.cellheight +
		  game.cellheight

	const firstX =
		player1.xPosition + (firstY - player1.yPosition) / Math.tan(angle)

	const yA = up ? -game.cellheight : game.cellheight
	const xA = yA / Math.tan(angle)

	let wall
	let nextX = firstX
	let nextY = firstY
	while (!wall) {
		const cellX = Math.floor(nextX / game.cellWidth)
		const cellY = up
			? Math.floor(nextY / game.cellheight) - 1
			: Math.floor(nextY / game.cellheight)

		if (outOfBounds(cellX, cellY)) {
			break
		}
		wall = game.grid2D[cellY][cellX]
		if (!wall) {
			nextX = xA
			nextY = yA
		}
	}
	return {
		angle,
		distance: distance(player1.xPosition, player1.yPosition, nextX, nextY),
		vertical: false,
	}
}

function renderScene(rays) {
	rays.forEach((ray, i) => {
		const distance = fixFishEye(ray.distance, ray.angle, player1.direction)
		console.log("RAY", distance)
		const wallHeight = ((cellSize * 5) / ray.distance) * 277
		ctx.fillStyle = ray.vertical ? "red" : "green"
		ctx.fillRect(i, canvasHeight / 2 - wallHeight / 2, 1, wallHeight)
		ctx.fillStyle = "yellow"
		ctx.fillRect(
			i,
			canvasHeight / 2 + wallHeight / 2,
			1,
			canvasHeight / 2 - wallHeight / 2
		)
		ctx.fillStyle = "blue"
		ctx.fillRect(i, 0, 1, canvasHeight / 2 - wallHeight / 2)
	})
}


function fixFishEye(distance, angle, playerAngle){
	const diff = angle - playerAngle
	return distance * Math.cos(diff)
  }

function getRay() {
	const initialAngle = player1.direction - FOV / 2
	const numberOfRays = canvasWidth
	const angleStep = FOV / numberOfRays
	return Array.from({ length: numberOfRays }, (_, i) => {
		const angle = initialAngle + i * angleStep
		const ray = castRay(angle)
		return ray
	})
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
}

setInterval(() => {
    console.log('here');
    clearCanvas()
	const ray = getRay()
	renderScene(ray)
    game.drawMaze()
}, 100)
