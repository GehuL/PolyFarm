import { Plante } from "./models/plante.js";
import { ApiService } from "./api-service.js";

const rsc = '../rsc'
const api = new ApiService("http://192.168.1.110:1880");

let selectedTile = null;

const defaultPlantes = {"carotte": new Plante("carotte", 2, 150),
                        "patate": new Plante("patate", 1, 300),
                        "radis": new Plante("radis", 3, 100)};


function onLoad()
{
    attachLegumeDropdownEvent();
    attachPlanteActionEvent();
    attachSliderEvent();
    attachGridSizeEvent();
    //generateField(25);
    fetchGridPlante();
    attachCameraEvent();
}

// Mets à jour les valeurs des labels associés aux sliders
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

// Change la taille de la grille et génère les tiles
// Le serveur est notifié du changement et supprimer toutes les plantes
function attachGridSizeEvent()
{
    const gridSizeSlider = document.getElementById("grid_size");

    gridSizeSlider.addEventListener("change", (event) => {
        const fieldParts = document.querySelector("field-parts");
       
        // Change le nombre d'élément sur une ligne
        fieldParts.style.gridTemplateColumns = `repeat(${ Math.sqrt(gridSizeSlider.value)}, 1fr)`;

        api.setGridSize(gridSizeSlider.value);
        generateField(gridSizeSlider.value);

        console.log("Grid size changed to", gridSizeSlider.value);
    });
}

// Sauvegarde ou supprime une plante et notifie le serveur
function attachPlanteActionEvent()
{
    const saveButton = document.getElementById("sauvegarder_plante");
    const deleteButton = document.getElementById("supprimer_plante");

    saveButton.addEventListener("click", async (event) => 
    {
        if(!selectedTile) return;
       
        const planteName = document.getElementById("plante").value;
       
        const plante = new Plante(
            planteName,
            document.getElementById("frequence_arrosage").value,
            document.getElementById("quantite_eau").value, 
            selectedTile.dataset.id
            );

        let rep = await api.sendPlante(plante.toData());
        if(!rep.ok)
        {
            alert("Erreur lors de l'enregistrement de la plante");
            return;
        }
        
        updatePlanteUI(plante);    
        selectedTile.dataset.plante = JSON.stringify(plante.toData());
        console.log(selectedTile.dataset.plante);
    });

    deleteButton.addEventListener("click", (event) => 
    {
        if(!selectedTile) return;
        console.log("Deleting plante", selectedTile.dataset.plante);
        delete selectedTile.dataset.plante;
        api.deletePlante(selectedTile.dataset.id);
        updatePlanteUI(new Plante("", 0, 0));
    });
}

function attachCameraEvent()
{
    const cameraButton = document.getElementById("camera");
    cameraButton.addEventListener("click", async (event) => {
        let response = await api.getCameraImage();
        if(response.ok)
        {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            document.querySelector("field-parts").style.backgroundImage = `url(${imageUrl})`;
        }
    });
}

function attachLegumeDropdownEvent()
{
    const element = document.getElementById("plante");
    element.addEventListener("change", (event) => 
    {
        const plante = defaultPlantes[element.value];
        if(!plante) return;
        updatePlanteUI(plante, false);
    })
}

function updatePlanteUI(plante, updateTile = true)
{
    document.getElementById("plante").value = plante.nom ?? "";
    document.getElementById("frequence_arrosage").value = plante.frequenceArrosage ?? 0;
    document.getElementById("quantite_eau").value = plante.quantiteEau ?? 0;
    document.getElementById("valeur_slider").textContent = plante.frequenceArrosage ?? 0;
    document.getElementById("valeur_eau").textContent = plante.quantiteEau ?? 0;
  
    if(updateTile)
        selectedTile.style.backgroundImage = plante.nom ? `url(${rsc}/${plante.nom}.png)` : "";
}

async function fetchGridPlante()
{
    const plantes = await api.getPlantes();
    const planteNode = document.querySelector("field-parts");
    for(const plante of plantes.data)
    {
        planteNode.appendChild(createTile(plante.id, plante));
    }
}

function createTile(id, plante)
{
    let tile = document.createElement("field-part");
    tile.dataset.id = id;
    tile.addEventListener("click", onTileSelected);

    if(plante)
    {
        tile.style.backgroundImage = `url(${rsc}/${plante.nom}.png)`;
        tile.dataset.plante = JSON.stringify(plante);
    }

    return tile;
}

function onTileSelected(event)
{
    if(event.target === selectedTile) return;

     // Désactive l'ancienne et active la nouvelle
    event.target.classList.toggle("active", true);
    selectedTile?.classList.toggle("active", false);
    selectedTile = event.target;
    
    // Met a jour l'UI de la plante
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
}

function generateField(size)
{
    const existingTiles = document.querySelector("field-parts");
    existingTiles.innerHTML = "";
    
    selectedTile = null;
    updatePlanteUI(new Plante("", 0, 0), false);
    
    for(let i = 0; i < size; i++)
    {
        existingTiles.appendChild(createTile(i, null));
    }
}

window.addEventListener("load", onLoad);