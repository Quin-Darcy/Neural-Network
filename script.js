let W = window.innerWidth;
let H = window.innerHeight;

let net;
let costs = [];
let EPOCHS = 1000;
let data;
let seeds = [];
let NUM_CIRCLES = 10;
let POINTS_PER_CIRCLE = 500;

function setup() {
    createCanvas(W, H);
    background(0);

    let layer_data = get_layers(2, 8);
    net = new NeuralNet(layer_data);
    data = new Circles(NUM_CIRCLES, POINTS_PER_CIRCLE).data;
    console.log(layer_data)

    for (let i = 0; i < EPOCHS; i++) {
        let index_arr = [];
        let mini_batch = [];
        let rand_index = 0;
        let batch_size = Math.floor(random(data.length/4, data.length));

        costs[i] = net.get_cost(data);
        for (let j = 0; j < batch_size; j++) {
            rand_index = Math.floor(random(0, data.length));
            mini_batch[j] = data[rand_index];
        }
        net.train(mini_batch, 0.0098);
    }
}

function draw() {
    //background(0);
    //circle_set.show();
    colorMode(HSB, 100, 1, 1);
    if (seeds.length > 0) {
        for (let i = 0; i < seeds.length; i++) {
            fill(i%100, 1, 1)
            seed = seeds[i];
            ellipse(seed[0], seed[1], 5);
            net.feed_forward(seed);
            seeds[i] = get_dir(net.get_output(), seed);
        }
    }
    //show_costs();
}

function mouseDragged() {
    //background(0)
    if (seeds.length < 1000) {
        seeds.push([mouseX, mouseY]);
    } else {
        seeds.shift();
    }
}

function doubleClicked() {
    noLoop();
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

function get_layers(ins, outs) {
    let vals = [ins];
    let num_hidden_layers = Math.floor(random(1, 6));

    for (let i = 1; i < num_hidden_layers+1; i++) {
        vals[i] = Math.floor(random(2, 2*max([ins, outs])));
    }
    vals.push(outs);

    return vals;
}

function get_dir(arr, p) {
    let index = (arr.indexOf(max(arr)) - 1)%arr.length;
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