/* Global Variables */
const apiKey = '20d9e6f5d90e787b833bc70f64e958dd'


// Create a new date instance dynamically with JS
let d = new Date();
let date = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

const getEnteredZipCode = () => document.getElementById('zip').value;

const getEnteredFeelings = () => document.getElementById('feelings').value

let testButton = document.getElementById('test-button');
testButton.addEventListener('click', async (e) => {
    e.preventDefault();  

    const zipCode = getEnteredZipCode();
    const feelings = getEnteredFeelings();

    if (!zipCode && !feelings) console.log('not entered')

    try {
        let weatherData = await fetch (`http://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}&units=imperial`)
        if (!weatherData.ok) throw Error(weatherData.statusText);

        weatherData = await weatherData.json()

        const response = await fetch('/addNewPost', {
            method: 'POST', 
            mode: 'cors',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                date,
                weatherData,
                feelings
            })
        });
    }
    catch (e) {
        console.log('error',e)
    }
})

let generateButton = document.getElementById('generate');
generateButton.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        let res = await fetch('/getMostRecentEntry');
        const error = !res.ok;
        res = await res.json();
        if (error) throw Error(res.error);
        console.log(res)

    } catch(e) {
        console.log(e)
    }

})