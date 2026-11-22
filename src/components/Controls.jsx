import { useState } from "react";

const Controls = () => {
  const [volume, setVolume] = useState(70);
  const [playback, setPlayback] = useState(70);

  return (
    <div className="h-23 shrink-0 bg-bg100 grid grid-cols-7 px-2">
      <div className="col-span-2 flex items-center gap-3">
        <img src="/cover.jpg" alt="cover" className="w-18 h-18 rounded-xl" />
        <div>
          <p className="text-2xl/6 mt-1.5">Around The World</p>
          <p className="text-sm text-gray-300">Artist Name</p>
        </div>
      </div>
      <div className="col-span-3 flex-col flex justify-center items-center gap-1">
        <div className="grid grid-cols-7 flex-row gap-4">
          <div className="col-span-3 flex flex-row items-center gap-6 justify-end">
            {/* Liked */}
            <div className="group">
              <svg
                width="20"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-textgrey group-hover:text-text duration-75"
              >
                <path
                  d="M10 18L1.57733 9.39384C0.560222 8.35457 0 6.97266 0 5.50266C0 4.03287 0.560222 2.65097 1.57756 1.6117C2.59467 0.572427 3.94711 0 5.38556 0C6.824 0 8.17645 0.572427 9.19378 1.6117L10 2.43571L10.8067 1.6117C11.8236 0.572427 13.176 0 14.6147 0C16.0533 0 17.4058 0.572427 18.4227 1.61192C19.4398 2.65097 20 4.03287 20 5.50266C20 6.97266 19.4398 8.35457 18.4224 9.39361L10 18ZM5.38533 1.81651C4.42178 1.81651 3.51578 2.19979 2.83444 2.89619C2.15311 3.59237 1.77778 4.51811 1.77778 5.50266C1.77778 6.4872 2.15311 7.41317 2.83444 8.10912L10 15.4308L17.1653 8.10934C17.8471 7.41317 18.2222 6.48743 18.2222 5.50266C18.2222 4.51811 17.8471 3.59237 17.1656 2.89619C16.4842 2.20002 15.578 1.81651 14.6147 1.81651C13.6513 1.81651 12.7451 2.19979 12.0638 2.89619L10 5.00471L7.93644 2.89619C7.25489 2.20002 6.34911 1.81651 5.38533 1.81651Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            {/* Shuffle */}
            <div className="group">
              <svg
                width="20"
                viewBox="0 0 55 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-textgrey group-hover:text-text duration-75"
              >
                <path
                  d="M3.30359 35.0179H10.5324C14.2458 35.0179 17.6869 33.0696 19.5974 29.8854L29.2956 13.7218C31.2061 10.5376 34.6471 8.5893 38.3606 8.5893H50.875M45.5893 13.875L50.875 8.5893L45.5893 3.30359"
                  stroke-width="6.60714"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke="currentColor"
                />
                <path
                  d="M3.30359 8.58936H10.5324C13.4253 8.58936 16.153 9.77182 18.1204 11.7999M50.875 35.0179H38.3606C35.4677 35.0179 32.74 33.8355 30.7724 31.8074M45.5893 29.7322L50.875 35.0179L45.5893 40.3036"
                  stroke-width="6.60714"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke="currentColor"
                />
              </svg>
            </div>
            {/* Backward */}
            <div className="group">
              <svg
                width="14"
                viewBox="0 0 33 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-textgrey group-hover:text-text duration-75"
              >
                <path
                  d="M28.413 6.65055L11.1571 19.1611C10.5949 19.5687 10.609 20.4111 11.1846 20.7996L28.4405 32.4474C29.1047 32.8957 30 32.4198 30 31.6185V7.46016C30 6.64356 29.0742 6.17123 28.413 6.65055Z"
                  fill="currentColor"
                />
                <path
                  d="M3 3V35M11.1571 19.1611L28.413 6.65055C29.0742 6.17123 30 6.64356 30 7.46016V31.6185C30 32.4198 29.1047 32.8957 28.4405 32.4474L11.1846 20.7996C10.609 20.4111 10.5949 19.5687 11.1571 19.1611Z"
                  stroke-width="6"
                  stroke-linecap="round"
                  stroke="currentColor"
                />
              </svg>
            </div>
          </div>
          <div className="col-span-1 w-9 h-9 mx-3 bg-accent rounded-full flex justify-center items-center">
            <svg
              width="18"
              viewBox="0 0 39 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1 mt-px text-accent-lightDark"
            >
              <path
                d="M5.4575 0.452336C4.31438 -0.174539 2.93156 -0.146883 1.80688 0.516867C0.682188 1.18062 0 2.38827 0 3.68812V37.6131C0 38.913 0.691407 40.1206 1.80688 40.7844C2.92234 41.4481 4.31438 41.4758 5.4575 40.8489L36.4325 23.8864C37.6125 23.2411 38.35 21.9966 38.35 20.6506C38.35 19.3047 37.6125 18.0601 36.4325 17.4148L5.4575 0.452336Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="col-span-3 flex items-center gap-6 justify-baseline">
            {/* Forward */}
            <div className="group -scale-x-100">
              <svg
                width="14"
                viewBox="0 0 33 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-textgrey group-hover:text-text duration-75"
              >
                <path
                  d="M28.413 6.65055L11.1571 19.1611C10.5949 19.5687 10.609 20.4111 11.1846 20.7996L28.4405 32.4474C29.1047 32.8957 30 32.4198 30 31.6185V7.46016C30 6.64356 29.0742 6.17123 28.413 6.65055Z"
                  fill="currentColor"
                />
                <path
                  d="M3 3V35M11.1571 19.1611L28.413 6.65055C29.0742 6.17123 30 6.64356 30 7.46016V31.6185C30 32.4198 29.1047 32.8957 28.4405 32.4474L11.1846 20.7996C10.609 20.4111 10.5949 19.5687 11.1571 19.1611Z"
                  stroke-width="6"
                  stroke-linecap="round"
                  stroke="currentColor"
                />
              </svg>
            </div>
            {/* Repeat */}
            <div className="group">
              <svg
                width="18"
                viewBox="0 0 54 54"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-textgrey group-hover:text-text duration-75"
              >
                <path
                  d="M24.5001 17.15L31.8501 9.80001L24.5001 2.45001M31.8501 9.80001H14.2101C10.0937 9.80001 8.03549 9.80001 6.46325 10.6011C5.08025 11.3058 3.95584 12.4302 3.25117 13.8132C2.45007 15.3854 2.45007 17.4436 2.45007 21.56V35.525C2.45007 36.6628 2.45007 37.2317 2.51296 37.7094C2.94718 41.0076 5.54251 43.6029 8.8407 44.037C9.31833 44.1 9.88724 44.1 11.0251 44.1M22.0501 44.1H39.6901C43.8066 44.1 45.8646 44.1 47.437 43.2989C48.82 42.5942 49.9443 41.4699 50.6489 40.0869C51.4501 38.5145 51.4501 36.4565 51.4501 32.34V18.375C51.4501 17.2372 51.4501 16.6683 51.3871 16.1906C50.953 12.8925 48.3577 10.2971 45.0595 9.8629C44.5817 9.80001 44.0129 9.80001 42.8751 9.80001M29.4001 36.75L22.0501 44.1L29.4001 51.45"
                  stroke="currentColor"
                  strokeWidth="4.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {/* Lyrics */}
            <div className="group">
              <svg
                width="17"
                viewBox="0 0 56 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-textgrey group-hover:text-text duration-75"
              >
                <path
                  d="M3.08334 40.0833H33.9167M3.08334 27.75H52.4167M3.08334 15.4166H33.9167M3.08334 3.08331H52.4167"
                  stroke="currentColor"
                  strokeWidth="6.16667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-3">
          <p>00.00</p>
          <input
            type="range"
            min={0}
            max={100}
            defaultValue={70}
            onChange={(e) => setPlayback(e.target.value)}
            className="playbackSlider"
            style={{
              "--value": `${playback}%`,
              "--multiplier": playback,
            }}
          />
          <p>03.03</p>
        </div>
      </div>
      <div className="col-span-2 flex justify-end items-center">
        <img src="/volume.svg" alt="volume slider" className="w-5 mr-3" />
        <input
          type="range"
          min={0}
          max={100}
          defaultValue={70}
          onChange={(e) => setVolume(e.target.value)}
          className="volumeSlider"
          style={{
            "--value": `${volume}%`,
          }}
        />
      </div>
    </div>
  );
};

export default Controls;
