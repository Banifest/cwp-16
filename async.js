const Promise = require('bluebird');
const axios = require('axios');
const co = require('co');

async function main()
{
    let gmaps = axios.create({baseURL: 'https://maps.googleapis.com/maps/api/geocode/'});

    let firstTaskData = await Promise.map(["json?address=Minsk", "json?address=Madrid", "json?address=Rome"],
                              query => gmaps.get(query));
    console.log(await firstTaskData.forEach(iter => { console.log(iter.data.results)}));
    console.log('--------------------------------------------------------------------------------\n\n\n\n\n');

    (await Promise.any([gmaps.get("json?address=Paris"), gmaps.get("json?address=Nice")]))
                    .data.results[0].address_components.forEach(iter => {
                        if(iter.types.indexOf("country") !== -1)
                        {
                            console.log(iter.long_name)
                        }
    })

    console.log('--------------------------------------------------------------------------------\n\n\n\n\n');
    let street = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=Via Nicola Salvi`);
    console.log(street.data.results[0].formatted_address);
    await street.data.results[0].address_components.forEach(iter => {console.log(iter.long_name)})

    //console.log(await Promise.map(["Минск", "Мадрид", "Рим"], query => gmaps.get(query)));



}


main();