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
        player = {score: 0, prev_score: 0, won: 0, lost: 0};
        clear(lostInterval);

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

    lostTest(){
        let d = ["left", "right", "up", "down"];
        let moved = 0;

        for(let i = 0; i < d.length; i++){
            let m = this.updateCells(d[i], true);

            if(m){
                moved = 1;
                break;
            }
        }

        if(!moved){
            player.lost += 1;
        }
    }

    insertNewValue(){
        let vals = [2, 4];
        let emptyCells = this._getEmptyCells();

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

    updateCells(dir, lostTest){
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

        if(!lostTest){
            this.prev_grid = _.cloneDeep(this.grid);
            player.prev_score = player.score;
        }

        let cellsMoved = 0;

        for(let r = srt; loop_check(r, this.cell_no, d); r += inc){
            for(let c = srt; loop_check(c, this.cell_no, d); c += inc){
                cellsMoved += this.grid[r][c].move(dir, lostTest);
            }
        }

        if(cellsMoved && !lostTest) this.insertNewValue();

        if(lostTest) return cellsMoved;
    }

    undoMove(){
        if(!this.prev_grid) return 0;
        this.grid = _.cloneDeep(this.prev_grid);
        this.prev_grid = null;
        player.score = player.prev_score;
    }
}
