const startGame = () => {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'blue';
    ctx.fillRect((canvas.width - 50) * 0.5, (canvas.height-50) * 0.5, 50, 50)
}

window.onload = () => {
    console.log("Window loaded, starting game.");
    startGame();
}