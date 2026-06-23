"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const createMeeting = () => {
    const roomId = Math.random().toString(36).substring(2, 10);
    router.push(`/meeting/${roomId}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-6">
        LinkMeet
      </h1>

      <p className="mb-6">
        Secure video meetings with shareable links
      </p>

      <button
        onClick={createMeeting}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Create Meeting
      </button>
    </main>
  );
}