class Neuron {
    constructor(num_of_weights) {
        this.num_of_weights = num_of_weights;

        this.z = 0;
        this.activation = 0;
        this.bias = random(-1, 1);
        this.weights = [];
        this.delta = 0;

        this.nabla_b = 0;
        this.nabla_w = [];

        this.init_weights();
    }
    init_weights() {
        for (let i = 0; i < this.num_of_weights; i++) {
            this.weights[i] = random(-1, 1);
            this.nabla_w[i] = 0;
        }
    }
    activate(prev_neurons) {
        this.z = 0;
        for (let i = 0; i < this.num_of_weights; i++) {
            this.z += this.weights[i] * prev_neurons[i].activation;
        }
        this.z += this.bias;
        this.activation = this.activation_function(this.z);
    }
    set_nablas(prev_neurons) {
        this.nabla_b += this.delta;
        for (let i = 0; i < this.num_of_weights; i++) {
            this.nabla_w[i] += prev_neurons[i].activation * this.delta;
        }
    }
    update(coeff) {
        this.bias = this.bias-coeff*this.nabla_b;
        this.nabla_b = 0;
        for (let i = 0; i < this.num_of_weights; i++) {
            this.weights[i] = this.weights[i]-coeff*this.nabla_w[i];
            this.nabla_w[i] = 0;
        }
    }
    activation_function(x) {
        return 1/(1+Math.exp(-x));
        //return Math.tanh(x);
    }
    afd() { // Activation function derivative
        let s = this.activation_function(this.z);
        return s*(1-s);
        //return 1-s*s;
    }
    show_neuron() {
        console.log("           Z:   ", this.z, "| Activation:", this.activation);
        console.log("           Bias:", this.bias, "| Delta:", this.delta);
        console.log("           Weights:")
        for (let i = 0; i < this.num_of_weights; i++) {
            console.log("               ", i, ":", this.weights[i]);
        }
    }
}