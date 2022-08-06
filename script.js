let W = window.innerWidth;
let H = window.innerHeight;

let F;
let P;
let net;
let data;
let field = 1;
let costs = [];
let ROWS = 40;
let COLS = 40;
let PRED_COLS = 20;
let PRED_ROWS = 20;
let layer_data = []
let EPOCHS = 5;
let LEARNING_RATE = 0.02;
let NUM_OF_ANGLES = 16;

let seeds = [];
let MAX_SEEDS = 1000;

function setup() {
    createCanvas(W, H);
    background(0);

    layer_data = get_layers(2, NUM_OF_ANGLES);
    net = new NeuralNet(layer_data);
    F = new VectorField(COLS, ROWS);
    data = F.data

    P = new PredField(COLS, ROWS);

    //colorMode(HSB, 2*Math.PI, 1, 1);
}

function draw() {
    background(0);
    noStroke()
    fill(255)
    text(net.get_cost(data), W/32, H/55);

    
    if (field == 0) {
        F.show();
    } else if (field == 1) {
        P.show();
    }

    /*
    if (seeds.length > 0) {
        for (let i = 0; i < seeds.length; i++) {
            stroke(0);
            let theta = get_theta(seeds[i], get_dir(net.get_output(), seeds[i]));
            fill(theta, 1, 1);
            ellipse(seeds[i][0], seeds[i][1], 5);
            net.feed_forward(seeds[i]);
            seeds[i] = get_dir(net.get_output(), seeds[i]);
        }
    }*/
    
    stochastic_grad_desc(LEARNING_RATE, EPOCHS);
}

function get_theta(v, w) {
    let theta = Math.atan2(w[1]-v[1], w[0]-v[0]);
    return (theta+2*Math.PI)%(2*Math.PI);
}

function mouseDragged() {
    if (seeds.length >= 40) {
        seeds.shift();
    }
    seeds.push([mouseX, mouseY]);
}

function stochastic_grad_desc(learning_rate, epochs) {
    //console.log(net.get_cost(data));
    for (let i = 0; i < epochs; i++) {
        let index_arr = [];
        let mini_batch = [];
        let rand_index = 0;
        let batch_size = Math.floor(data.length/2, data.length/2);

        for (let j = 0; j < batch_size; j++) {
            rand_index = Math.floor(random(0, data.length));
            mini_batch[j] = data[rand_index];
        }
        net.train(mini_batch, learning_rate);
    }
    P = new PredField(PRED_COLS, PRED_ROWS);
}

function get_layers(ins, outs) {
    let vals = [ins];
    let num_hidden_layers = 2;

    for (let i = 1; i < num_hidden_layers+1; i++) {
        vals[i] = Math.floor(random(12, 110));
    }
    vals.push(outs);

    return vals;
}

function show_costs() {
    let x; let y;
    fill(0, 110, 215);
    for (let i = 0; i < EPOCHS; i++) {
        x = (i+1)*W/(EPOCHS+1);
        y = map(costs[i], 0, max(costs), H, 0);
        ellipse(x, y, 5);
    }
}

function get_dir(arr, p) {
    let index = arr.indexOf(max(arr));
    let new_p = [];
    let r = 2;//min([W/COLS, H/ROWS]) / 2;

    let theta = 2*Math.PI/NUM_OF_ANGLES;
    let delta_x = r*Math.cos(index*theta);
    let delta_y = r*Math.sin(index*theta);

    new_p = [p[0]+delta_x, p[1]+delta_y];

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

function keyPressed() {
    if (keyCode == 70) {
        field = 0;
    } else if (keyCode == 80) {
        field = 1;
    } else if (keyCode == 67) {
        background(0)
        seeds = []
    }
}

function doubleClicked() {
    noLoop();
}