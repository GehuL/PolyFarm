export class Plante {
    #nom;
    #frequenceArrosage; 
    #quantiteEau;
    #lastArrosage;
    #id;
    #x;
    #y;

    get nom() { return this.#nom; }
    get frequenceArrosage() { return this.#frequenceArrosage; }
    get quantiteEau() { return this.#quantiteEau; }
    get id() { return this.#id; }

    constructor(nom, frequenceArrosage, quantiteEau, x = 0, y = 0, id = 0, lastArrosage = 0) {
        this.#nom = nom;
        this.#frequenceArrosage = frequenceArrosage;
        this.#quantiteEau = quantiteEau;
        this.#x = x;
        this.#y = y;
    }

    arroser() {
        this.#lastArrosage = new Date();
    }

    toData() {
        return {
            nom: this.#nom,
            frequenceArrosage: this.#frequenceArrosage,
            quantiteEau: this.#quantiteEau,
            x: this.#x,
            y: this.#y,
            id: this.#id,
            lastArrosage: this.#lastArrosage
        };
    }
}