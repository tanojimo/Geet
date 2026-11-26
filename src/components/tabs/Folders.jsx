import { useEffect, useState } from "react";
import FolderCard from "../cards/FolderCard";

const Folders = ({
  setSongData,
  playerInfo,
  playing,
  setPlaying,
  handlePlayerInfo,
}) => {
  const [folders, setFolders] = useState([]);
  const [individualFolder, setIndividualFolder] = useState(0);
  const [songsPerFolder, setSongsPerFolder] = useState([]);
  useEffect(() => {
    async function getFolderData() {
      const folder = await window.musicAPI.folderData();
      setFolders(folder);
      console.log("Found Folders:", folder);
    }
    getFolderData();
  }, []);
  const handleSongs = async () => {
    try {
      const result = await window.electronAPI.folderPrompt();
      console.log("Wrote DB: ", result);
      const data = await window.musicAPI.songData();
      setSongData(data);
      console.log(data);
      const folder = await window.musicAPI.folderData();
      setFolders(folder);
      console.log(folder);
    } catch (error) {
      console.error("Failed: ", error);
    }
  };
  return (
    <div className="p-7 flex flex-col gap-4">
      {individualFolder == -1 ? (
        <div className="w-full h-full flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-2xl/none font-bold pt-2">Music Folders</p>
            <div>
              <div
                className="group px-2 py-1 flex gap-2 items-center border-textgrey hover:border-accent border-4 rounded-3xl duration-75 cursor-pointer"
                onClick={handleSongs}
              >
                <svg
                  width="16"
                  viewBox="0 0 43 43"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-text group-hover:text-accent duration-75"
                >
                  <path
                    d="M3.04169 21.2917H39.5417M21.2917 3.04169V39.5417"
                    stroke="currentColor"
                    strokeWidth="6.08333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-text text-sm pt-0.5 group-hover:text-text">
                  Add Folder
                </p>
              </div>
            </div>
          </div>
          {folders.map((val, i) => (
            <div
              className="bg-bg100 h-12 rounded-lg flex items-center gap-2 pl-2 hover:bg-bg200 duration-75 cursor-pointer"
              key={val.id}
              onClick={async () => {
                setIndividualFolder(i);
                setSongsPerFolder([]);
                const song = await window.electronAPI.getSongFromFolder(i + 1);
                setSongsPerFolder(song);
                console.log("Songs: ", song);
              }}
            >
              <div className="aspect-square h-full flex items-center justify-center">
                <img src="/folder.svg" alt="" className="w-9" />
              </div>
              <p className="mt-1">{val.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <FolderCard
          folders={folders}
          index={individualFolder}
          songsPerFolder={songsPerFolder}
          setIndividualFolder={setIndividualFolder}
          playerInfo={playerInfo}
          playing={playing}
          setPlaying={setPlaying}
          handlePlayerInfo={handlePlayerInfo}
        />
      )}
    </div>
  );
};

export default Folders;
