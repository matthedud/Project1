function outOfBounds(x, y) {
	return (
		x < 0 || x >= game.grid2D[0].length || y < 0 || y >= game.grid2D.length
	)
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function getVCollision(angle, player) {
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
		wall = game.grid2D[cellY][cellX]
		if (!wall) {
			nextX += xStep
			nextY += yStep
		}
	}
	return {
		angle,
		distance: distance(player.xPosition, player.yPosition, nextX, nextY),
		vertical: true,
		player,
		xOffset: (nextY % game.cellheight) / game.cellheight,
	}
}

function getHCollision(angle, player) {
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
		wall = game.grid2D[cellY][cellX]
		if (!wall) {
			nextX += xStep
			nextY += yStep
		}
	}
	return {
		angle,
		distance: distance(player.xPosition, player.yPosition, nextX, nextY),
		xOffset: (nextX % game.cellheight) / game.cellheight,
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
	wallImage.src =
		"./Image/brick-wall-orange-wallpaper-patter_53876-138604.jpg"
	// wallImage.src = "./Image/WM_BrickWork-50_1024/WM_BrickWork-50_1024.png"
	rays.forEach((ray, i) => {
		const distance = fixFishEye(
			ray.distance,
			ray.angle,
			ray.player.direction
		)
		const wallHeight = ((game.cellheight * 5) / distance) * 277
		ctx.fillStyle = ray.vertical ? colors.wall : colors.wallDark

		// ctx.drawImage(
		// 	wallImage,
		// 	ray.xOffset * wallImage.width,
		// 	0,
		// 	1,
		// 	wallImage.height,
		// 	(i * canvasWidth) / numberOfRays / 2,
		// 	canvasHeight / 2 - wallHeight / 2,
		// 	canvasWidth / numberOfRays,
		// 	wallHeight
		// )
		ctx.fillRect(
			((i / 2) * canvasWidth) / numberOfRays,
			canvasHeight / 2 - wallHeight / 2,
			canvasWidth / numberOfRays,
			wallHeight
		)

		// const floorImage = new Image()
		// floorImage.src =
		// 	"./Image/FloorTreadPattern-3v2_UR_1024/FloorTreadPattern-3v2_UR_1024.png"

		// ctx.drawImage(
		// 	floorImage,
		// 	(ray.xOffset)*floorImage.width,
		// 	0,
		// 	1,
		// 	floorImage.height,
		// 	i,
		// 	canvasHeight / 2 + wallHeight / 2,
		// 	canvasWidth / numberOfRays,
		// 	canvasHeight / 2 - wallHeight / 2
		// )
		ctx.fillStyle = colors.floor
		ctx.fillRect(
			((i / 2) * canvasWidth) / numberOfRays,
			canvasHeight / 2 + wallHeight / 2,
			canvasWidth / numberOfRays,
			canvasHeight / 2 - wallHeight / 2
		)
	})

	ctx.fillStyle = "black"
	ctx.fillRect(canvasWidth / 2 - 3, 0, 6, canvasHeight)

	const gunMan = new Image()
	gunMan.src = "./Image/drunken_duck_soldier_silhouette.svg"

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

function getRay(player) {
	const initialAngle = player.direction - FOV / 2
	const angleStep = FOV / numberOfRays
	const rays = []
	for (let i = 0; i < numberOfRays; i++) {
		const angle = initialAngle + i * angleStep
		const ray = castRay(angle, player, i)
		rays.push(ray)
	}
	return rays
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight)
}
