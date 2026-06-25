'use client';

import { useEffect, useRef } from 'react';

interface VideoTileProps {
  stream: MediaStream | null;
  label: string;
  muted?: boolean;
  isVideoOff?: boolean;
}

export default function VideoTile({
  stream,
  label,
  muted = false,
  isVideoOff = false,
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative w-full h-full bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center min-h-[240px]">
      {isVideoOff || !stream ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-slate-600 flex items-center justify-center text-3xl font-bold text-white">
            {label.charAt(0).toUpperCase()}
          </div>
          <span className="text-slate-400 text-sm">Camera off</span>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-medium">
        {label}
      </div>
    </div>
  );
}