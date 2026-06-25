'use client';

import { useParams, useRouter } from 'next/navigation';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useState } from 'react';
import VideoTile from '@/components/VideoTile';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Copy, CheckCircle
} from 'lucide-react';

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomID as string;
  const [copied, setCopied] = useState(false);

  const {
    localStream,
    remoteStream,
    connected,
    isMuted,
    isVideoOff,
    toggleAudio,
    toggleVideo,
  } = useWebRTC(roomId);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${connected ? 'bg-green-400' : 'bg-yellow-400'}`} />
          <span className="text-slate-300 text-sm">
            {connected ? 'Connected' : 'Waiting for someone to join...'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-lg transition"
        >
          {copied
            ? <CheckCircle size={14} className="text-green-400" />
            : <Copy size={14} />}
          {copied ? 'Copied!' : `Room: ${roomId}`}
        </button>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <VideoTile
          stream={localStream}
          label="You"
          muted={true}
          isVideoOff={isVideoOff}
        />
        <VideoTile
          stream={remoteStream}
          label="Guest"
          isVideoOff={false}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 py-6 border-t border-slate-800">
        <button
          onClick={toggleAudio}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition active:scale-95 ${
            isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-600'
          }`}
        >
          {isMuted
            ? <MicOff size={22} className="text-white" />
            : <Mic size={22} className="text-white" />}
        </button>

        <button
          onClick={handleLeave}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition active:scale-95"
        >
          <PhoneOff size={24} className="text-white" />
        </button>

        <button
          onClick={toggleVideo}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition active:scale-95 ${
            isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-600'
          }`}
        >
          {isVideoOff
            ? <VideoOff size={22} className="text-white" />
            : <Video size={22} className="text-white" />}
        </button>
      </div>
    </main>
  );
}