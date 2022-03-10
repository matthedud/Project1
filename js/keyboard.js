class KeyBoard {
    constructor(id){
        this.id=id
        this.up=false
        this.down=false
        this.turnRight=false
        this.turnLeft=false
        this.shoot=false
    }
    resetKeyboard(){
        this.up=false
        this.down=false
        this.turnRight=false
        this.turnLeft=false
        this.shoot=false
    }
}

document.addEventListener("keydown", keyDownlistener)
document.addEventListener("keyup", keyUpListener)

function keyDownlistener(event) {
	if (game?.gameInterval) {
		if (event.key === "ArrowRight" ) keyboards[0].turnRight = true
        if (event.key === "ArrowLeft") keyboards[0].turnLeft = true
		if (event.key === "ArrowUp")  keyboards[0].up = true
        if (event.key === "ArrowDown") keyboards[0].down = true
        if (event.key === ":") keyboards[0].shoot = true

		if (event.key === "d") keyboards[1].turnRight = true
        if (event.key === "q") keyboards[1].turnLeft = true
		if (event.key === "z") keyboards[1].up = true
        if (event.key === "s") keyboards[1].down = true 
        if (event.key === "a") keyboards[1].shoot = true

        // 
	}
    if (event.key === "Escape") form.className.includes('visible') ?  hideSettings():showSettings()
}

function keyUpListener(event) {
        if (event.key === "ArrowRight" ) keyboards[0].turnRight = false
        if (event.key === "ArrowLeft") keyboards[0].turnLeft = false
		if (event.key === "ArrowUp")  keyboards[0].up = false
        if (event.key === "ArrowDown") keyboards[0].down = false
        if (event.key === ":") keyboards[0].shoot = false

		if (event.key === "d") keyboards[1].turnRight = false
        if (event.key === "q") keyboards[1].turnLeft = false
		if (event.key === "z") keyboards[1].up = false
        if (event.key === "s") keyboards[1].down = false 
        if (event.key === "a") keyboards[1].shoot = false
}
