let W = window.innerWidth;
let H = window.innerHeight;

let F;
let P;
let net;
let data;
let field = 1;
let seed = [];
let costs = [];
let ROWS = 30;
let COLS = 30;
let layer_data = []
let EPOCHS = 100;
let LEARNING_RATE = 0.009;

let op_costs = [];
let op_layers = [];

function setup() {
    createCanvas(W, H);
    background(0);

    layer_data = get_layers(2, 8);
    net = new NeuralNet(layer_data);
    F = new VectorField(COLS, ROWS);
    data = F.data

    stochastic_grad_desc(LEARNING_RATE, 1);
    P = new PredField(COLS, ROWS);
}

function draw() {
    background(0);
    stochastic_grad_desc(LEARNING_RATE, 1);
    
    if (field == 0) {
        F.show();
    } else if (field == 1) {
        P.show();
    } 
}

function keyPressed() {
    if (keyCode == 70) {
        field = 0;
    } else if (keyCode == 80) {
        field = 1;
    } else if (keyCode == 67) {
        field = 2;
    }
}

function stochastic_grad_desc(lr, eps) {
    console.log(net.get_cost(data));
    for (let i = 0; i < eps; i++) {
        let index_arr = [];
        let mini_batch = [];
        let rand_index = 0;
        let batch_size = Math.floor(random(data.length/8, data.length/2));

        costs[i] = net.get_cost(data);
        for (let j = 0; j < batch_size; j++) {
            rand_index = Math.floor(random(0, data.length));
            mini_batch[j] = data[rand_index];
        }
        net.train(mini_batch, lr);
        
        //console.log("EPOCH:", i, "| BATCHSIZE:", batch_size, "| COST:", net.get_cost(data));
    }
    P = new PredField(COLS, ROWS);
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
    let num_hidden_layers = 2//Math.floor(random(2, 10));

    for (let i = 1; i < num_hidden_layers+1; i++) {
        vals[i] = Math.floor(random(6, 100));
    }
    vals.push(outs);

    return vals;
}

function get_dir(arr, p) {
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