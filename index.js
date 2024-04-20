import 'dotenv/config'
import { readInput, inquirerMenu, pause, cityList } from "./helpers/inquirer.js"
import { Busqueda } from "./models/busqueda.js";

const main = async() => {

    
    let opt;    
    const busqueda = new Busqueda

    do{
        opt = await inquirerMenu()
        switch(opt){
            case 1:
                const promt = await readInput('Search City: ')
                const resp = await busqueda.ciudad(promt)
                const chosenCityId = await cityList(resp)

                if (chosenCityId === 0) continue; 


                const actualLocation = resp.find(location  =>  location.id === chosenCityId )
                
                busqueda.saveCity(actualLocation.name)

                const weatherInfoByLocation = await busqueda.getWeatherByGeolocation(actualLocation.lat, actualLocation.lgt)

                busqueda.saveDb()
            
                console.log('Location: ' + actualLocation.name);
                console.log('Latitude: ' + actualLocation.lat);
                console.log('Longitude: ' + actualLocation.lgt);

                console.log('Weather: ' + weatherInfoByLocation.desc);
                console.log('Actual Weather: ' + weatherInfoByLocation.temp_cur + ' °C');
                console.log('Min Weather: ' + weatherInfoByLocation.temp_min + ' °C');
                console.log('Max Weather: ' + weatherInfoByLocation.temp_max + ' °C');

            break;

            case 2:
     
            const places = busqueda.capitalizatedPlaces;
            places.forEach((city, i) => {
                const idx = i + 1;
                console.log(`${idx}. ${city}`);
            });

            break;
        }
       await pause()
    }while(opt !== 3)
}

main();