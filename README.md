# socket-transcriber
This project is built for the DeltaHacks 8 hackathon

## Setup
To start the project you will first need to get an API key from AssemblyAI which is the service that handles the audio to text transcriptions and add it in the `.env` file as the `API_TOKEN`

Next install the dependencies with
```
npm i
```

Now we are ready to start the server with
```
npm run dev
```

Navigate to `http://localhost:5000` and you will get prompted with a page asking you to input the room Id and if you are a speaker or listening.

If you are a speaker you simply click the start button in the next room and start speaking, when you are finished speaking click the button again to stop the transcription.
