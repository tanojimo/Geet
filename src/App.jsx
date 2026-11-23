import Controls from "./components/Controls";
import Header from "./components/Header";
import Main from "./components/Main";
import { useEffect, useState } from "react";

const App = () => {
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
    playing: false,
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
      setPlayerInfo(info);
    };
    ref();
  }, []);

  useEffect(() => {
    async function getSongData() {
      const data = await window.musicAPI.songData();
      setSongData(data);
    }
    getSongData();
  }, []);

  // useEffect(() => {
  //   console.log(songData);
  // }, []);

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
        songData={songData}
        playing={playing}
        setPlaying={setPlaying}
      />
    </div>
  );
};

export default App;
