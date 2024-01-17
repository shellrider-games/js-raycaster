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

const drawLevel = (level, ctx) => {
    let tileSize = 16;
    ctx.fillStyle = "blue";
    level.tiles.forEach((val, idx) => {
        if(val > 0) {
            let x = idx % level.width;
            let y = Math.floor(idx/level.width);
            ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize);
        }
    })
}

const edgeTileStrategy = (x,y,w,h) => {
    return (x === 0 || x === w - 1 || y === 0 || y === h - 1) ? 1 : 0;
}

const startGame = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let level = getLevel(16,12,edgeTileStrategy);
    drawLevel(level,ctx);
}

window.onload = () => {
    console.log("Window loaded, starting game.");
    startGame();
}