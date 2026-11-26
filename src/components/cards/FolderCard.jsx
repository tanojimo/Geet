const FolderCard = ({
  folders,
  index,
  songsPerFolder,
  setIndividualFolder,
  playerInfo,
  playing,
  setPlaying,
  handlePlayerInfo,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <svg
          width="800px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 text-textgrey hover:text-white duration-75"
          onClick={() => setIndividualFolder(-1)}
        >
          <path
            d="M6 12H18M6 12L11 7M6 12L11 17"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p
          className="text-2xl/none font-bold pt-2"
          onClick={() => console.log(songsPerFolder)}
        >
          {folders[index]?.name}
        </p>
      </div>
      <div className="w-full">
        {songsPerFolder.map((val, i) => (
          <div
            className={`${i % 2 == 0 ? "bg-bg100" : "bg-bg"} h-12 grid grid-cols-6 gap-4 px-5 hover:bg-bg200 duration-75`}
          >
            <div className="col-span-3 flex flex-row gap-3 items-center h-full">
              <div className="w-5 h-full flex justify-center items-center">
                <p>{i + 1}</p>
              </div>
              <div
                className="h-[80%] aspect-square rounded-xs flex justify-center items-center group"
                style={
                  val.cover && {
                    backgroundImage: `url("${val.cover}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }
                }
              >
                <div
                  className="w-full h-full flex justify-center items-center group-hover:bg-[rgba(0,0,0,0.3)] duration-75 cursor-pointer"
                  onClick={() => {
                    handlePlayerInfo("musicId", val.id);
                    handlePlayerInfo("currentDuration", 0);
                    setPlaying(true);
                  }}
                >
                  {playerInfo.musicId == val.id && playing ? (
                    <svg
                      width="25"
                      viewBox="0 0 28 43"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 hidden group-hover:block"
                    >
                      <path
                        d="M4.5 4.5V38.5M23.5 4.5V38.5"
                        stroke-width="9"
                        stroke-linecap="round"
                        stroke="currentColor"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="45"
                      viewBox="0 0 39 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 hidden group-hover:block"
                    >
                      <path
                        d="M5.4575 0.452336C4.31438 -0.174539 2.93156 -0.146883 1.80688 0.516867C0.682188 1.18062 0 2.38827 0 3.68812V37.6131C0 38.913 0.691407 40.1206 1.80688 40.7844C2.92234 41.4481 4.31438 41.4758 5.4575 40.8489L36.4325 23.8864C37.6125 23.2411 38.35 21.9966 38.35 20.6506C38.35 19.3047 37.6125 18.0601 36.4325 17.4148L5.4575 0.452336Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <p className="mt-1 select-none">{val.title}</p>
            </div>
            <div className="col-span-2 flex items-center select-none">
              <p className="text-xs">{val.artists.join(", ")}</p>
            </div>
            <div className="col-span-1 flex items-center justify-end select-none">
              <p className="text-xs">{`${Math.floor(val.duration / 60)}:${Math.floor(val.duration) % 60}`}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderCard;
