import Form from "@/components/Form";
import { useStore } from "@/lib/zustand";
import { USER_INFO_ROUTE } from "@/requests/routes";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const PageModule: React.FC<{
  children?: React.ReactNode;
  title?: string;
  description?: string;
}> = ({ children, title, description }) => {
  const { user, setUser, setPlaylists, currentSong, playing, setPlaying } =
    useStore();

  const audioRef = useRef<HTMLAudioElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      const fun = async () => {
        await axios
          .get(USER_INFO_ROUTE, { withCredentials: true })
          .then((res) => {
            setPlaylists(res.data.playlists);
            setUser(res.data);
            router.replace("/");
          })
          .catch((err: any) => {
            alert(err?.response?.data?.err);
          });
      };

      fun();
    }
  }, []);

  useEffect(() => {
    if (playing && currentSong) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 1000);
    }
  }, [playing, currentSong]);

  if (!user) {
    return (
      <main
        className={`w-full flex flex-col items-center justify-center bg-gray-800 min-h-screen px-4`}
      >
        <Form />
      </main>
    );
  }

  return (
    <main
      className={`w-full flex flex-col items-center justify-start bg-gray-800 min-h-screen py-20`}
    >
      {currentSong ? (
        <audio id="song" ref={audioRef}>
          <source src={`/music/${currentSong.file_id}.mp3`} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      ) : null}

      <div className="w-full max-w-[1200px] flex flex-col px-4">
        {children}

        {currentSong ? (
          <div className="flex flex-col items-center justify-center p-4 bg-gray-900 rounded-xl border mt-4 sticky bottom-0 z-20">
            <div className="flex items-center justify-center  gap-4">
              <button>
                <ArrowLeftCircleIcon className="text-white h-8" />
              </button>
              <button
                onClick={() => {
                  setPlaying(!playing);
                  if (playing && audioRef.current) {
                    audioRef.current.pause();
                  }
                }}
              >
                {playing ? (
                  <PauseIcon className="text-white h-12" />
                ) : (
                  <PlayIcon className="text-white h-12" />
                )}
              </button>
              <button>
                <ArrowRightCircleIcon className="text-white h-8" />
              </button>
            </div>

            <p className="text-pink-500 mt-2">{currentSong.title}</p>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default PageModule;
