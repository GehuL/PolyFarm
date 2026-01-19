export class ApiService
{
    constructor(baseUrl)
    {
        this.baseURL = baseUrl;
    }

    async sendPlante(plant)
    {
        const payload = JSON.stringify(plant);
        let rep = await fetch(this.baseURL + "/plants", 
            {method: "post", headers: {"Content-Type": "application/json"}, body: payload});
        return rep;
    }

    async deletePlante(plantId)
    {
        const payload = JSON.stringify(plantId);
        return await fetch(this.baseURL + "/plants" + plantId, 
            {method: "delete", headers: {"Content-Type": "application/json"}, body});
    }

    async getPlantes()
    {
        let result = null;
        try
        {
            result =  await fetch(this.baseURL + "/plants", {method: "get"});
        }catch(e)
        {
            console.log(e)
        }

        if(result?.status == 200)
        {
            return await result.json();
        } else {
            // Pour phase de test, a retirer en suivant
            return [];
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
        return await fetch(this.baseURL + "/camera", {method: "get"});
    }
}