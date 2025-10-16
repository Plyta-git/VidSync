import ReactPlayer from 'react-player';

export const VideoPlayer = () => {
  return (
    <div className="relative">
      <div className="absolute z-50 left-4 top-4 text-base-content backdrop-blur-xl p-2  bg-black/50">
        Zmiana xyz
      </div>
      <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
        <span className="badge badge-success badge-sm px-3">FIX</span>
      </div>
      <ReactPlayer
        className=" aspect-video"
        src="https://www.youtube.com/watch?v=LXb3EKWsInQ"
        width="100%"
        height="100%"
        controls
      />
    </div>
  );
};
