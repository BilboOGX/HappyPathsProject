import axios from 'axios';

export function fetchGeoLocation(postcode){
    let location = postcode;
    const apiKey = 'AIzaSyB3gOjnEdwTeypcOSdKj7_MjbCv6M3hLTY'
    return axios.get('https://maps.googleapis.com/maps/api/geocode/json?' , {
        params:{
            address: location,
            components: 'country:GB',
            key: apiKey
        }
     })
}