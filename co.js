const co = require('co');
const Promise = require('bluebird');
const axios = require('axios');
const geolib = require('geolib');

let gmaps = axios.create({baseURL: 'https://maps.googleapis.com/maps/api/geocode/'});

co(function *()
{
    let firstTaskData = yield Promise.map(["json?address=Minsk", "json?address=Madrid", "json?address=Rome"],
                                    query => gmaps.get(query));

    for(let iter of firstTaskData)
    {
        console.log(iter.data.results)
    }

    console.log('********************************************************************\n\n\n\n\n\\n\n\n\n\n\\n\n\n\n')

    let secondTaskData = yield Promise.any([gmaps.get("json?address=Paris"), gmaps.get("json?address=Nice")])
    for(let iter of secondTaskData.data.results[0].address_components)
    {
        if (iter.types.indexOf("country") !== -1)
        {
            console.log(iter.long_name)
        }
    }


    let street = yield axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=Via Nicola Salvi`);

    for(let iter of street.data.results[0].address_components)
    {
        console.log(iter.long_name);
    }
});

/*
async function main()
{
    let gmaps = axios.create({baseURL: 'https://maps.googleapis.com/maps/api/geocode/'});


    await co(function *()
             {
                 return yield Promise.map(["json?address=Brest", "json?address=Minsk"],
                                          query => gmaps.get(query));
             })
            .then(value =>
            {
                console.log(geolib.getDistance(value[0].data.results[0].geometry.location,
                                   value[1].data.results[0].geometry.location))
            });

    cityRes = await co(function *()
             {
                 return yield Promise.mapSeries(["json?address=Minsk", "json?address=Copenhagen", "json?address=Oslo", "json?address=Brussels"],
                                                query => gmaps.get(query))
             })

    let res = {};
    cityRes.map((item)=>{res[item.data.results[0].formatted_address] = item.data.results[0].geometry.location});
    console.log(geolib.findNearest(res['Minsk, Belarus'], res, 1));

    res = await co(function* ()
             {
                 return yield Promise.all([axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=Piazza del Сolosseo`)])
             })
    console.log(res[0].data.results[0].formatted_address);
    res[0].data.results[0].address_components.forEach((iter) => {console.log(iter.long_name);})
}

main();*/