const buttonEl = document.getElementById('button');
const messageEl = document.getElementById('message');

let isRecording = false;
let transcriptionSocket;
let recorder;

const broadcastSocket = new WebSocket("ws://localhost:5000");

const run = async () => {
    if (isRecording) {
        if (transcriptionSocket) {
            transcriptionSocket.send(JSON.stringify({terminate_session: true}));
            transcriptionSocket.close();
            transcriptionSocket = null;
        }

        if (recorder) {
            recorder.pauseRecording();
            recorder = null;
        }
    } else {
        const response = await fetch('http://localhost:5000/token'); // get temp session token from server.js (backend)
        const data = await response.json();

        if(data.error){
            alert(data.error)
        }

        const { token } = data;

        // establish wss with AssemblyAI (AAI) at 16000 sample rate
        transcriptionSocket = await new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);

        // handle incoming messages to display transcription to the DOM
        const texts = {};
        transcriptionSocket.onmessage = (message) => {
            let msg = '';
            const res = JSON.parse(message.data);
            texts[res.audio_start] = res.text;
            const keys = Object.keys(texts);
            keys.sort((a, b) => a - b);
            for (const key of keys) {
                if (texts[key]) {
                    msg += ` ${texts[key]}`;
                }
            }
            messageEl.innerText = msg;
            broadcastSocket.send(msg);
        };

        transcriptionSocket.onerror = (event) => {
            console.error(event);
            transcriptionSocket.close();
        }

        transcriptionSocket.onclose = event => {
            console.log(event);
            transcriptionSocket = null;
        }

        transcriptionSocket.onopen = () => {
            // once socket is open, begin recording
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    recorder = new RecordRTC(stream, {
                        type: 'audio',
                        mimeType: 'audio/webm;codecs=pcm', // endpoint requires 16bit PCM audio
                        recorderType: StereoAudioRecorder,
                        timeSlice: 250, // set 250 ms intervals of data that sends to AAI
                        desiredSampRate: 16000,
                        numberOfAudioChannels: 1, // real-time requires only one channel
                        bufferSize: 4096,
                        audioBitsPerSecond: 128000,
                        ondataavailable: (blob) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                                const base64data = reader.result;

                                // audio data must be sent as a base64 encoded string
                                if (transcriptionSocket) {
                                    transcriptionSocket.send(JSON.stringify({ audio_data: base64data.split('base64,')[1] }));
                                }
                            };
                            reader.readAsDataURL(blob);
                        },
                    });

                    recorder.startRecording();
                })
                .catch((err) => console.error(err));
        };
    }

    isRecording = !isRecording;
    buttonEl.innerText = isRecording ? 'Stop' : 'Start';
};

buttonEl.addEventListener('click', () => run());
