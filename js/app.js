const parentEl = document.getElementById("game")
const settingsButton = document.getElementById("btn-settings")
const controllerButton = document.getElementById("btn-controlers")
const cancelButton = document.getElementById("btn-cl")
const startButton = document.getElementById("btn-start")
const closeControllerButton = document.getElementById("btn-close")
const form = document.getElementById("form")
const controlerSetup = document.getElementById("controler-setup")
const canvasHeight = 500
const canvasWidth = 1000
// const canvasWidth = window.innerWidth > 2000?2000: Math.floor(window.innerWidth - 40)
// const canvasHeight = Math.floor(window.innerHeight - 120)
let numberOfRays = canvasWidth / 2
let pauseGame = true
const keyboards = [new KeyBoard("K1"), new KeyBoard("K2")]

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

window.addEventListener("gamepadconnected", showController)
window.addEventListener("gamepaddisconnected", disconnecthandler)
document.addEventListener("keydown", keyDownlistener)
document.addEventListener("keyup", keyUpListener)
settingsButton.addEventListener("click", showSettings)
controllerButton.addEventListener("click", showController)
cancelButton.addEventListener("click", hideSettings)
closeControllerButton.addEventListener("click", hideController)
form.addEventListener("submit", startGame)

function showSettings() {
	pauseGame = true
	form.classList.add("visible")
}
function showController() {
	if(game){
		pauseGame = true
		controlerSetup.classList.add("visible")
		setController()
	}
}
function hideController() {
	pauseGame = false
	controlerSetup.classList.remove("visible")
	if (game) game.runGameLoop()
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
	controllerButton.disabled = false
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
		game.players.length,
		'cat',
	)
	player1.controller = keyboards[0]

	randomCoord = game.randomPlacement()
	game.players.push(player1)
	const player2 = new Player(
		event.target[2].value,
		randomCoord.x,
		randomCoord.y,
		Math.random() * 2 * Math.PI,
		randomColor(),
		game.players.length,
	)
	player2.controller = keyboards[1]
	game.players.push(player2)

	game.runGameLoop()
	numberOfRays = event.target[4].value > 2000 ? 2000 : event.target[4].value
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
		console.log('navigator.getGamepads()[i]',navigator.getGamepads()[i]);
		if (navigator.getGamepads()[i]){
			if (game.players[i+1])
				game.players[i+1].controller = {
					index: navigator.getGamepads()[i].index,
					id : navigator.getGamepads()[i].id
				}
			else if (game.type === 'megaShooter'){
				const newCoord = game.randomPlacement()
				const newPlayer = new Player (
					`player${game.players.length+1}`,
					newCoord.x,
					newCoord.y,
					Math.random() * 2 * Math.PI,
					randomColor(),
					game.players.length
				)
				newPlayer.controller = {
					index: navigator.getGamepads()[i].index,
					id : navigator.getGamepads()[i].id
				}
				game.players.push(newPlayer)
			}	
		}
	}
}
function disconnecthandler(event) {
	console.log(event.gamepad)
	for (let i = 0; i < navigator.getGamepads().length; i++) {
		if (game.players[i])
			game.players[i].controllerIndex = navigator.getGamepads()[i].index
	}
}

function randomColor(){
	return "#"+ Math.floor(Math.random()*16777215).toString(16)
}