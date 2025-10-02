// LoadingFilesLottie.tsx

import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";

interface LoadingFilesLottieProps {
  src: string;
  height?: number;
  width?: number;
}

const LottieFiles: React.FC<LoadingFilesLottieProps> = ({
  src,
  height = 250,
  width = 250,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: height,
      }}
    >
      <Player
        src={src}
        autoplay
        loop
        style={{ height: `${height}px`, width: `${width}px` }}
      />
    </div>
  );
};

export default LottieFiles;
