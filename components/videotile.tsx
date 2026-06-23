"use client";

import { useEffect, useRef } from "react";

export default function VideoTile() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        async function startCamera() {
            try {
                const stream =
                    await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: true,
                    });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error(error);
            }
        }

        startCamera();
    }, []);

    return (
        <div className="border rounded-xl p-4 w-fit">
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-[500px] rounded-lg"
            />
        </div>
    );
}