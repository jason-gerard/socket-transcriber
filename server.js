const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const http = require("http");
const websocket = require("ws");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('port', 5000);

app.get('/token', async (req, res) => {
    try {
        const { data } = await axios.post(
            'https://api.assemblyai.com/v2/realtime/token',
            { expires_in: 3600 },
            { headers: { authorization: 'fc387af2eb7b4ad38b6c4067885d43db' } }
        );

        res.json(data);
    } catch (error) {
        console.log(error)
        const {response: {status, data}} = error;
        res.status(status).json(data);
    }
});

app.get('/speaker', async (req, res) => {
    res.render("speaker-page");
});

app.get('/listener', async (req, res) => {
    res.render("listener-page");
});

app.get('/room-select', async (req, res) => {
    res.render("room-select-page");
});

const server = http.createServer(app);

const wss = new websocket.WebSocket.Server({ server });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        wss.clients.forEach(client => {
            if (client !== ws) {
                client.send(message.toString());
            }
        });
    });
});

server.listen(5000, () => {
    console.log(`Server started on port ${server.address().port}`);
});
