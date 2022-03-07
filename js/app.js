const parentEl = document.getElementById("game")
const canvasWidth = 1000
const canvasHeight = 500

const canvas = document.createElement("canvas")
canvas.height = canvasHeight
canvas.width = canvasWidth

const ctx = canvas.getContext("2d")

parentEl.appendChild(canvas)

const numberOfRays = canvasWidth / 2
let playerRays = {}
const colors = {
	floor: "yellow",
	wall: "#013aa6",
	wallDark: "#012975",
	rays: "#ffa600",
	minimapFloor: "white",
	minimapWall: "green",
	bullet: "black",
	player: "purple",
}

const player1 = new Player("Bob", 190, 100, Math.PI, "pink", 0)
const player2 = new Player("Bill", 50, 100, 0, "red", 1)

const game = new Maze(maze2, [player1, player2])

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
		game.shoot(player2)
	}
	if (event.key === ":") {
		game.shoot(player1)
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
	return (
		x < 0 || x >= game.grid2D[0].length || y < 0 || y >= game.grid2D.length
	)
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function getVCollision(angle, player, i) {
	const right = Math.abs(Math.floor((angle - Math.PI / 2) / Math.PI) % 2)
	const firstX = right
		? Math.floor(player.xPosition / game.cellWidth) * game.cellWidth +
		  game.cellWidth
		: Math.floor(player.xPosition / game.cellWidth) * game.cellWidth

	const firstY =
		player.yPosition + (firstX - player.xPosition) * Math.tan(angle)

	const xStep = right ? game.cellWidth : -game.cellWidth
	const yStep = xStep * Math.tan(angle)
	let wall
	let nextX = firstX
	let nextY = firstY
	while (!wall) {
		const cellX = right
			? Math.floor(nextX / game.cellWidth)
			: Math.floor(nextX / game.cellWidth) - 1
		const cellY = Math.floor(nextY / game.cellheight)
		if (outOfBounds(cellX, cellY)) {
			break
		}
		if (game.isPlayer(nextX, nextY, player)) {
			playerRays[player.id].push({
				i,
				angle,
				distance: distance(
					player.xPosition,
					player.yPosition,
					nextX,
					nextY
				),
				vertical: true,
				player,
			})
		}
		wall = game.grid2D[cellY][cellX]
		if (!wall) {
			nextX += xStep
			nextY += yStep
		}
	}
	return {
		angle,
		distance: distance(player.xPosition, player.yPosition, nextX, nextY),
		xOffset:(nextY % game.cellheight)/game.cellheight,
		vertical: true,
		player,
	}
}

function getHCollision(angle, player, i) {
	const up = Math.abs(Math.floor(angle / Math.PI) % 2)
	const firstY = up
		? Math.floor(player.yPosition / game.cellheight) * game.cellheight
		: Math.floor(player.yPosition / game.cellheight) * game.cellheight +
		  game.cellheight

	const firstX =
		player.xPosition + (firstY - player.yPosition) / Math.tan(angle)

	const yStep = up ? -game.cellheight : game.cellheight
	const xStep = yStep / Math.tan(angle)

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
		if (game.isPlayer(nextX, nextY, player)) {
			playerRays[player.id].push({
				i,
				angle,
				distance: distance(
					player.xPosition,
					player.yPosition,
					nextX,
					nextY
				),
				vertical: false,
				player,
			})
		}
		wall = game.grid2D[cellY][cellX]
		if (!wall) {
			nextX += xStep
			nextY += yStep
		}
	}
	return {
		angle,
		distance: distance(player.xPosition, player.yPosition, nextX, nextY),
		xOffset: (nextX % game.cellheight)/game.cellheight,
		vertical: false,
		player,
	}
}
function castRay(angle, player, i) {
	const vCollision = getVCollision(angle, player, i)
	const hCollision = getHCollision(angle, player, i)
	return hCollision.distance > vCollision.distance ? vCollision : hCollision
}

function renderScene(rays) {
	const wallImage = new Image()
	wallImage.src =  "./Image/brick-wall-orange-wallpaper-patter_53876-138604.jpg"

	rays.forEach((ray, i) => {
		const distance = fixFishEye(
			ray.distance,
			ray.angle,
			ray.player.direction
		)
		const wallHeight = ((game.cellheight * 5) / distance) * 277
		ctx.fillStyle = ray.vertical
			? colors.wall
			: colors.wallDark

		ctx.drawImage(
			wallImage,
			(ray.xOffset)*wallImage.width,
			0,
			1,
			wallImage.height,
			i,
			canvasHeight / 2 - wallHeight / 2,
			canvasWidth / numberOfRays,
			wallHeight
		)

		// ctx.fillRect(
		// 	i,
		// 	canvasHeight / 2 - wallHeight / 2,
		// 	canvasWidth / numberOfRays,
		// 	wallHeight
		// )
		ctx.fillStyle = colors.floor
		ctx.fillRect(
			i,
			canvasHeight / 2 + wallHeight / 2,
			canvasWidth / numberOfRays,
			canvasHeight / 2 - wallHeight / 2
		)
	})
	const gunMan = new Image()
	gunMan.src = "./Image/drunken_duck_soldier_silhouette.svg"
	ctx.fillStyle = colors.player
	if (playerRays[player1.id][0]) {
		const wallHeight =
			((game.cellheight * 5) / playerRays[player1.id][0].distance) * 120
		const playerHeight =
			((game.cellheight * 5) / playerRays[player1.id][0].distance) * 200
		const playerWidth =
			((game.cellWidth * 5) / playerRays[player1.id][0].distance) * 50
		ctx.drawImage(
			gunMan,
			playerRays[player1.id][0].i +
				(playerRays[player1.id][0].player.index * canvasWidth) / 2,
			canvasHeight / 2 - wallHeight / 2,
			playerWidth,
			playerHeight
		)
	}
	if (playerRays[player2.id][0]) {
		const wallHeight =
			((game.cellheight * 5) / playerRays[player2.id][0].distance) * 120
		const playerHeight =
			((game.cellheight * 5) / playerRays[player2.id][0].distance) * 200
		const playerWidth =
			((game.cellWidth * 5) / playerRays[player2.id][0].distance) * 50
		ctx.drawImage(
			gunMan,
			playerRays[player2.id][0].i +
				(playerRays[player2.id][0].player.index * canvasWidth) / 2,
			canvasHeight / 2 - wallHeight / 2,
			playerWidth,
			playerHeight
		)
	}

	const gunImage = new Image()
	gunImage.src = "./Image/gun.png"
	ctx.drawImage(
		gunImage,
		canvasWidth / 4,
		(3 * canvasHeight) / 5,
		canvasWidth / 5,
		canvasWidth / 5
	)
	ctx.drawImage(
		gunImage,
		(3 * canvasWidth) / 4,
		(3 * canvasHeight) / 5,
		canvasWidth / 5,
		canvasWidth / 5
	)
}

function fixFishEye(distance, angle, playerAngle) {
	const diff = angle - playerAngle
	return distance * Math.cos(diff)
}

function getRay() {
	const initialAngle1 = player1.direction - FOV / 2
	const initialAngle2 = player2.direction - FOV / 2
	const angleStep = FOV / numberOfRays
	const rays = []
	for (let i = 0; i < numberOfRays; i++) {
		const angle = initialAngle1 + i * angleStep
		const ray = castRay(angle, player1, i)
		rays.push(ray)
	}
	for (let i = 0; i < numberOfRays; i++) {
		const angle = initialAngle2 + i * angleStep
		const ray = castRay(angle, player2, i)
		rays.push(ray)
	}
	return rays
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight)
}

function connecthandler() {
	for (let i = 0; i < navigator.getGamepads().length; i++) {
		if (game.players[i])
			game.players[i].controllerIndex = navigator.getGamepads()[i].index
	}
}
function disconnecthandler() {
	for (let i = 0; i < navigator.getGamepads().length; i++) {
		if (game.players[i])
			game.players[i].controllerIndex = navigator.getGamepads()[i].index
	}
}

window.addEventListener("gamepadconnected", connecthandler)
window.addEventListener("gamepaddisconnected", disconnecthandler)
document.addEventListener("keydown", movePlayer)
document.addEventListener("keyup", stopPlayer)

function loopGame() {
	clearCanvas()
	playerRays = {
		[player1.id]: [],
		[player2.id]: [],
	}
	const rays = getRay()
	renderScene(rays)
	player1.controlerMove(game)
	game.drawMaze(rays)
	window.requestAnimationFrame(loopGame)
}

window.requestAnimationFrame(loopGame)
