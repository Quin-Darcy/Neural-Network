class NeuralNet {
    constructor(layer_data) {
        this.neurons_per_layer = layer_data;
        this.num_of_layers = layer_data.length;

        this.layers = [];
        this.init_layers(layer_data);
    }
    init_layers() {        
        for (let i = 0; i < this.num_of_layers; i++) {
            if (i == 0) {
                this.layers[i] = new Layer(this.neurons_per_layer[i], 0);
            } else {
                this.layers[i] = new Layer(this.neurons_per_layer[i], this.neurons_per_layer[i-1]);
            }
        }
    }
    feed_forward(input) {
        if (input.length != this.neurons_per_layer[0]) {
            console.log("INVALID INPUT. CANNOT FEED FORWARD.")
            return 0;
        }
        
        for (let i = 0; i < this.neurons_per_layer[0]; i++) {
            this.layers[0].neurons[i].activation = input[i];    
        }

        for (let i = 1; i < this.num_of_layers; i++) {
            this.layers[i].activate_neurons(this.layers[i-1]);
        }
    }
    back_prop(input, exp_out) {
        let pred = this.get_output();
        let L = this.num_of_layers-1; // last layer index
        
        for (let i = 0; i < this.neurons_per_layer[L]; i++) {
            this.layers[L].neurons[i].delta = (pred[i]-exp_out[i])*this.layers[L].neurons[i].afd();
        }

        for (let i = L-1; i > 0; i--) {
            this.layers[i].update_deltas(this.layers[i+1]);
        }
    }
    set_nablas() {
        for (let i = 1; i < this.num_of_layers; i++) {
            this.layers[i].set_nablas(this.layers[i-1]);
        }
    }
    update(coeff) {
        for (let i = 0; i < this.num_of_layers; i++) {
            this.layers[i].update(coeff);
        }
    }
    get_cost(data_set) {
        let sum = 0; 
        for (let i = 0; i < data_set.length; i++) {
            this.feed_forward(data_set[i][0]);
            sum += this.get_dist(data_set[i][1], this.get_output());
        }
        return sum/data_set.length;
    }
    get_output() {
        let output = [];
        for (let i = 0; i < this.neurons_per_layer[this.num_of_layers-1]; i++) {
            output[i] = this.layers[this.num_of_layers-1].neurons[i].activation;
        }
        return output;
    }
    get_dist(v, w) {
        let sum = 0;
        for (let i = 0; i < v.length; i++) {
            sum += Math.pow(v[i]-w[i], 2);
        }
        return sum;
    }
    train(data_set, eta) {
        let m = data_set.length;

        for (let i = 0; i < m; i++) {
            this.feed_forward(data_set[i][0]);
            this.back_prop(data_set[i][0], data_set[i][1]);
            this.set_nablas();
        }
        this.update(eta/m);
    }
    show_network() {
        console.log("Layer Structure:", this.neurons_per_layer);
        for (let i = 1; i < this.num_of_layers; i++) {
            console.log("-------------------------------------------------------------------");
            console.log("Layer:", i);
            this.layers[i].show_layer();
        }
    }
}