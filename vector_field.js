class VectorField {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.r = 0;
        this.vectors = [];
        this.data = [];
        this.offset_x = random(0, 2*Math.PI);
        this.offset_y = random(0, 2*Math.PI);

        this.init_vectors();
    }
    init_vectors() {
        let col_w = Math.floor(W / this.cols);
        let row_h = Math.floor(H / this.rows);

        this.r = min([col_w, row_h]) / 2;

        let pad_x = (W - this.cols * col_w) / 2;
        let pad_y = (H - this.rows * row_h) / 2;

        let k = 0;
        let x1; let y1; let x2; let y2; let vec = [];
        for (let i = 0; i < this.rows-1; i++) {
            this.vectors[i] = [];
            for (let j = 0; j < this.cols-1; j++) {
                x1 = (j+1)*col_w+pad_x;
                y1 = (i+1)*row_h+pad_y;
                vec = this.get_vec(x1, y1, i, j);
                x2 = vec[0];
                y2 = vec[1];
                this.data[k] = [[x1, y1], this.direction_num([x1, y1], [x2, y2])];
                this.vectors[i][j] = [x1, y1, x2, y2, vec[2]];
                k++;
            }
        }
    }
    get_vec(x, y, i, j) {
        let mx = map(x, 0, W, -1, 1);
        let my = map(y, 0, H, -1, 1);

        let nx = Math.pow(Math.cos(mx+this.offset_x)/mx, 3);
        let ny = Math.pow(Math.sin(my+this.offset_y)/my, 3);

        let fx = map(nx, -1, 1, 0, W);
        let fy = map(ny, -1, 1, 0, H);

        let theta = Math.atan2(fy-y, fx-x);

        let x1 = x+this.r*Math.cos(theta);
        let y1 = y+this.r*Math.sin(theta);

        return [x1, y1, (theta+2*Math.PI)%(2*Math.PI)];
    }
    direction_num(p1, p2) {
        let d = Math.PI/8;
        let omega = (2*Math.PI+Math.atan2(p2[1]-p1[1], p2[0]-p1[0]))%(2*Math.PI);
        
        if ((2*Math.PI-d <= omega && omega <= 2*Math.PI) || (0 <= omega && omega < d)) {
            return [1,0,0,0,0,0,0,0];
        } else if (Math.PI/4-d <= omega && omega < Math.PI/4+d) {
            return [0,1,0,0,0,0,0,0];
        } else if (Math.PI/2-d <= omega && omega < Math.PI/2+d) {
            return [0,0,1,0,0,0,0,0];
        } else if (3*Math.PI/4-d <= omega && omega < 3*Math.PI/4+d) {
            return [0,0,0,1,0,0,0,0];
        } else if (Math.PI-d <= omega && omega < Math.PI+d) {
            return [0,0,0,0,1,0,0,0];
        } else if (5*Math.PI/4-d <= omega && omega < 5*Math.PI/4+d) {
            return [0,0,0,0,0,1,0,0];
        } else if (3*Math.PI/2-d <= omega && omega < 3*Math.PI/2+d) {
            return [0,0,0,0,0,0,1,0];
        } else {
            return [0,0,0,0,0,0,0,1];
        }
    }
    show() {
        colorMode(HSB, 2*Math.PI, 1, 1);
        strokeWeight(0.7);
        let x1; let y1; let x2; let y2;
        for (let i = 0; i < this.vectors.length; i++) {
            for (let j = 0; j < this.vectors[i].length; j++) {
                stroke(this.vectors[i][j][4], 1, 1);
                fill(this.vectors[i][j][4], 1, 1);
                x1 = this.vectors[i][j][0];
                y1 = this.vectors[i][j][1];
                x2 = this.vectors[i][j][2];
                y2 = this.vectors[i][j][3];
                ellipse(this.vectors[i][j][2], this.vectors[i][j][3], 3);
                line(x1, y1, x2, y2);
            }
        }
    }
}