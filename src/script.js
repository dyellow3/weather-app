import { add, format, fromUnixTime } from "date-fns"
import './style.css';
import { createClient } from "pexels";

async function getWeather(location) {
    try {
        const response = await fetch('https://api.weatherapi.com/v1/current.json?key=b902dc0665b84c099e000044233009&q=' + location, { mode: 'cors' })

        if (!response.ok) {
            console.error(`Error fetching data for location: ${location}$`)
        }

        const data = await response.json()
        return data
    }
    catch (error) {
        console.error(`Error occurred for location: ${location}`, error);
    }
}

async function getForecast(location) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=b902dc0665b84c099e000044233009&q=${location}&days=7`, { mode: 'cors' })

        if (!response.ok) {
            console.error(`Error fetching data for date: ${location}`);
        }

        const data = await response.json();
        return data
    }
    catch (error) {
        console.error(`Error occurred for location: ${location}`, error);
    }
}

function displayTodaysWeather(currWeather) {
    const location = document.querySelector('.today .location')
    const temp = document.querySelector('.today .temp')
    const condition = document.querySelector('.today .condition')
    const high = document.querySelector('.today .highLow .high')
    const low = document.querySelector('.today .highLow .low')

    location.innerHTML = currWeather.location.name
    temp.innerHTML = currWeather.current.temp_f
    condition.innerHTML = currWeather.current.condition.text
    high.innerHTML = "H:" + currWeather.forecast.forecastday[0].day.maxtemp_f;
    low.innerHTML = "L:" + currWeather.forecast.forecastday[0].day.mintemp_f;
}
function displayForecast(weather) {
    let today = fromUnixTime(Date.now() / 1000)
    for (let i = 1; i < 8; i++) {
        const currDate = add(new Date(today), { days: i - 1 })
        const day = document.querySelector(`.day${i} .day`)
        const conditionPicture = document.querySelector(`.day${i} .conditionPicture`)
        const condition = document.querySelector(`.day${i} .condition`)
        const high = document.querySelector(`.day${i} .temp .high`)
        const low = document.querySelector(`.day${i} .temp .low`)
        day.innerHTML = (i == 1) ? "Today" : format(currDate, 'cccc')
        conditionPicture.src = (weather.forecast.forecastday[`${i - 1}`].day.condition.icon)

        condition.innerHTML = weather.forecast.forecastday[`${i - 1}`].day.condition.text
        high.innerHTML = "H:" + weather.forecast.forecastday[`${i - 1}`].day.maxtemp_f
        low.innerHTML = "L:" + weather.forecast.forecastday[`${i - 1}`].day.mintemp_f
    }
}
async function getImage(query) {
    const client = createClient('mYHFfU8IsZio6IHAq9IQcZHAkn7okTtTDvyoOKmeyxbXctiVLw4w1Gdd');

    const settings = {
        method: 'GET',
        headers: {
            'Authorization': 'mYHFfU8IsZio6IHAq9IQcZHAkn7okTtTDvyoOKmeyxbXctiVLw4w1Gdd'
        }
    }
    const response = await fetch(`https://api.pexels.com/v1/search/?page=1&per_page=1&query=${query}`, settings)


    const data = await response.json();
    return data
}
async function driver() {
    const weather = await getForecast('phoenix')
    displayTodaysWeather(weather)
    displayForecast(weather)
    console.log(weather)
    const data = await getImage('cows')
    console.log(data)
    let url =(data.photos[0].src.original)
    console.log(url)
    const today = document.querySelector('.todayWeather')
    today.style.backgroundImage = `url(${url})` 
}
driver()
//client.photos.search({ query, per_page: 1 }).then(photos => { console.log(photos)});
