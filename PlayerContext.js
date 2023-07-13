import { createContext, useContext, useState } from "react";

const Player = createContext();

export const PlayerContext = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);

  return (
    <Player.Provider
      value={{
        currentTrack,
        setCurrentTrack,
      }}
    >
      {children}
    </Player.Provider>
  );
};

export const useTrackContext = () => useContext(Player);
