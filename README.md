# LinkMeet — WebRTC Video Calling App

A real time 1 to 1 video calling app built with Next.js, WebRTC, and Socket.io.

## Features
Live video & audio between two peers
Shareable room links
Mute / unmute controls
Camera on / off toggle
Instant connection, no account needed

## Getting Started

### Run locally
```bash
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Run with Docker
```bash
docker build -t linkmeet .
docker run -p 3000:3000 linkmeet
```

## Team
Person A — Project setup & signaling server
Person B — WebRTC hook, VideoTile component & meeting room page
Person C — Home page & testing