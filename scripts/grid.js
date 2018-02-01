class Grid{
    constructor(wh, cell_no, cell_size){
        this.wh = wh;
        this.cell_no = cell_no;
        this.cell_size = cell_size;

        this.grid = [];
        this.prev_grid = null;
        this.prev_score = null;

        this.movingCell = false;
        this.tmpCell = null;
        this.targCell = null;
        this.intervalID = null;

        for(let r = 0, y = 0; r < this.cell_no; r += 1, y += this.cell_size){
            var row = [];

            for(let c = 0, x = 0; c < this.cell_no; c += 1, x += this.cell_size){
                row.push(new Cell(this.cell_size, createVector(x + 10, y + 10), r, c, this.cell_no, 0));
            }

            this.grid.push(row);
        }
    }

    // clears and sets to random cells as starting values
    init(){
        player.score = 0;
        player.prev_score = 0;

        this.prev_grid = null;

        for(let r = 0; r < this.cell_no; r += 1){
            for(let c = 0; c < this.cell_no; c += 1){
                this.grid[r][c].val = 0;
            }
        }

        let i = 0
        while(i != 2){
            let r = floor(random(this.cell_no));
            let c = floor(random(this.cell_no));

            let g = this.grid[r][c];

            if(g.val != 0) continue

            g.val = 2;
            i += 1
        }
    }

    testAnimate(dir, r, c, tr, tc){
        var cur_c = this.grid[r][c];
        this.tmpCell = _.cloneDeep(cur_c);


        this.targCell = this.grid[tr][tc];

        cur_c.val = 0;

        this.movingCell = true;

        if(dir == "left" || dir == "right"){
            this.intervalID = setInterval(function(){
                let tmp = function(dir){
                    if(dir == "left") return grid.tmpCell.pos.x > grid.targCell.pos.x + 1;
                    else return grid.tmpCell.pos.x < grid.targCell.pos.x - 1;
                }

                if(tmp(dir)){
                    grid.tmpCell.pos.x += (dir == "left") ? -5 : 5;
                } else{
                    grid.tmpCell.pos.x = grid.targCell.pos.x;

                    grid.targCell.val += grid.tmpCell.val;

                    grid.movingCell = false;
                    grid.tmpCell = null;

                    clearInterval(grid.intervalID);
                    console.log("finished");
                }
            }, 10);
        } else{
            this.intervalID = setInterval(function(){
                let tmp = function(dir){
                    if(dir == "top") return grid.tmpCell.pos.y > grid.targCell.pos.y + 1;
                    else return grid.tmpCell.pos.y < grid.targCell.pos.y - 1;
                }

                if(tmp(dir)){
                    grid.tmpCell.pos.y += (dir == "top") ? -5 : 5;
                } else{
                    grid.tmpCell.pos.y = grid.targCell.pos.y;

                    grid.targCell.val += grid.tmpCell.val;

                    grid.movingCell = false;
                    grid.tmpCell = null;

                    clearInterval(grid.intervalID);
                    console.log("finished");
                }
            }, 10);
        }
    }

    insertNewValue(){
        let vals = [2, 4];
        let emptyCells = this._getEmptyCells();

        if(!emptyCells.length){
            console.log("Invalid Move.");
            return -1;
        }

        let i = floor(random(emptyCells.length));
        let cr = emptyCells[i];

        let v = vals[floor(random(2))];

        player.score += (v == 2) ? 0 : 4;

        grid.grid[cr[0]][cr[1]].val = v;
    }

    _getEmptyCells(){
        let cells = []
        for(let r = 0; r < this.cell_no; r += 1){
            for(let c = 0; c < this.cell_no; c += 1){
                let g = this.grid[r][c];
                if(g.val == 0) cells.push([r, c]);
            }
        }

        return cells;
    }

    show(){
        for(let r = 0; r < this.cell_no; r += 1){
            for(let c = 0; c < this.cell_no; c += 1){
                this.grid[r][c].show();
            }
        }
    }

    updateCells(dir){
        //TODO: Make cells move ALL way  to left, right, etc. not just move
        //      by one cell

        var srt, inc, d;

        if(dir == "left" || dir == "up"){
            srt = 0;
            inc = 1;
            d = 1;
        } else{
            srt = this.cell_no - 1;
            inc = -1;
            d = 0;
        }

        var loop_check = function(x, n, d){
            return d ? x < n : x >= 0;
        }

        this.prev_grid = _.cloneDeep(this.grid);
        player.prev_score = player.score;

        let cellsMoved = 0;

        for(let r = srt; loop_check(r, this.cell_no, d); r += inc){
            for(let c = srt; loop_check(c, this.cell_no, d); c += inc){
                cellsMoved += this.grid[r][c].move(dir);
            }
        }

        if(cellsMoved) this.insertNewValue();
    }

    undoMove(){
        if(!this.prev_grid) return 0;
        this.grid = _.cloneDeep(this.prev_grid);
        this.prev_grid = null;
        player.score = player.prev_score;
    }
}
