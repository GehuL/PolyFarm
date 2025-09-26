const rsc = '../rsc'

let selectedTile = null;

function onLoad()
{
    generateField();
    attachLegumeDropdownEvent();
}

function attachLegumeDropdownEvent()
{
    const element = document.getElementById("select");
    element.addEventListener("change", (event) => 
    {
        console.log(element.value);
        if(element.value == "none")
            selectedTile.style.backgroundImage = "";
        else
            selectedTile.style.backgroundImage = `url('${rsc}/${element.value}.png')`
        selectedTile.dataset.plante = `${element.value}`
    })
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
            planteSelector.value = selectedTile.dataset.plante;
        });
        element.appendChild(tile);
    }
}

window.addEventListener("load", onLoad);