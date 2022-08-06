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

        let nx = Math.pow(Math.cos(mx+y*this.offset_x/W)/mx, -3);
        let ny = Math.pow(Math.tan(my+x*this.offset_y/H)/my, -1);

        let fx = map(nx, -1, 1, 0, W);
        let fy = map(ny, -1, 1, 0, H);

        let theta = Math.atan2(fy-y, fx-x);

        let x1 = x+this.r*Math.cos(theta);
        let y1 = y+this.r*Math.sin(theta);

        return [x1, y1, (theta+2*Math.PI)%(2*Math.PI)];
    }
    direction_num(p1, p2) {
        let d = Math.PI/NUM_OF_ANGLES;
        let omega = (2*Math.PI+Math.atan2(p2[1]-p1[1], p2[0]-p1[0]))%(2*Math.PI);

        let theta = 2*Math.PI / NUM_OF_ANGLES;
        let angle_vec = [];

        for (let i = 0; i < NUM_OF_ANGLES; i++) {
            angle_vec[i] = 0;
        }

        for (let i = 0; i < NUM_OF_ANGLES-1; i++) {
            if (i*theta <= omega && omega < (i+1)*theta) {
                angle_vec[i] = 1;
                return angle_vec;
            }
        }
        if ((NUM_OF_ANGLES-1)*theta < omega && omega < 2*Math.PI) {
            angle_vec[NUM_OF_ANGLES-1] = 1;
            return angle_vec;
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