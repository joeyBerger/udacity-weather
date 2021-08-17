// Setup empty JS object to act as endpoint for all routes
let projectData = [];
let projectDataIdx = 0;

// Require Express to run server and routes
var express = require('express')

// Start up an instance of app
var app = express()


/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
var cors = require('cors')
app.use(cors())

// Initialize the main project folder
app.use(express.static('website'));

app.get('/getMostRecentEntry', (req,res) => {
    if (projectData.length === 0) {
        res.status(409).json({error: "Empty Data. None Exists."});
    } else {
        res.send(projectData[projectDataIdx]);
        if (projectDataIdx > 0) projectDataIdx--;
        console.log(projectDataIdx)
    }
})

app.post('/addNewPost', async (req,res) => {
    console.log(req.body)
    projectData.push(req.body)
    projectDataIdx = projectData.length - 1;
    res.send({sucess : true})
})

// Setup Server
const port = process.env.PORT || 5000;
app.listen(port);