const roomIdEl = document.getElementById("room-id");
const broadcastSocket = new WebSocket(`ws://localhost:5000?roomId=${roomIdEl.dataset.roomId}`);

const messageEl = document.getElementById('message');
broadcastSocket.onmessage = (message) => {
    messageEl.innerText = message.data;
};
