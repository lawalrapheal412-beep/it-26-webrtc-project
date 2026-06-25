"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  const createMeeting = () => {
    const newRoomId = Math.random().toString(36).substring(2, 10);
    router.push(`/meeting/${newRoomId}`);
  };

  const joinMeeting = () => {
    if (!roomId.trim()) return;
    router.push(`/meeting/${roomId.trim()}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-6 w-full max-w-sm">
        
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl font-bold text-white">LinkMeet</h1>
          <p className="text-slate-400 text-sm text-center">
            Secure video meetings with shareable links
          </p>
        </div>

        <button
          onClick={createMeeting}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3 px-4 rounded-xl transition"
        >
          Create Meeting
        </button>

        <div className="flex items-center w-full gap-2">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="text-xs text-slate-500">or join existing</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        <div className="flex w-full gap-2">
          <input
            type="text"
            placeholder="Enter room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && joinMeeting()}
            className="flex-1 bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={joinMeeting}
            className="bg-slate-700 hover:bg-slate-600 active:scale-[0.98] text-white font-semibold py-2.5 px-4 rounded-xl transition text-sm"
          >
            Join
          </button>
        </div>

      </div>
    </main>
  );
}