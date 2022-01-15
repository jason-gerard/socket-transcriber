const messageEl = document.getElementById('message');
const broadcastSocket = new WebSocket("ws://localhost:5000");

broadcastSocket.onmessage = (message) => {
    messageEl.innerText = message.data;
};
