/* Global Variables */
// API key used for weather data
const apiKey = '20d9e6f5d90e787b833bc70f64e958dd'

// Used for displaying data
const dataHeaders = {
    date : "Date: ",
    temp : "Temperature (F): ",
    content : "Feelings: ",
}

// Create a new date instance dynamically with JS
let d = new Date();
let date = (d.getMonth() + 1)+'.'+ d.getDate()+'.'+ d.getFullYear();

/* Helper Functions */
// Get data from key inputs
const getEnteredZipCode = () => document.getElementById('zip').value;

const getEnteredFeelings = () => document.getElementById('feelings').value

// Plays shake animation when all data is not entered
const playShakeAnim = (elem) => {
    elem.classList.add('shake')
    setTimeout(() => {elem.classList.remove('shake')},820)
}

// Get generate button to add event listener
let generateButton = document.getElementById('generate');

// Add event listener
generateButton.addEventListener('click', async (e) => {
    e.preventDefault();  

    // Get zip and feelings content
    const zipCode = getEnteredZipCode();
    const content = getEnteredFeelings();


    let allFormsEntered = true;

    // If not all forms filled out, shake element
    const correspondingDataDivs = {'zip' : zipCode, 'feelings' : content}
    Object.keys(correspondingDataDivs).forEach(k => {
        if (!correspondingDataDivs[k]) {
            playShakeAnim(document.getElementById(k))
            allFormsEntered = false;
        }
    })

    // Exit if not all forms filled out
    if (!allFormsEntered) return;

    try {
        // Get weather data
        let weatherData = await fetch (`http://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=imperial`)

        // If invalid zip code or other error, throw error
        if (!weatherData.ok) throw Error(weatherData.statusText);

        // Get temperature from returned data
        weatherData = await weatherData.json()
        const temp = weatherData.main.temp;

        // post content with returned temperature
        await fetch('/addNewPost', {
            method: 'POST', 
            mode: 'cors',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                date,
                temp,
                content
            })
        });

        // Get data from server
        let res = await fetch('/getEntry');
        res = await res.json();

        // For each object in returned object, select appropriate div and change inner html
        Object.keys(res).forEach(k => {
            var element = document.getElementById(k);
            element.innerHTML = `${dataHeaders[k]} ${res[k]}`;
        })
    }
    catch (e) {
        console.log('error',e)
    }
})