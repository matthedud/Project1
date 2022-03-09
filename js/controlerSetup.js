function createPlayerEl(id) {
	const newPlayerEl = document.createElement("div")
	newPlayerEl.classList.add("icon")
	newPlayerEl.classList.add("player")
	newPlayerEl.setAttribute("id", id)
	return newPlayerEl
}

function createControllerEl(id) {
	const newControllerEl = document.createElement("div")
	newControllerEl.classList.add("icon")
	newControllerEl.classList.add("controler")
	newControllerEl.setAttribute("draggable", true)
	newControllerEl.setAttribute("id", id)
	// newPlayerEl.addEventListener('dragEnd')
	return newControllerEl
}

function createKeyboardEl(id) {
	const newKeyboardEl = document.createElement("div")
	newKeyboardEl.classList.add("icon")
	newKeyboardEl.classList.add("keyboard")
	newKeyboardEl.setAttribute("draggable", true)
	newKeyboardEl.setAttribute("id", id)
	// newPlayerEl.addEventListener('dragEnd')
	return newKeyboardEl
}

function setController() {
    const controlerContainer = document.getElementById("controller-liste")
	const playerContainer = document.getElementById("player-liste")
	const controlerList = navigator.getGamepads().filter((el) => el)
	for (const player of playerListe) {
		const newPlayerEl = createPlayerEl(player.id)
		if (player.controller){
            const index = controlerList.findIndex(el=>el.id===player.controller.id)
            if(index>-1){
                newPlayerEl.appendChild(createControllerEl(player.controller.id))
                controlerList.splice(index, 1)
            }
            else player.controller=null
        }
		if (player.keyboard){
            newPlayerEl.appendChild(createKeyboardEl(player.keyboard))
        }
        playerContainer.appendChild(newPlayerEl)
	}
	for (const controler of controlerList) {
		const newControllerEl = createControllerEl(controler.id)
        playerContainer.appendChild(newControllerEl)
	}
}