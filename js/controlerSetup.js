let dragSrcEl = null

function handleDragStart(e) {
	this.style.opacity = "0.4"
	dragSrcEl = this
	e.dataTransfer.setData("Text", e.target.id)
	e.dataTransfer.effectAllowed = "move"
}
function handleDragEnd(e) {
	this.style.opacity = "1"
}
function handleDragEnter(e) {
	this.classList.add("over")
}
function handleDragOver(e) {
	e.preventDefault();
}
function handleDragLeave(e) {
	this.classList.remove("over")
}

function handleDrop(event) {
	event.preventDefault()
	console.log('dropevent', event);
	event.target.appendChild(dragSrcEl)
    return false;
  }


function createIcon(id) {
	const newIconEl = document.createElement("div")
	newIconEl.classList.add("icon")
	newIconEl.setAttribute("id", id)
	newIconEl.addEventListener("dragleave", handleDragLeave)
	newIconEl.addEventListener("dragenter", handleDragEnter)
	newIconEl.addEventListener("dragover",handleDragOver );
	newIconEl.addEventListener("drop", handleDrop)
	return newIconEl
}

function createPlayerEl(id) {
	const newPlayerEl = createIcon(id)
	newPlayerEl.classList.add("player")
	return newPlayerEl
}

function createControllerEl(id) {
	const newControllerEl = createIcon(id)
	newControllerEl.classList.add("controler")
	newControllerEl.setAttribute("draggable", true)
	newControllerEl.addEventListener("dragstart", handleDragStart)
	newControllerEl.addEventListener("dragend", handleDragEnd)
	return newControllerEl
}

function createKeyboardEl(id) {
	const newKeyboardEl = document.createElement("div")
	newKeyboardEl.classList.add("icon")
	newKeyboardEl.classList.add("keyboard")
	newKeyboardEl.setAttribute("draggable", true)
	newKeyboardEl.setAttribute("id", id)
	return newKeyboardEl
}

function setController() {
	const controlerContainer = document.getElementById("controller-liste")
	const playerContainer = document.getElementById("player-liste")
	controlerContainer.innerHTML = ""
	playerContainer.innerHTML = ""
	const controlerList = navigator.getGamepads().filter((el) => el)

	controlerContainer.appendChild(createControllerEl(1))
	playerContainer.appendChild(createPlayerEl(1))

	for (const player of playerListe) {
		const newPlayerEl = createPlayerEl(player.id)
		if (player.controller) {
			const index = controlerList.findIndex(
				(el) => el.id === player.controller.id
			)
			if (index > -1) {
				newPlayerEl.appendChild(
					createControllerEl(player.controller.id)
				)
				controlerList.splice(index, 1)
			} else player.controller = null
		}
		if (player.keyboard) {
			newPlayerEl.appendChild(createKeyboardEl(player.keyboard))
		}
		playerContainer.appendChild(newPlayerEl)
	}
	for (const controler of controlerList) {
		const newControllerEl = createControllerEl(controler.id)
		controlerContainer.appendChild(newControllerEl)
	}
}
