class Layer {
    constructor(num_of_neurons, weights_per_neuron) {
        this.num_of_neurons = num_of_neurons;
        this.weights_per_neuron = weights_per_neuron;

        this.neurons = [];
        this.init_neurons()
    }
    init_neurons() {
        for (let i = 0; i < this.num_of_neurons; i++) {
            this.neurons[i] = new Neuron(this.weights_per_neuron);
        }
    }
    activate_neurons(prev_layer) {
        for (let i = 0; i < this.num_of_neurons; i++) {
            this.neurons[i].activate(prev_layer.neurons);
        }
    }
    update_deltas(next_layer) {
        let del = 0;
        for (let i = 0; i < this.num_of_neurons; i++) {
            for (let j = 0; j < next_layer.num_of_neurons; j++) {
                del += next_layer.neurons[j].weights[i] * next_layer.neurons[j].delta
            }
            this.neurons[i].delta = del*this.neurons[i].afd();
        }
    }
    set_nablas(prev_layer) {
        for (let i = 0; i < this.num_of_neurons; i++) {
            this.neurons[i].set_nablas(prev_layer.neurons);
        }
    }
    update(coeff) {
        for (let i = 0; i < this.num_of_neurons; i++) {
            this.neurons[i].update(coeff);
        }
    }
    show_layer() {
        for (let i = 0; i < this.num_of_neurons; i++) {
            console.log("      Neuron:", i);
            this.neurons[i].show_neuron();
        }
    }
}