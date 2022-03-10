const parentEl = document.getElementById("game")
const settingsButton = document.getElementById("btn-settings")
const controllerButton = document.getElementById("btn-controlers")
const cancelButton = document.getElementById("btn-cl")
const startButton = document.getElementById("btn-start")
const closeControllerButton = document.getElementById("btn-close")
const form = document.getElementById("form")
const controlerSetup = document.getElementById("controler-setup")
const clockEl = document.getElementById('clock')
const canvasHeight = 500
const canvasWidth = 1000
// const canvasWidth = window.innerWidth > 2000?2000: Math.floor(window.innerWidth - 40)
// const canvasHeight = Math.floor(window.innerHeight - 120)
let numberOfRays = canvasWidth / 2
let pauseGame = true
const keyboards = [new KeyBoard("K1"), new KeyBoard("K2")]

const backgroundMusic = new Audio('./Audio/Astrix & Avalon - Moonshine.mp3');
backgroundMusic.loop

const canvas = document.createElement("canvas")
canvas.height = canvasHeight
canvas.width = canvasWidth
let game = null
const ctx = canvas.getContext("2d")

parentEl.appendChild(canvas)

const colors = {
	floor: "rgb(126, 126, 126)",
	wall: "#013aa6",
	wallDark: "#012975",
	rays: "#ffa600",
	minimapFloor: "rgba(88, 88, 252, 0.5)",
	minimapWall: "rgba(0, 0, 0, 0.80)",
	bullet: "black",
	player: "purple",
}


window.addEventListener("gamepadconnected", showController)
window.addEventListener("gamepaddisconnected", showController)

settingsButton.addEventListener("click", showSettings)
controllerButton.addEventListener("click", showController)
cancelButton.addEventListener("click", hideSettings)
closeControllerButton.addEventListener("click", hideController)
form.addEventListener("submit", startGame)

function showSettings() {
	game?.pauseGame()
	controllerButton.disabled = true
	form.classList.add("visible")
}
function showController() {
	if(game){
		game?.pauseGame()
		controlerSetup.classList.add("visible")
		settingsButton.disabled = true
		setController()
	}
}
function hideController() {
	settingsButton.disabled = false
	controlerSetup.classList.remove("visible")
	if (game){
		game.chronometer.start(clockEl)
		game.runGameLoop()
	} 
}
function hideSettings(e) {
	if(e?.preventDefault) e.preventDefault()
	controllerButton.disabled = false
	form.classList.remove("visible")
	if (game){
		game.chronometer.start(clockEl)
		game.runGameLoop()
	} 
}

function startGame(event) {
	event.preventDefault()
	hideSettings(event)
	backgroundMusic.play();
	controllerButton.disabled = false
	const map = maze[event.target[3].value]
	const players = game?.players ? game.players : []
	game?.pauseGame()
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
	if (players.length <1) {
		let randomCoord = game.randomPlacement()
		const player1 = new Player(
			event.target[1].value,
			randomCoord.x,
			randomCoord.y,
			Math.random() * 2 * Math.PI,
			randomColor(),
			players.length,
			'cat',
			)

			player1.controller = keyboards[0]
		
			randomCoord = game.randomPlacement()
			players.push(player1)
			const player2 = new Player(
				event.target[2].value,
				randomCoord.x,
				randomCoord.y,
				Math.random() * 2 * Math.PI,
				randomColor(),
				players.length,
			)
			player2.controller = keyboards[1]
			players.push(player2)
	}
	game.frameRate = event.target[5].value < 1 ? 1 : Number(event.target[5].value)
	game.players = players
	game.runGameLoop()
	game.chronometer.start(clockEl)
	numberOfRays = event.target[4].value > 2000 ? 2000 : Number(event.target[4].value)
}

function randomColor(){
	return "#"+ Math.floor(Math.random()*16777215).toString(16)
}