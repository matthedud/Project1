const parentEl = document.getElementById("game")
const settingsButton = document.getElementById("btn-settings")
const cancelButton = document.getElementById("btn-cl")
const startButton = document.getElementById("btn-start")
const form = document.getElementById("modal")
// const canvasHeight = 500
// const canvasWidth = 1000
const canvasWidth = window.innerWidth  - 10
const canvasHeight = window.innerHeight - 130
const numberOfRays = 300
let pauseGame = true


let playerRays = {}
const canvas = document.createElement("canvas")
canvas.height = canvasHeight
canvas.width = canvasWidth
let game
const ctx = canvas.getContext("2d")

parentEl.appendChild(canvas)

const colors = {
	floor: "rgb(64, 64, 77)",
	wall: "#013aa6",
	wallDark: "#012975",
	rays: "#ffa600",
	minimapFloor: "rgba(88, 88, 252, 0.3)",
	minimapWall: "rgba(0, 0, 146, 0.657)",
	bullet: "black",
	player: "purple",
}

window.addEventListener("gamepadconnected", connecthandler)
window.addEventListener("gamepaddisconnected", disconnecthandler)
document.addEventListener("keydown", movePlayer)
document.addEventListener("keyup", stopPlayer)
settingsButton.addEventListener("click", showSettings)
cancelButton.addEventListener("click", hideSettings)
form.addEventListener("submit", startGame)

function loopGame() {
	clearCanvas()
	playerRays = {
		[game.players[0].id]: [],
		[game.players[1].id]: [],
	}
	const rays = getRay()
	renderScene(rays)
	game.players[0].controlerMove(game)
	game.drawMaze(rays)
	if (!pauseGame) window.requestAnimationFrame(loopGame)
}

function showSettings() {
	pauseGame = true
	form.classList.add("visible")
}
function hideSettings(e) {
	e.preventDefault()
	pauseGame = false
	form.classList.remove("visible")
}
function startGame(event) {
	event.preventDefault()
	const player1 = new Player(
		event.target[0].value,
		190,
		100,
		Math.PI,
		"pink",
		0
	)
	const player2 = new Player(event.target[1].value, 50, 100, 0, "red", 1)
	game = new Shooter(maze[event.target[2].value], [player1, player2])
	window.requestAnimationFrame(loopGame)
	hideSettings(event)
}

function movePlayer(event) {
	if (!pauseGame) {
		if (event.key === "ArrowRight" || event.key === "ArrowLeft")
			game.players[0].setRotate(event.key, game)
		if (event.key === "ArrowUp" || event.key === "ArrowDown") {
			game.players[0].setMove(event.key, game)
		}
		if (event.key === "z" || event.key === "s") {
			game.players[1].setMove(event.key, game)
		}
		if (event.key === "q" || event.key === "d") {
			game.players[1].setRotate(event.key, game)
		}
		if (event.key === "a") {
			game.shoot(game.players[1])
		}
		if (event.key === ":") {
			game.shoot(game.players[0])
		}
	}
}

function stopPlayer(event) {
	if (!pauseGame) {
		if (event.key === "ArrowRight" || event.key === "ArrowLeft")
			game.players[0].resetRotate(event.key, game)
		if (event.key === "ArrowUp" || event.key === "ArrowDown") {
			game.players[0].resetMove(event.key, game)
		}
		if (event.key === "z" || event.key === "s") {
			game.players[1].resetMove(event.key, game)
		}
		if (event.key === "q" || event.key === "d") {
			game.players[1].resetRotate(event.key, game)
		}
	}
}

function fixFishEye(distance, angle, playerAngle) {
	const diff = angle - playerAngle
	return distance * Math.cos(diff)
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
