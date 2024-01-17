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
        w: canvas.width,
        h: canvas.heigth,
        fov: 1.23, // about 70 deg
        farClip: 20
    };
}

const distanceToWall = (x, y, angle, level, maxDistance, step) => {
    let rayX = x;
    let rayY = y;
    for(let d = 0; d < maxDistance; d += step){
        rayX += Math.cos(angle) * step;
        rayY += Math.sin(angle) * step;
        if(rayX < 0 || rayX > level.width || rayY < 0 || rayY > level.heigth){
            return undefined;
        }
        if(level.tiles[Math.floor(rayX) + level.width * Math.floor(rayY)] > 0) {
            return d;
        }
    }
    return undefined;
}

const drawLevel = (level, cam, ctx) => {
    const fovPerColumn = cam.fov/cam.w;
    for(let x = 0; x < cam.w; x++){
        let dir = 0;
        const rayAngle = dir+x*fovPerColumn-cam.fov/2;
        let distance = castRay(cam.x, cam.y, rayAngle, level, cam.farClip, 0.1);
    }
}

const edgeTileStrategy = (x,y,w,h) => {
    return (x === 0 || x === w - 1 || y === 0 || y === h - 1) ? 1 : 0;
}

const startGame = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let level = getLevel(16,12,edgeTileStrategy);
    const cam = getCamera(7,5);
    drawLevel(level, cam, ctx);
}

window.onload = () => {
    console.log("Window loaded, starting game.");
    startGame();
}