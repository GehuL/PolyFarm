import { Plante } from "./models/plante.js";

const rsc = '../rsc'

let selectedTile = null;

function onLoad()
{
    generateField();
    attachLegumeDropdownEvent();
    attachPlanteActionEvent();
    attachSliderEvent();
}

function attachSliderEvent()
{
    const frequenceSlider = document.getElementById("frequence_arrosage");
    const frequenceValue = document.getElementById("valeur_slider");

    frequenceSlider.addEventListener("input", (event) => {
        frequenceValue.textContent = frequenceSlider.value;
    });

    const quantiteSlider = document.getElementById("quantite_eau");
    const quantiteValue = document.getElementById("valeur_eau");
    quantiteSlider.addEventListener("input", (event) => {
        quantiteValue.textContent = quantiteSlider.value;
    });
}

function attachPlanteActionEvent()
{
    const saveButton = document.getElementById("sauvegarder_plante");
    const deleteButton = document.getElementById("supprimer_plante");

    saveButton.addEventListener("click", (event) => 
    {
        if(!selectedTile) return;
       
        const planteName = document.getElementById("plante").value;
        const plante = new Plante(
            planteName,
            document.getElementById("frequence_arrosage").value,
            document.getElementById("quantite_eau").value);

        selectedTile.dataset.plante = JSON.stringify(plante.toData());
        updatePlanteUI(plante);    
        console.log(selectedTile.dataset.plante);
    });

    deleteButton.addEventListener("click", (event) => 
    {
        if(!selectedTile) return;
        console.log("Deleting plante", selectedTile.dataset.plante);
        delete selectedTile.dataset.plante;
        updatePlanteUI(new Plante("", 0, 0));
    });
}

function attachLegumeDropdownEvent()
{
    const element = document.getElementById("plante");
    element.addEventListener("change", (event) => 
    {

    })
}

function updatePlanteUI(plante)
{
    document.getElementById("plante").value = plante.nom ?? "";
    document.getElementById("frequence_arrosage").value = plante.frequenceArrosage ?? 0;
    document.getElementById("quantite_eau").value = plante.quantiteEau ?? 0;
    document.getElementById("valeur_slider").textContent = plante.frequenceArrosage ?? 0;
    document.getElementById("valeur_eau").textContent = plante.quantiteEau ?? 0;
    selectedTile.style.backgroundImage = plante.nom ? `url(${rsc}/${plante.nom}.png)` : "";
}

function generateField()
{
    const element = document.querySelector("field-parts");
    for(let i = 0; i < 25; i++)
    {
        const tile = document.createElement("field-part");
        tile.addEventListener("click", (event) => 
        {
            if(event.target === selectedTile) return;

            // Change bordure color and update reference
            event.target.classList.toggle("active", true);
            selectedTile?.classList.toggle("active", false);
            selectedTile = tile;
            
            // Update infos based on tile
            const planteSelector = document.getElementById("plante")
            
            if(!selectedTile.dataset.plante)
            {
                updatePlanteUI(new Plante("", 0, 0));
                return;
            }

            const plante = JSON.parse(selectedTile.dataset.plante, (key, value) => {
                return value;
            });

            updatePlanteUI(plante);

            planteSelector.value = plante.nom;
        });
        element.appendChild(tile);
    }
}

window.addEventListener("load", onLoad);