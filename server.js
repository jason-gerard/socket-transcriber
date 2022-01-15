const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/token', async (req, res) => {
    try {
        const response = await axios.post('https://api.assemblyai.com/v2/realtime/token', // use account token to get a temp user token
            { expires_in: 3600 }, // can set a TTL timer in seconds.
            { headers: { authorization: 'fc387af2eb7b4ad38b6c4067885d43db' } }); // AssemblyAI API Key goes here
        const { data } = response;
        res.json(data);
    } catch (error) {
        console.log(error)
        const {response: {status, data}} = error;
        res.status(status).json(data);
    }
});

app.get('/speaker', async (req, res) => {
    res.sendFile(path.join(__dirname + '/public/speaker-page.html'));
});

app.get('/listener', async (req, res) => {
    res.sendFile(path.join(__dirname + '/public/listener-page.html'));
});

app.get('/room-select', async (req, res) => {
    res.sendFile(path.join(__dirname + '/public/room-select-page.html'));
});

app.set('port', 5000);
app.use(express.static('public'));

const server = app.listen(app.get('port'), () => {
    console.log(`Server is running on port ${server.address().port}`);
});
