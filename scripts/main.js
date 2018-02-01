var grid, player;
var wh = window.innerWidth;
var cell_no = 4;
var cell_size = wh / cell_no;

var scoreText;

var touch = {s: {x: 0, y: 0}, e: {x: 0, y: 0}};

function setup(){
    createCanvas(420, 420);

    translate(10, 10);

    player = {score: 0, prev_score: 0};

    scoreText = document.getElementById("score");

    grid = new Grid(wh, cell_no, cell_size);

    // grid.grid[0][0].val = 512;
    // grid.grid[1][0].val = 1024;
    // grid.grid[2][0].val = 2048;
    // grid.grid[3][0].val = 4096;

    //grid.grid[2][0].val = 8;
    //grid.grid[0][2].val = 2;
    //grid.grid[0][3].val = 2;

    grid.init();
}

function draw(){
    background(255);

    fill(205,193,180);
    strokeWeight(10);
    stroke(187,173,160);
    rect(10, 10, wh, wh, 10);

    scoreText.innerHTML = "Score: " + player.score;

    // textSize(20);
    // noStroke();
    // fill(255);
    // textAlign(LEFT);
    // text("Score: " + player.score, 20, 450);

    grid.show();

    if(grid.movingCell){
        grid.tmpCell.show(1);
    }

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

    grid.updateCells(d);
}
