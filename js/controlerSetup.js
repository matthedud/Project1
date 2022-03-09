let dragSrcEl = null
function handleDragStart(e) {
	this.style.opacity = "0.4"
	dragSrcEl = this
}
function handleDragEnd(e) {
	this.style.opacity = "1"
}
function handleDragEnter(e) {
	this.classList.add("over")
}
function handleDragOver(e) {
	e.preventDefault()
}
function handleDragLeave(e) {
	this.classList.remove("over")
}

function handleDrop(event) {
	event.preventDefault()
	if (event.target.className.includes("player-container")) {
		if (event.target.childElementCount > 1) {
			const controlerContainer =
				document.getElementById("controller-liste")
			controlerContainer.appendChild(event.target.lastChild)
		}
		event.target.appendChild(dragSrcEl)
		const targetPlayer = game.players.find(
			(el) => el.id.toString() === event.target.id
		)
		if (dragSrcEl.id[0] === "K")
			targetPlayer.controller = keyboards.find(
				(el) => el.id === dragSrcEl.id
			)
		else {
			targetPlayer.controller = navigator.getGamepads()[dragSrcEl.id]
		}
	}
	if (event.target.id.includes("controller-liste")) {
		const targetPlayer = game.players.find(el=>el.id.toString()===dragSrcEl.parentNode.id)
		targetPlayer.controller=null
		event.target.appendChild(dragSrcEl)
	}
	return false
}

function createIconEl(id) {
	const newIconEl = document.createElement("div")
	newIconEl.classList.add("icon")
	newIconEl.setAttribute("id", id)
	return newIconEl
}

function createPlayerEl(id) {
	const newPlayerEl = document.createElement("div")
	const newIconEl = createIconEl(id)
	newIconEl.classList.add("player")
	newPlayerEl.appendChild(newIconEl)
	newPlayerEl.setAttribute("id", id)
	newPlayerEl.classList.add("player-container")
	newPlayerEl.addEventListener("dragover", handleDragOver)
	newPlayerEl.addEventListener("drop", handleDrop)
	newPlayerEl.addEventListener("dragleave", handleDragLeave)
	newPlayerEl.addEventListener("dragenter", handleDragEnter)
	return newPlayerEl
}

function createControllerEl(id) {
	const newControllerEl = createIconEl(id)
	newControllerEl.classList.add("controler")
	newControllerEl.setAttribute("draggable", true)
	newControllerEl.addEventListener("dragstart", handleDragStart)
	newControllerEl.addEventListener("dragend", handleDragEnd)
	return newControllerEl
}

function createKeyboardEl(id) {
	const newKeyboardEl = createControllerEl(id)
	newKeyboardEl.classList.replace("controler", "keyboard")
	return newKeyboardEl
}

function createAddButton(playerContainer) {
	const newButton = document.createElement("button")
	newButton.textContent = "Add Player"
	newButton.addEventListener("click", () => addPlayer(playerContainer))
	playerContainer.appendChild(newButton)
}

function addPlayer(playerContainer) {
	const randomCoord = game.randomPlacement()
	const newplayer = new Player(
		"P" + game.players.length,
		randomCoord.x,
		randomCoord.y,
		Math.random() * 2 * Math.PI,
		randomColor(),
		game.players.length
	)
	game.players.push(newplayer)
	const newPlayerEl = createPlayerEl(newplayer.id)
	playerContainer.appendChild(newPlayerEl)
}

function setController() {
	const controlerContainer = document.getElementById("controller-liste")
	const playerContainer = document.getElementById("player-liste")
	controlerContainer.innerHTML = ""
	playerContainer.innerHTML = ""
	if (game.type !== "shooter") createAddButton(playerContainer)
	controlerContainer.addEventListener("dragover", handleDragOver)
	controlerContainer.addEventListener("drop", handleDrop)
	controlerContainer.addEventListener("dragleave", handleDragLeave)
	controlerContainer.addEventListener("dragenter", handleDragEnter)

	const controlerList = navigator.getGamepads().filter((el) => el)
	const keyboardList = [...keyboards]

	for (const player of game.players) {
		const newPlayerEl = createPlayerEl(player.id)
		if (player.controller) {
			if (
				player.controller.id === "K1" ||
				player.controller.id === "K2"
			) {
				newPlayerEl.appendChild(createKeyboardEl(player.controller.id))
				keyboardList.splice(keyboardList.findIndex(el=>el===player.controller.id), 1)
			} else {
				const index = controlerList.findIndex(
					(el) => el.id === player.controller.id
				)
				if (index > -1) {
					newPlayerEl.appendChild(
						createControllerEl(player.controller.index)
					)
					controlerList.splice(index, 1)
				} else player.controller = null
			}
		}
		playerContainer.appendChild(newPlayerEl)
	}
	for (const controler of controlerList) {
		const newControllerEl = createControllerEl(controler.index)
		controlerContainer.appendChild(newControllerEl)
	}
	for (const keyboard of keyboardList) {
		const newKeybordEl = createKeyboardEl(keyboard.id)
		controlerContainer.appendChild(newKeybordEl)
	}
}
