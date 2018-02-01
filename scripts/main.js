var grid, player;
var wh = 400;
var cell_no = 4;
var cell_size = wh / cell_no;

var scoreText;

var touch = {s: {x: 0, y: 0}, e: {x: 0, y: 0}};

var wonTimerInterval;
var winScreenOpacity = 0;

function setup(){
    let title = "<h1 id='title'>2048 Clone</h1>"

    createCanvas(420, 420);

    document.body.insertAdjacentHTML("beforeend", title);

    translate(10, 10);

    player = {score: 0, prev_score: 0, won: 0, };

    scoreText = document.getElementById("score");

    grid = new Grid(wh, cell_no, cell_size);

    // grid.grid[0][0].val = 512;
    // grid.grid[1][0].val = 1024;
    // grid.grid[2][0].val = 2048;
    // grid.grid[3][0].val = 4096;

    grid.grid[2][3].val = 8;
    //grid.grid[0][2].val = 2;
    //grid.grid[0][3].val = 2;

    grid.init();
}

function draw(){
    background("#fbf8f1");

    fill(205,193,180);
    strokeWeight(10);
    stroke(187,173,160);
    rect(10, 10, wh, wh, 10);

    grid.show();

    scoreText.innerHTML = "Score: " + player.score;

    if(player.won == 1){
        player.won += 1;
        player.wonTimer = 100;

        wonTimerInterval = setInterval(function(){
            if(winScreenOpacity <= 200){
                winScreenOpacity += 7;
                return 0;
            }

            if(player.wonTimer == 0){
                clearInterval(wonTimerInterval);
                winScreenOpacity = 0;
            } else{
                player.wonTimer -= 1;
            }
        }, 5);
    }

    if(player.wonTimer) winScreen("Winner!");
}

function winScreen(txt){
    stroke(211,183,102, winScreenOpacity);
    fill(211,183,102, winScreenOpacity);
    rect(10, 10, wh, wh, 10);

    if(winScreenOpacity != 200){
        stroke(255, 255, 255, winScreenOpacity);
        fill(255, 255, 255, winScreenOpacity);
    } else{
        stroke(255);
        fill(255);
    }

    strokeWeight(1);
    textAlign(CENTER);
    text("You Win!", 207, 222);
}

function keyPressed(){
    // grid.testAnimate("top", 3, 0, 1, 2);
    //
    // return false;

    if(grid.movingCell) return -1;

    switch(keyCode){
        case LEFT_ARROW:
            grid.updateCells("left");
            break;
        case RIGHT_ARROW:
            grid.updateCells("right");
            break;
        case UP_ARROW:
            grid.updateCells("up");
            break;
        case DOWN_ARROW:
            grid.updateCells("down");
            break;
        case 90:
            grid.undoMove();
        default:
            break;
    }

    return false;
}

function touchStarted(){
    touch.s = {x: mouseX, y: mouseY};
}

function touchEnded(){
    touch.e = {x: mouseX, y: mouseY};

    let errorCorrection = 50;

    // left and right swipes
    // takes into account a swipe wont be completly straight
    if(touch.e.y > touch.s.y - errorCorrection && touch.e.y < touch.s.y + errorCorrection){
        d = (touch.e.x > touch.s.x) ? "right" : "left";
    } else{
        d = (touch.e.y > touch.s.y) ? "down" : "up";
    }

    //grid.updateCells(d);
}
