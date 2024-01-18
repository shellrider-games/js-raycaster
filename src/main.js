const gameData = {
    inputMap : {
        left: false,
        right: false,
        up: false,
        down: false,
        rot_left: false,
        rot_right: false,
    }
}

const clampToLevel = (pos, level) => {
    return {
        x: Math.min(Math.max(pos.x, 1.5),level.width-1.5),
        y: Math.min(Math.max(pos.y, 1.5),level.heigth-1.5)
    }
}

const inputVector = (inputMap) => {
    let x = inputMap.right - inputMap.left;
    let y = inputMap.down - inputMap.up;
    if(x != 0 || y != 0) {
        let len = Math.sqrt(x*x + y*y);
        x = x/len;
        y = y/len;
    }
    return {
        x: x,
        y: y
    };
}

const rotationVector = (inputMap) => {
    return inputMap.rot_right - inputMap.rot_left;
}

const getLevel = (w,h, strategy) => {
    const tiles = new Array(w*h).fill(0).map((_,idx) => {
        let x = idx % w;
        let y = Math.floor(idx/w);
        return strategy(x,y,w,h);
    });

    return {
        width: w,
        heigth: h,
        tiles: tiles
    };
}

const getCamera = (x, y, canvas) => {
    return {
        x: x,
        y: y,
        dir: 0,
        w: canvas.width,
        h: canvas.height,
        fov: 1.23,
        farClip: 20
    };
}

const distanceToWall = (x, y, angle, level, maxDistance, step) => {
    let rayX = x;
    let rayY = y;
    const rayVec = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    for(let d = 0; d < maxDistance; d += step){
        rayX += Math.cos(angle) * step;

        if(rayX < 0 || rayX > level.width || rayY < 0 || rayY > level.heigth){
            return undefined;
        }
        if(level.tiles[Math.floor(rayX) + level.width * Math.floor(rayY)] > 0) {
            return { 
                distance: d,
                horizontal: true
            };
        }
        rayY += Math.sin(angle) * step;

        if(rayX < 0 || rayX > level.width || rayY < 0 || rayY > level.heigth){
            return undefined;
        }
        if(level.tiles[Math.floor(rayX) + level.width * Math.floor(rayY)] > 0) {
            return { 
                distance: d,
                horizontal: false
            };
        }
    }
    return undefined;
}

const clearCanvas = (cam, ctx) => {
    ctx.clearRect(0,0, cam.w, cam.h);
}

const drawFloorAndCeiling = (cam, ctx) => {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0,0, cam.w, cam.h/2);
    ctx.fillStyle = '#888888';
    ctx.fillRect(0,cam.h/2, cam.w, cam.h/2);
}

const update = (timestamp) => {
    let delta = timestamp - gameData.lastTimestamp;
    let movSpeed = 0.004;
    let rotSpeed = 0.008;
    gameData.lastTimestamp = timestamp;
    let rot = rotationVector(gameData.inputMap);
    
    gameData.cam.dir = (gameData.cam.dir + (rot * rotSpeed * delta)) % (2*Math.PI);

    let vec = {
        x: (Math.cos(gameData.cam.dir) * inputVector(gameData.inputMap).x - Math.sin(gameData.cam.dir) * inputVector(gameData.inputMap).y),
        y: (Math.sin(gameData.cam.dir) * inputVector(gameData.inputMap).x + Math.cos(gameData.cam.dir) * inputVector(gameData.inputMap).y)
    };

    console.log(vec);

    const nextPosition = clampToLevel({
        x: gameData.cam.x + vec.x * movSpeed * delta,
        y: gameData.cam.y + vec.y * movSpeed * delta
    }, gameData.level);

    gameData.cam.x = nextPosition.x;
    gameData.cam.y = nextPosition.y;

    drawLevel(gameData.level, gameData.cam, gameData.ctx);

    requestAnimationFrame(update);
}

const drawLevel = (level, cam, ctx) => {
    drawFloorAndCeiling(cam, ctx);
    const fovPerColumn = cam.fov/cam.w;
    const dir = cam.dir - (Math.PI/2);
    for(let x = 0; x < cam.w; x++){
        const rayAngle = dir+x*fovPerColumn-cam.fov/2;
        const hit = distanceToWall(cam.x, cam.y, rayAngle, level, cam.farClip, 0.1)
        if(!hit) { continue; }
        const distance = hit.distance;

        let correctedDistance = distance * Math.cos(rayAngle - dir);
        const lineHeight = cam.h/correctedDistance;
        const startY = Math.max(0, Math.floor(cam.h / 2 - lineHeight / 2));
        const endY = Math.min(cam.h, Math.floor(cam.h / 2 + lineHeight / 2));

        ctx.fillStyle = hit.horizontal ? '#0000FF' : '#0000BB';

        ctx.fillRect(x, startY, 1, endY - startY);
    }
}

const edgeTileStrategy = (x,y,w,h) => {
    return (x === 0 || x === w - 1 || y === 0 || y === h - 1) ? 1 : 0;
}

const startGame = () => {
    gameData.canvas = document.getElementById('canvas');
    gameData.ctx = canvas.getContext('2d');
    gameData.level = getLevel(16,12,edgeTileStrategy);
    gameData.cam = getCamera(12,10, canvas);
    gameData.lastTimestamp = 0;
    requestAnimationFrame(update);
}

window.onload = () => {
    console.log("Window loaded, starting game.");
    startGame();
}

addEventListener("keydown", (ev) => {
    switch(ev.key) {
        case "ArrowDown":
            gameData.inputMap.down = true;
            break;
        case "ArrowUp":
            gameData.inputMap.up = true;
            break;
        case "ArrowLeft":
            gameData.inputMap.left = true;
            break;
        case "ArrowRight":
            gameData.inputMap.right = true;
            break;
        case "a":
            gameData.inputMap.rot_left = true;
            break;
        case "d":
            gameData.inputMap.rot_right = true;
            break;
        default:
            return
    }
});

addEventListener("keyup", (ev) => {
    switch(ev.key) {
        case "ArrowDown":
            gameData.inputMap.down = false;
            break;
        case "ArrowUp":
            gameData.inputMap.up = false;
            break;
        case "ArrowLeft":
            gameData.inputMap.left = false;
            break;
        case "ArrowRight":
            gameData.inputMap.right = false;
            break;
        case "a":
            gameData.inputMap.rot_left = false;
            break;
        case "d":
            gameData.inputMap.rot_right = false;
            break;
        
        default:
            return
    }
});