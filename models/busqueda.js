import axios from 'axios';
import { execSync } from 'child_process';
import fs, { existsSync, readFileSync } from 'fs'

class Busqueda {

    history = [];

    constructor(){
       this.readDb
    }

    get getParamsMapBox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get capitalizatedPlaces(){
        return this.history.map(place => {
            let words = place.split(' ')
            words.map(w => w[0].toUpperCase() + w.substring(1));
            return words.join(' ')
        })
    }

    async ciudad(place){
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.getParamsMapBox
                
            })
            const resp = await instance.get()
            return resp.data.features.map(city => ({
                id: city.id,
                name: city.place_name,
                lat: city.center[1],
                lgt: city.center[0]
            }));
        } catch (error) {
            return []
            console.log(error)
        }

    }

    get getParamsOpenWeather(){
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }


    async getWeatherByGeolocation(lat, lon){

        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.getParamsOpenWeather, lat, lon}
            })
            const resp = await instance.get();
            const { weather, main } = resp.data
            return {
                desc: weather[0].description,
                temp_cur: main.temp,
                temp_min: main.temp_min,
                temp_max: main.temp_max
            }
        } catch (error) {
            return {}
        }
    }
    

    saveCity(city = ''){

        if(this.history.includes(city)){
            return;
        }
        this.history.unshift(city)
    }

    saveDb(){
        const payload = {
            'history': this.history
        }

        fs.writeFileSync('./db/data.js', JSON.stringify( payload ))
    }

    readDb(){
        if (!fs.existsSync('./db/data.js')) {
            return;
        }

        const info = fs.readFileSync('./db/data.js', {encoding: 'utf-8'})
        const data = JSON.parse(info)

        this.history = data.history
    }

    


}

export {
    Busqueda
};