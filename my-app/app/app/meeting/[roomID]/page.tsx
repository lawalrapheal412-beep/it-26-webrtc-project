import VideoTile from "@/components/VideoTile";

export default async function MeetingPage({
    params,
}: {
    params: Promise<{ roomId: string }>;
}) {
    const { roomId } = await params;

    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-4">
                Meeting Room
            </h1>

            <p className="mb-8">
                Room ID: {roomId}
            </p>

            <VideoTile />
        </main>
    );
}