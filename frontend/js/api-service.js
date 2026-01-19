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
        // DELETE doesn't need a JSON body for an id; call the REST URL /plants/:id
        return await fetch(this.baseURL + "/plants/" + encodeURIComponent(plantId),
            { method: "DELETE" });
    }

    async getPlantes()
    {
        let result = null;
        try
        {
            result =  await fetch(this.baseURL + "/plants", { method: "GET" });
        }catch(e)
        {
            console.log(e)
        }

        if(result?.ok)
        {
            const json = await result.json();
            if(Array.isArray(json)) return { data: json };
            if(json && (Array.isArray(json.data) || json.data !== undefined)) return json;
            return { data: [] };
        } else {
            return { data: [] };
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