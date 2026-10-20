import { useEffect } from "react";

const HomeMusicCard = ({ data }) => {
  useEffect(() => {
    console.log(`Moved Song ${data.title} to Card: `, data);
  }, [data]);
  return (
    <div
      style={
        data.cover ? { backgroundImage: `url("${data.cover}")` } : undefined
      }
      className="relative w-full h-38 rounded-2xl bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>
      <div className="relative z-10 h-full grid grid-rows-2">
        <div className="row-span-1"></div>
        <div className="row-span-1 grid grid-cols-6 items-end px-3 pb-3">
          <div className="flex flex-col col-span-5">
            <p className="text-xl font-bold whitespace-nowrap overflow-hidden text-ellipsis">
              {data.title}
            </p>
            <p className="text-sm">{data.artists.join(", ")}</p>
          </div>
          <div className="flex justify-center w-full">
            <div className="w-7 h-7 bg-text rounded-full flex justify-center items-center mb-2">
              <img
                src="/play.svg"
                alt="play"
                className="w-2.5 ml-0.5 bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMusicCard;
