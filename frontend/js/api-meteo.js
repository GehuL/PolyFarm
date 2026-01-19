export class ApiMeteo
{
    METEO_PREVISION = "https://webservice.meteofrance.com"

    constructor(baseUrl, token)
    {
        this.baseURL = baseUrl;
        this.token = token;
    }

    async getMeteo(id_station)
    {
        let result = null;
        try
        {
            result =  await fetch(this.baseURL + "?id_station=" + id_station + "&format=json", 
                {method: "get", headers: {"apikey": `${this.token}`}});
        }catch(e)
        {
            console.log(e)
        }
        if(result?.status == 200)
        {
            return await result.json();
        } else {
            return null;
        }
    }

    async getMeteoPrevision(lat, lon)
    {
        let result = null;
        try
        {
            result =  await fetch(this.METEO_PREVISION + "/forecast?token=__Wj7dVSTjV9YGu1guveLyDq0g7S7TfTjaHBTPTpO0kj8__" + "&lat=" + lat + "&lon=" + lon + "&lan=fr", 
                {method: "get"});
        }catch(e)
        {
            console.log(e)
        }
        if(result?.status == 200)
        {
            return await result.json();
        } else {
            return null;
        }
    }
}