function outOfBounds(x, y) {
	return (
		x < 0 || x >= game.grid2D[0].length || y < 0 || y >= game.grid2D.length
	)
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function getVCollision(angle, player, playerCoord) {
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
	let playerRay
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
		wall = game.grid2D[cellY][cellX]
		if (!wall) {
			nextX += xStep
			nextY += yStep
		}
	}
	const wallDistance = distance(
		player.xPosition,
		player.yPosition,
		nextX,
		nextY
	)
	playerRay = addPlayerRay(playerCoord, angle, wallDistance)
	return {
		angle,
		distance: wallDistance,
		vertical: true,
		player,
		imageOffset: (nextY % game.cellheight) / game.cellheight,
		playerRay,
	}
}

function getHCollision(angle, player, playerCoord) {
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
	let playerRay
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
			nextX += xStep
			nextY += yStep
		}
	}
	const wallDistance = distance(
		player.xPosition,
		player.yPosition,
		nextX,
		nextY
	)
	playerRay = addPlayerRay(playerCoord, angle, wallDistance)
	return {
		angle,
		distance: wallDistance,
		imageOffset: (nextX % game.cellheight) / game.cellheight,
		vertical: false,
		player,
		playerRay,
	}
}

function addPlayerRay(playerCoordList, angle, wallDistance){
	const playerCoord = playerCoordList[0]
	if (
		playerCoord &&
		angle > playerCoord?.initialAngle &&
		angle < playerCoord?.endAngle &&
		playerCoord?.distance < wallDistance
	) {
		const imageOffset = (angle - playerCoord.initialAngle)/(playerCoord.endAngle-playerCoord.initialAngle)
		return  {...playerCoord, imageOffset}
}
}

function castRay(angle, player, playerCoord) {
	const vCollision = getVCollision(angle, player, playerCoord)
	const hCollision = getHCollision(angle, player, playerCoord)
	return hCollision.distance > vCollision.distance ? vCollision : hCollision
}

function renderScene(rays) {
	const wallImage = new Image()
	// wallImage.src =
		// "./Image/wall/brick-wall-orange-wallpaper-patter_53876-138604.jpg"
	// wallImage.src = "./Image/wall/pics/greystone.png"
	wallImage.src = "./Image/wall/WM_BrickWork-50_1024.png"

	const skyImage = new Image()
	skyImage.src = "./Image/back/panorama_landscapes_175.jpg"
	const floorImage = new Image()
	floorImage.src = "./Image/back/WM_Marble-125_1024.png"
	// '../Image/back/panorama_landscapes_175.jpg'
	
	const gunMan = new Image()
	// gunMan.src = "./Image/player/stability_officer_sheet_palette.png"
	gunMan.src = "./Image/player/cowboy.gif"
	
	ctx.drawImage(
		skyImage,
		game.players[0].direction/(2*Math.PI) * wallImage.width,
		0,
		wallImage.width * FOV/(2*Math.PI),
		wallImage.height,
		0,
		0,
		canvasWidth/2,
		canvasHeight/2
	)
	// ctx.drawImage(
	// 	floorImage,
	// 	game.players[0].direction/(2*Math.PI) * floorImage.width,
	// 	0,
	// 	floorImage.width * FOV/(2*Math.PI),
	// 	floorImage.height,
	// 	0,
	// 	canvasHeight/2,
	// 	canvasWidth/2,
	// 	canvasHeight
	// )
	ctx.drawImage(
		skyImage,
		game.players[1].direction/(2*Math.PI) * wallImage.width,
		0,
		wallImage.width * FOV/(2*Math.PI),
		wallImage.height,
		canvasWidth/2,
		0,
		canvasWidth,
		canvasHeight/2
	)


	rays.forEach((ray, i) => {
		const distance = fixFishEye(
			ray.distance,
			ray.angle,
			ray.player.direction
		)
		const wallHeight = ((game.cellheight * 5) / distance) * 277

		ctx.drawImage(
			wallImage,
			ray.imageOffset * wallImage.width,
			0,
			1,
			wallImage.height,
			(i * canvasWidth) / numberOfRays / 2,
			canvasHeight / 2 - wallHeight / 2,
			canvasWidth / numberOfRays,
			wallHeight
		)


		ctx.fillStyle = colors.floor
		ctx.fillRect(
			((i / 2) * canvasWidth) / numberOfRays,
			canvasHeight / 2 + wallHeight / 2,
			canvasWidth / numberOfRays,
			canvasHeight / 2 - wallHeight / 2
		)
		ctx.fillStyle = "black"

		if (ray.playerRay) {
			const x = ray.playerRay.imageOffset * gunMan.width
			ctx.drawImage(
				gunMan,
				x,
				0,
				1,
				gunMan.height,
				(i * canvasWidth) / numberOfRays / 2,
				canvasHeight / 2 - ray.playerRay.height / 5,
				canvasWidth / numberOfRays,
				ray.playerRay.height
			)
		}
	})

	ctx.fillStyle = "black"
	ctx.fillRect(
		canvasWidth / 2 - 3,
		canvasHeight * game.scale,
		6,
		canvasHeight
	)


	for(const player of game.players){
		ctx.drawImage(
			player.gunImage,
			player.gunImageIndex,
			50,
			100,
			200,
			(canvasWidth / 4) - 50 + player.index * (2 * canvasWidth) / 4,
			(3 * canvasHeight) / 5,
			canvasWidth / 5,
			canvasWidth / 3
		)
	}

}

function fixFishEye(distance, angle, playerToPlayerAngle) {
	const diff = angle - playerToPlayerAngle
	return distance * Math.cos(diff)
}

function getRay(playerLooking, playerSeen) {
	const playerCoords = getPlayerPosition(playerLooking, playerSeen)
	const initialAngle = playerLooking.direction - FOV / 2
	const angleStep = FOV / numberOfRays
	const rays = []
	for (let i = 0; i < numberOfRays; i++) {
		const angle = initialAngle + i * angleStep
		const ray = castRay(angle, playerLooking, playerCoords)
		rays.push(ray)
	}
	return rays
}

function getPlayerToPlayerAngle(playerLooking, playerSeen) {
	const tanAngle = Math.atan2(
		playerSeen.yPosition - playerLooking.yPosition,
		playerSeen.xPosition - playerLooking.xPosition
	)
	const playerToPlayerAngle = tanAngle + Math.PI * 2 * (tanAngle<0)
	return playerToPlayerAngle
}

function getPlayerPosition(playerLooking, playerSeenList) {
	const playerDirection = playerLooking.direction
	const result = []
	for(const playerSeen of playerSeenList){
		const playerDistance = distance(
			playerLooking.xPosition,
			playerLooking.yPosition,
			playerSeen.xPosition,
			playerSeen.yPosition
		)
		const playerToPlayerAngle = getPlayerToPlayerAngle(
			playerLooking,
			playerSeen
		)
		if (
			playerToPlayerAngle > playerDirection - FOV / 2 &&
			playerToPlayerAngle < playerDirection + FOV / 2
		) {
			const playerWidth = (playerSize * 150) / playerDistance
			const playerHeight = ((playerSize * 9) / playerDistance) * 277
			const viewAngle = Math.atan(playerWidth / 2 / playerDistance)
			const initialAngle = playerToPlayerAngle - viewAngle / 2
			const endAngle = playerToPlayerAngle + viewAngle / 2
			result.push( {
				initialAngle,
				endAngle,
				distance: playerDistance,
				height: playerHeight,
				width: playerWidth,
				player:playerSeen,
			})
		}
	}
	return result
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight)
}
