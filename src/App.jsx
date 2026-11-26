import Controls from "./components/Controls";
import Header from "./components/Header";
import Main from "./components/Main";
import { useEffect, useRef, useState } from "react";

const App = () => {
  const audioRef = useRef(new Audio());

  const [current, setCurrent] = useState(0);
  const [songData, setSongData] = useState([]);

  const [playing, setPlaying] = useState(false);
  const [playerInfo, setPlayerInfo] = useState({
    musicId: null,
    shuffle: false,
    repeat: 0,
    currentDuration: 0,
    volume: 0,
    queue: [],
  });

  const handlePlayerInfo = (infoName, info) => {
    setPlayerInfo((prev) => {
      const update = { ...prev, [infoName]: info };
      window.electronAPI.setPlayerInfo(update);
      // window.electronAPI.setPlayerInfo({
      //   musicId: null,
      //   shuffle: false,
      //   repeat: 0,
      //   currentDuration: 0,
      //   volume: 0,
      //   queue: [],
      // });

      return update;
    });
  };

  useEffect(() => {
    const ref = async () => {
      const info = await window.electronAPI.getPlayerInfo();
      const data = await window.musicAPI.songData();
      setPlayerInfo(info);
      setSongData(data);
    };
    ref();
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header current={current} setCurrent={setCurrent} />
      <Main
        current={current}
        playerInfo={playerInfo}
        handlePlayerInfo={handlePlayerInfo}
        songData={songData}
        setSongData={setSongData}
        playing={playing}
        setPlaying={setPlaying}
      />
      <Controls
        playerInfo={playerInfo}
        handlePlayerInfo={handlePlayerInfo}
        setSongData={setSongData}
        songData={songData}
        playing={playing}
        setPlaying={setPlaying}
        audioRef={audioRef}
      />
    </div>
  );
};

export default App;
