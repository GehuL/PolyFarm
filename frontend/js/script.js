import { Plante } from "./models/plante.js";
import { ApiService } from "./api-service.js";
import { ApiMeteo } from "./api-meteo.js";

import mqtt from "../node_modules/mqtt/dist/mqtt.esm.js";

const raspberryIP = "192.168.1.125";

const tokenMeteo = "eyJ4NXQiOiJZV0kxTTJZNE1qWTNOemsyTkRZeU5XTTRPV014TXpjek1UVmhNbU14T1RSa09ETXlOVEE0Tnc9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJHZWh1bGF1QGNhcmJvbi5zdXBlciIsImFwcGxpY2F0aW9uIjp7Im93bmVyIjoiR2VodWxhdSIsInRpZXJRdW90YVR5cGUiOm51bGwsInRpZXIiOiJVbmxpbWl0ZWQiLCJuYW1lIjoiRGVmYXVsdEFwcGxpY2F0aW9uIiwiaWQiOjM1OTIyLCJ1dWlkIjoiZTI2ZDIwYmQtMzE5My00ZjY5LWEwZDItN2I1NDVlNTRmOTQ2In0sImlzcyI6Imh0dHBzOlwvXC9wb3J0YWlsLWFwaS5tZXRlb2ZyYW5jZS5mcjo0NDNcL29hdXRoMlwvdG9rZW4iLCJ0aWVySW5mbyI6eyI1MFBlck1pbiI6eyJ0aWVyUXVvdGFUeXBlIjoicmVxdWVzdENvdW50IiwiZ3JhcGhRTE1heENvbXBsZXhpdHkiOjAsImdyYXBoUUxNYXhEZXB0aCI6MCwic3RvcE9uUXVvdGFSZWFjaCI6dHJ1ZSwic3Bpa2VBcnJlc3RMaW1pdCI6MCwic3Bpa2VBcnJlc3RVbml0Ijoic2VjIn19LCJrZXl0eXBlIjoiUFJPRFVDVElPTiIsInN1YnNjcmliZWRBUElzIjpbeyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkFST01FIiwiY29udGV4dCI6IlwvcHVibGljXC9hcm9tZVwvMS4wIiwicHVibGlzaGVyIjoiYWRtaW5fbWYiLCJ2ZXJzaW9uIjoiMS4wIiwic3Vic2NyaXB0aW9uVGllciI6IjUwUGVyTWluIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkFSUEVHRSIsImNvbnRleHQiOiJcL3B1YmxpY1wvYXJwZWdlXC8xLjAiLCJwdWJsaXNoZXIiOiJhZG1pbl9tZiIsInZlcnNpb24iOiIxLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiNTBQZXJNaW4ifSx7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiRG9ubmVlc1B1YmxpcXVlc09ic2VydmF0aW9uIiwiY29udGV4dCI6IlwvcHVibGljXC9EUE9ic1wvdjEiLCJwdWJsaXNoZXIiOiJiYXN0aWVuZyIsInZlcnNpb24iOiJ2MSIsInN1YnNjcmlwdGlvblRpZXIiOiI1MFBlck1pbiJ9LHsic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJEb25uZWVzUHVibGlxdWVzUGFxdWV0T2JzZXJ2YXRpb24iLCJjb250ZXh0IjoiXC9wdWJsaWNcL0RQUGFxdWV0T2JzXC92MSIsInB1Ymxpc2hlciI6ImJhc3RpZW5nIiwidmVyc2lvbiI6InYxIiwic3Vic2NyaXB0aW9uVGllciI6IjUwUGVyTWluIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkRvbm5lZXNQdWJsaXF1ZXNDbGltYXRvbG9naWUiLCJjb250ZXh0IjoiXC9wdWJsaWNcL0RQQ2xpbVwvdjEiLCJwdWJsaXNoZXIiOiJhZG1pbl9tZiIsInZlcnNpb24iOiJ2MSIsInN1YnNjcmlwdGlvblRpZXIiOiI1MFBlck1pbiJ9XSwiZXhwIjoxNzY4MzkwNzE0LCJ0b2tlbl90eXBlIjoiYXBpS2V5IiwiaWF0IjoxNzY4MzE1MTE0LCJqdGkiOiI1OTE1ZTRjZS0zYWMwLTQzZjYtYjc3My1iZTcwNmNlNjgwODgifQ==.xEGshXGemcVu6wZdu1qisAg4aH1mHJHs7tT23t_v-lGyE0dgd25vAOHROZvQw6slqAm9IDktMu465BWlAqwGMLKaAQS3xTmDVtkn1NwpJ15AL27ijEranpDuvUXJxcqk_TAJf1kxCm_t6rEURaER_8kuH6s8-t_8A1d5rTAVQRh6HTbn1ot1FRhlpsAwmn4ToSNM3t1QJo3MQdFeESZfgpcctAlQnen33n0Glrr80IWdXPJaUYRKr2Qljr9GfKMq4Lrl0PkC5nkm4NQM3sDrM05YZsWPsY8nWiSwF4yGPNk6cjdXdTZgU90t-zdioKxbPun61fk8DerW0dUJk3SI6w==";
const apiMeteo = new ApiMeteo(`https://public-api.meteofrance.fr/public/DPObs/v1/station/infrahoraire-6m`, tokenMeteo);

const rsc = 'rsc'
const api = new ApiService(`http://${raspberryIP}:1880`);

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
    fetchPhoto();

    console.log(mqtt);
    const client = mqtt.connect(`ws://${raspberryIP}:1883`)

    client.subscribe("capteurs/hum1", { qos: 0 }, (err) => {
        if (err) console.error("subscribe error:", err);
        else console.log("subscribed to capteurs/hum1");
    });

    client.subscribe("capteurs/temp1", { qos: 0 }, (err) => {
        if (err) console.error("subscribe error:", err);
        else console.log("subscribed to capteurs/hum1");
    });

    client.subscribe("capteurs/lum1", { qos: 0 }, (err) => {
        if (err) console.error("subscribe error:", err);
        else console.log("subscribed to capteurs/hum1");
    });

    client.on("message", (topic, message) => {
        console.log("msg", topic, message.toString());  
        if(topic === "capteurs/hum1") {
            document.getElementById("humidity").textContent = message.toString() + "%";
        }else if(topic === "capteurs/temp1")
        {
            document.getElementById("temperature").textContent = message.toString() + "°";
        }else if(topic === "capteurs/lum1")
        {
            document.getElementById("luminosity").textContent = message.toString() + " cd/m²";
        }
    });

    fetchMeteo();
    fetchMeteoPrevision();
    // client.publish("capteurs/hum1", "Hello from frontend MQTT over WebSocket!");
}

function fetchMeteo()
{
    apiMeteo.getMeteo(21473001).then((data) => {
        console.log(data);
    });
}

function fetchMeteoPrevision()
{
    const lat = 47.267833;
    const lon = 5.088333;
    apiMeteo.getMeteoPrevision(lat, lon).then((data) => {
        console.log(data);
        const day = 0;
        document.getElementById("prevision").textContent = data["forecast"][day]["weather"]["desc"];
        document.getElementById("temperature_prev").textContent = data["forecast"][day]["T"]["value"] + "°C";
        document.getElementById("precipitation").textContent = data["forecast"][day]["rain"]["1h"] + "%";
    });
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

        const pp = selectedTile.dataset.plante ? JSON.parse(selectedTile.dataset.plante) : null;

        const plante = new Plante(
            planteName,
            document.getElementById("frequence_arrosage").value,
            document.getElementById("quantite_eau").value, 
            pp.x,
            pp.y,
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
    cameraButton.addEventListener("click", fetchPhoto);
}

async function fetchPhoto()
{
    document.getElementById("camera").classList.add("spinning");
    let response = await api.getCameraImage();
    
    if(response.ok)
    {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        document.querySelector("field-parts").style.backgroundImage = `url(${imageUrl})`;
        document.getElementById("date_photo").textContent = `${new Date().toLocaleString()}`;
    }
        document.getElementById("camera").classList.remove("spinning");

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