import { Plante } from "./models/plante.js";

export class ApiService
{
    constructor(baseUrl)
    {
        this.baseURL = baseUrl;
    }

    async sendPlante(plant)
    {
        const payload = JSON.stringify(plant);
        return await fetch(this.baseURL + "/plants", 
            {method: "post", headers: {"Content-Type": "application/json"}, body: payload});
    }

    async deletePlante(plantId)
    {
        const payload = JSON.stringify(plantId);
        return await fetch(this.baseURL + "/plants" + plantId, 
            {method: "delete", headers: {"Content-Type": "application/json"}, body});
    }

    async getPlantes()
    {
        const result = null;
        try
        {
            const result =  await fetch(this.baseURL + "/plants", {method: "get"});
        }catch(e)
        {
        }

        if(result?.status == 200)
        {
            return await result.json();
        } else {
            // Pour phase de test, a retirer en suivant
            const plantes = [];
            for(let i=0; i<25; i++) {
                plantes.push(new Plante("radis", 5, 500, i).toData());
            }         
            return {data: plantes};
        }
    }

    async setGridSize(size)
    {
        const payload = JSON.stringify(size);
        return await fetch(this.baseURL + "/grid/size", 
            {method: "post", headers: {"Content-Type": "application/json"}, body: payload});
    }

    async getCameraImage()
    {
        return await fetch(this.baseURL + "/camera/image", {method: "get"});
    }
}