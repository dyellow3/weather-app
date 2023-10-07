import { add, format, fromUnixTime } from "date-fns"
import './style.css';
import { createClient } from "pexels";

async function getWeather(location) {
    try {
        const response = await fetch('https://api.weatherapi.com/v1/current.json?key=b902dc0665b84c099e000044233009&q=' + location, { mode: 'cors' })

        if (!response.ok) {
            console.error(`Error fetching data for location: ${location}$`)
            return null
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
            console.error(`Error fetching data for location: ${location}`);
            return null
        }

        const data = await response.json();
        return data
    }
    catch (error) {
        console.error(`Error occurred for location: ${location}`, error);
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

    try {
        const response = await fetch(`https://api.pexels.com/v1/search/?page=1&per_page=1&query=${query}`, settings)
        const data = await response.json()

        if (data.total_results === 0) {
            console.error(`Error fetching image for query: ${query}`)
            return null;
        }
        console.log(data)
        return [ data.photos[0].src.original, data.photos[0].photographer ]
    }
    catch (error) {
        console.error(`Error occurred for query: ${query}`, error)
    }
}

async function displayTodaysWeather(currWeather) {
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

    const today = document.querySelector('body')
    const query = `${currWeather.current.condition.text} sky$`
    const img = await getImage(query)
    const footer = document.querySelector('.footer') 
    if (img) {
        today.style.backgroundImage = `url(${img[0]})`
        const photographer = document.querySelector('.photographer') 
        photographer.innerHTML = `Photographer: ${img[1]}`
    }

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

async function driver(location) {
    const weather = await getForecast(location)
    if(weather) {
        displayTodaysWeather(weather)
        displayForecast(weather)
    }
    
}

const form = document.getElementById('form')
const search = document.getElementById('search')
form.addEventListener('submit', function(event) {
    event.preventDefault()
    driver(search.value)
})

driver('london')
