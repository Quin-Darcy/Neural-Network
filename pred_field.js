class PredField {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.r = 0;
        this.vectors = [];

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
                vec = this.get_vec(x1, y1);
                x2 = vec[0];
                y2 = vec[1];

                this.vectors[i][j] = [x1, y1, x2, y2, vec[2]];
                k++;
            }
        }
    }
    get_vec(x, y) {
        net.feed_forward([x, y]);
        let pred = net.get_output();
        let new_vec = this.get_d(pred, [x, y]);
        
        let fx = new_vec[0]
        let fy = new_vec[1];

        let theta = Math.atan2(fy-y, fx-x);

        let x1 = x+this.r*Math.cos(theta);
        let y1 = y+this.r*Math.sin(theta);

        return [x1, y1, (theta+2*Math.PI)%(2*Math.PI)];
    }
    get_d(arr, p) {
        let index = arr.indexOf(max(arr));
        let new_p = [];
    
        switch(index) {
            case 0:
                new_p = [p[0]+2, p[1]];
                break;
            case 1:
                new_p = [p[0]+2, p[1]+2];
                break;
            case 2:
                new_p = [p[0], p[1]+2];
                break;
            case 3:
                new_p = [p[0]-2, p[1]+2];
                break;
            case 4:
                new_p = [p[0]-2, p[1]];
                break;
            case 5:
                new_p = [p[0]-2, p[1]-2];
                break;
            case 6:
                new_p = [p[0], p[1]-2];
                break;
            case 7:
                new_p = [p[0]+2, p[1]-2];
                break;
        }
    
        if (new_p[0] <= 0) {
            new_p[0] = 0;
        }
        if (W <= new_p[0]) {
            new_p[0] = W;
        }
        if (new_p[1] <= 0) {
            new_p[1] = 0;
        }
        if (H <= new_p[1]) {
            new_p[1] = H;
        }
    
        return new_p;
    }
    show() {
        colorMode(HSB, 2*Math.PI, 1, 1)
        strokeWeight(0.7)
        let x1; let y1; let x2; let y2;
        for (let i = 0; i < this.vectors.length; i++) {
            for (let j = 0; j < this.vectors[i].length; j++) {
                fill(this.vectors[i][j][4], 1, 1);
                stroke(this.vectors[i][j][4], 1, 1);
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