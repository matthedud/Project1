const parentEl = document.getElementById("game")
const settingsButton = document.getElementById("btn-settings")
const cancelButton = document.getElementById("btn-cl")
const startButton = document.getElementById("btn-start")
const form = document.getElementById("modal")
const canvasHeight = 500
const canvasWidth = 1000
// const canvasWidth = Math.floor(window.innerWidth*0.5 - 20)
// const canvasHeight = Math.floor(window.innerHeight*0.5 - 120)
let numberOfRays = canvasWidth / 2
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
document.addEventListener("keydown", keyDownlistener)
document.addEventListener("keyup", keyUpListener)
settingsButton.addEventListener("click", showSettings)
cancelButton.addEventListener("click", hideSettings)
form.addEventListener("submit", startGame)

function showSettings() {
	pauseGame = true
	form.classList.add("visible")
}
function hideSettings(e) {
	e.preventDefault()
	pauseGame = false
	form.classList.remove("visible")
	if (game) game.runGameLoop()
}

function startGame(event) {
	hideSettings(event)
	event.preventDefault()

	const map = maze[event.target[3].value]
	switch (event.target[0].value) {
		case "1":
			game = new Shooter(map)
			break
		case "2":
			game = new Tag(map)
			break
		case "3":
			game = new MegaShooter(map)
			break
	}
	let randomCoord = game.randomPlacement()
	const player1 = new Player(
		event.target[1].value,
		randomCoord.x,
		randomCoord.y,
		Math.random() * 2 * Math.PI,
		randomColor(),
		game.players.length
	)

	randomCoord = game.randomPlacement()
	game.players.push(player1)
	const player2 = new Player(
		event.target[2].value,
		randomCoord.x,
		randomCoord.y,
		Math.random() * 2 * Math.PI,
		randomColor(),
		game.players.length
	)
	game.players.push(player2)

	game.runGameLoop()
	// numberOfRays = event.target[4].value > 2000 ? 2000 : event.target[4].value
}

function keyDownlistener(event) {
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

function keyUpListener(event) {
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

function connecthandler() {
	for (let i = 0; i < navigator.getGamepads().length; i++) {
		if (game.players[i])
			game.players[i].controllerIndex = navigator.getGamepads()[i].index
		else{
			const newCoord = game.randomPlacement()
			const newPlayer = new Player (
				`player${game.players.length+1}`,
				newCoord.x,
				newCoord.y,
				Math.random() * 2 * Math.PI,
				randomColor(),
				game.players.length
			)
			game.players.push(newPlayer)
		}	
	}
}
function disconnecthandler() {
	for (let i = 0; i < navigator.getGamepads().length; i++) {
		if (game.players[i])
			game.players[i].controllerIndex = navigator.getGamepads()[i].index
	}
}

function randomColor(){
	return "#"+ Math.floor(Math.random()*16777215).toString(16)
}