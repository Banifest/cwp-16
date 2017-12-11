const co = require('co');
const Promise = require('bluebird');
const axios = require('axios');
const geolib = require('geolib');

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

    await co(function *()
             {
                 return yield Promise.mapSeries(["json?address=Minsk", "json?address=Copenhagen", "json?address=Oslo", "json?address=Brussels"],
                                                query => gmaps.get(query))
             })
        .then(cityRes =>
              {
                  let res = {};
                  cityRes.map((item)=>{res[item.data.results[0].formatted_address] = item.data.results[0].geometry.location});

                  console.log(geolib.findNearest(res['Minsk, Belarus'], res, 1));
              })

    await co(function* ()
             {
                 return yield Promise.all([axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=Piazza del Сolosseo`)])
             })
        .then(function (res)
        {
            console.log(res[0].data.results[0].formatted_address);
            res[0].data.results[0].address_components.forEach((iter) => {console.log(iter.long_name);})
        });
}

main();