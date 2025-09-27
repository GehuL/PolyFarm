export class Plante {
    #nom;
    #frequenceArrosage; 
    #quantiteEau;
    #lastArrosage;
    #id;

    get nom() { return this.#nom; }
    get frequenceArrosage() { return this.#frequenceArrosage; }
    get quantiteEau() { return this.#quantiteEau; }
    get id() { return this.#id; }

    constructor(nom, frequenceArrosage, quantiteEau, id = null) {
        this.#nom = nom;
        this.#frequenceArrosage = frequenceArrosage;
        this.#quantiteEau = quantiteEau;
    }

    arroser() {
        this.#lastArrosage = new Date();
    }

    toData() {
        return {
            nom: this.#nom,
            frequenceArrosage: this.#frequenceArrosage,
            quantiteEau: this.#quantiteEau,
            lastArrosage: this.#lastArrosage
        };
    }
}