var bgColours = {0: "#cdc1b4", 2: "#eee4da", 4: "#ede0c8", 8: "#f2b179", 16: "#f59563",
                 32: "#f67c5f", 64: "#f65e3b", 128: "#edcf72", 256: "#eecc5f",
                 512: "#edc750", 1024: "#edc440", 2048: "#ecc12e"};

class Cell{
    constructor(size, pos, r, c, g_size, val){
        this.size = size;
        this.pos = pos;
        this.no_cells = g_size;

        this.last_c = this.no_cells - 1;

        this.grid_r = r;
        this.grid_c = c;
        this.val = val;

        this.justMerged = 0;

        // If cell created by merging, stores the two cells merged
        this.madeOf = [null, null];
    }

    show(isTmp){
        noFill();

        let bg = (this.val <= 2048) ? bgColours[this.val] : "#000";

        fill(bg);

        if(isTmp){
            noStroke();
            rect(this.pos.x + 10, this.pos.y + 5, this.size - 10, this.size - 10, 10);
        } else{
            strokeWeight(10);
            stroke(187,173,160);

            rect(this.pos.x, this.pos.y, this.size, this.size, 10);
        }

        //rect(this.pos.x, this.pos.y, this.size, this.size, 10);

        if(this.val != 0){
            //TODO: CENTER THE TEXT
            let fg = (this.val <= 4) ? "#898077" : "#fff";

            strokeWeight(1);
            stroke(fg);
            //noStroke()
            fill(fg);

            textSize(35);
            textAlign(CENTER);

            if(isTmp){
                text(this.val, this.pos.x + 52, this.pos.y + 60);
            } else{
                text(this.val, this.pos.x + 50, this.pos.y + 60);
            }
        }
    }

    // trying to find a way to animate cell movement
    testAnimate(){

    }

    // moves cell according to dir and neighbours in direction dir
    move(dir){
        let movedCell = 1;

        this.justMerged = 0;
        if(this.val == 0) return 0;

        if(dir == "left" && this.grid_c == 0 || dir == "right" && this.grid_c == this.last_c) return 0;
        if(dir == "up" && this.grid_r == 0 || dir == "down" && this.grid_r == this.last_c) return 0;

        let g_i = (dir == "left" || dir == "right") ? this.grid_r : this.grid_c;
        let d = (dir == "left" || dir == "up") ? 1 : 0;

        let srt = (dir == "left" || dir == "right") ? this.grid_c : this.grid_r;
            srt += (d) ? -1 : 1;

        let inc = (d) ? -1 : 1;
        let end_i = (d) ? -1 : this.no_cells;

        let condt = function(i, dir){
            if(dir) return i >= -1;
            else return i <= grid.cell_no;
        };

        let get_c = function(dir, i, g_i){
            if(dir == "left" || dir == "right"){
                return grid.grid[g_i][i];
            } else{
                return grid.grid[i][g_i];
            }
        }

        for(let i = srt; condt(i, d); i += inc){
            if(i == end_i){
                let cell = get_c(dir, end_i - inc, g_i);
                cell.val = this.val;
                this.val = 0;

            } else{
                let n = get_c(dir, i, g_i);
                let n_v = n.val;

                if(n_v == this.val && !n.justMerged){
                    // merge with neighbour
                    n.val += this.val;
                    this.val = 0;
                    player.score += n_v;
                    n.justMerged = true;
                    break;
                } else if(n_v && i != srt){
                    // move cell next to neighbour
                    let cell = get_c(dir, i - inc, g_i);
                    cell.val = this.val;
                    this.val = 0;
                    break;
                } else if(n_v && i == srt){
                    // cell doesn't move
                    movedCell = 0;
                    break;
                }
            }
        }

        return movedCell;
    }
}
