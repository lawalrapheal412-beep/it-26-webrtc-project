'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun.cloudflare.com:3478' },
  ],
};

export function useWebRTC(roomId: string) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connected, setConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const politeRef = useRef(false);
  const makingOfferRef = useRef(false);
  const ignoreOfferRef = useRef(false);
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);

  useEffect(() => {
    let stream: MediaStream;

    const init = async () => {
      // 1. Get media
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
      } catch (err) {
        console.error('Camera/mic access denied:', err);
        setPermissionDenied(true);
        stream = new MediaStream();
      }

      // 2. Connect socket
      const socket = io();
      socketRef.current = socket;

      // 3. Create peer connection
      const pc = new RTCPeerConnection(ICE_SERVERS);
      pcRef.current = pc;

      // 4. Add tracks if we have them
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // 5. ICE candidates
      pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
          socket.emit('ice-candidate', { roomId, candidate });
        }
      };

      // 6. Remote stream
      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      // 7. Connection state
      pc.onconnectionstatechange = () => {
        setConnected(pc.connectionState === 'connected');
      };

      // 8. Join room
      socket.emit('join-room', roomId);

      // 9. room-joined tells us if we are polite (second to join)
      socket.on('room-joined', (isPolite: boolean) => {
        politeRef.current = isPolite;
      });

      // 10. When someone joins, impolite peer creates offer
      socket.on('user-joined', async () => {
        if (politeRef.current) return;
        try {
          makingOfferRef.current = true;
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('offer', { roomId, offer: pc.localDescription });
        } catch (err) {
          console.error('Offer error:', err);
        } finally {
          makingOfferRef.current = false;
        }
      });

      // 11. Handle incoming offer
      socket.on('offer', async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
        const offerCollision =
          makingOfferRef.current || pc.signalingState !== 'stable';

        ignoreOfferRef.current = !politeRef.current && offerCollision;
        if (ignoreOfferRef.current) return;

        try {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('answer', { roomId, answer: pc.localDescription });

          for (const candidate of pendingCandidates.current) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
          pendingCandidates.current = [];
        } catch (err) {
          console.error('Offer handling error:', err);
        }
      });

      // 12. Handle incoming answer
      socket.on('answer', async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
        if (pc.signalingState === 'stable') return;
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));

          for (const candidate of pendingCandidates.current) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
          pendingCandidates.current = [];
        } catch (err) {
          console.error('Answer error:', err);
        }
      });

      // 13. Handle ICE candidates
      socket.on('ice-candidate', async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
        if (!pc.remoteDescription) {
          pendingCandidates.current.push(candidate);
          return;
        }
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          if (!ignoreOfferRef.current) console.error('ICE error:', err);
        }
      });
    };

    init();

    return () => {
      pcRef.current?.close();
      stream?.getTracks().forEach((track) => track.stop());
      socketRef.current?.disconnect();
    };
  }, [roomId]);

  const toggleAudio = useCallback(() => {
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsMuted((prev) => !prev);
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    localStream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsVideoOff((prev) => !prev);
  }, [localStream]);

  return {
    localStream,
    remoteStream,
    connected,
    isMuted,
    isVideoOff,
    permissionDenied,
    toggleAudio,
    toggleVideo,
  };
}