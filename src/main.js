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
        h: canvas.height,
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
    ctx.fillStyle = '#555555';
    ctx.fillRect(0,0, cam.w, cam.h/2);
    ctx.fillStyle = '#888888';
    ctx.fillRect(0,cam.h/2, cam.w, cam.h/2);
    ctx.fillStyle = 'blue';
    const fovPerColumn = cam.fov/cam.w;
    for(let x = 0; x < cam.w; x++){
        let dir = Math.PI/10;
        const rayAngle = dir+x*fovPerColumn-cam.fov/2;
        const distance = distanceToWall(cam.x, cam.y, rayAngle, level, cam.farClip, 0.05);
        if(!distance) { continue; }
        let correctedDistance = distance * Math.cos(rayAngle - dir);
        const lineHeight = cam.h/correctedDistance;
        const startY = Math.max(0, Math.floor(cam.h / 2 - lineHeight / 2));
        const endY = Math.min(cam.h, Math.floor(cam.h / 2 + lineHeight / 2));
        ctx.fillRect(x, startY, 1, endY - startY);
    }
}

const edgeTileStrategy = (x,y,w,h) => {
    return (x === 0 || x === w - 1 || y === 0 || y === h - 1) ? 1 : 0;
}

const startGame = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let level = getLevel(16,12,edgeTileStrategy);
    const cam = getCamera(12,10, canvas);
    drawLevel(level, cam, ctx);
}

window.onload = () => {
    console.log("Window loaded, starting game.");
    startGame();
}