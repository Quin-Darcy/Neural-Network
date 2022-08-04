class Circles {
    constructor(m, n) {
        this.num_of_circles = m;
        this.points_per_circle = n;
        this.num_of_points = m*n;
        this.theta = 2*Math.PI / n;
        this.data = [];
        this.circles = [];

        this.init_circles();
        this.get_labels();
    }
    init_circles() {
        for (let i = 0; i < this.num_of_circles; i++) {
            let x = random(0, W); let y = random(0, H); 
            let r = random(3, Math.sqrt(W*W/4+H*H/4));
            this.circles[i] = [];
            for (let j = 0; j < this.points_per_circle; j++) {
                this.circles[i][j] = [x+r*Math.cos(j*this.theta), y+r*Math.sin(j*this.theta)];
            }
        }
    }
    get_labels() {
        let k = 0; let label;
        for (let i = 0; i < this.num_of_circles; i++) {
            for (let j = 0; j < this.points_per_circle-1; j++) {
                label = this.direction_num(this.circles[i][j], this.circles[i][j+1]);
                this.data[k] = [this.circles[i][j], label];
                k++;
            }
            label = this.direction_num(this.circles[i][this.points_per_circle-1], this.circles[i][0]);
            this.data[k] = [this.circles[i][this.points_per_circle-1], label];
            k++;
        }
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
        colorMode(HSB, this.num_of_circles, 1, 1);
        noStroke();
        textSize(10);
        let k = 0;
        for (let i = 0; i < this.num_of_circles; i++) {
            fill(i, 1, 1);
            for (let j = 0; j < this.points_per_circle; j++) {
                text(this.data[k][1].indexOf(1), this.data[k][0][0], this.data[k][0][1]);
                k++;
            }
        }
    }
}