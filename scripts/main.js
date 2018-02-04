var grid, player;
var wh = 400;
var cell_no = 4;
var cell_size = wh / cell_no;

var scoreText;

var touch = {s: {x: 0, y: 0}, e: {x: 0, y: 0}};

var wonTimerInterval;
var winScreenOpacity = 0;

var lostScreenOpacity = 0;
var lostInterval;

function setup(){
    let title = "<h1 id='title'>2048 Clone</h1>"

    createCanvas(420, 420);

    document.body.insertAdjacentHTML("beforeend", title);

    translate(10, 10);

    player = {score: 0, prev_score: 0, won: 0, lost: 0};

    scoreText = document.getElementById("score");

    grid = new Grid(wh, cell_no, cell_size);

    //grid.init();
    grid.insertNewValue();
}

function draw(){
    background("#fbf8f1");

    fill(205,193,180);
    strokeWeight(10);
    stroke(187,173,160);
    rect(10, 10, wh, wh, 10);

    grid.show();

    scoreText.innerHTML = "Score: " + player.score;

    if(player.lost == 1){
        lostScreenOpacity = 0;

        lostInterval = setInterval(function(){
            if(lostScreenOpacity <= 200){
                lostScreenOpacity += 7;
            }
        }, 5)

        player.lost += 1

    } else if(!player.lost){
        grid.lostTest();
    } else{
        winLostScreen(lostScreenOpacity, "Game Over!")
    }

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

    if(player.wonTimer) winLostScreen(winScreenOpacity, "You Win!");
}

function winLostScreen(o, txt){
    stroke(211,183,102, o);
    fill(211,183,102, o);
    rect(10, 10, wh, wh, 10);

    if(o <= 200){
        stroke(255, 255, 255, o);
        fill(255, 255, 255, o);
    } else{
        stroke(255);
        fill(255);
    }

    strokeWeight(1);
    textAlign(CENTER);
    text(txt, 207, 222);
}

function keyPressed(){
    return 0;
    if(player.lost) return 0;

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
