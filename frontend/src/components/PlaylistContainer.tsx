import { useStore } from "@/lib/zustand";
import { PLAYLIST_ROUTE } from "@/requests/routes";
import { PlusIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SongButton } from "./HomeContainer";

const PlaylistContainer = () => {
  const router = useRouter();

  const { id: playlistId } = router.query;

  const { user, playlists, setPlaylists } = useStore();

  const [currentAlbum, setcurrentAlbum] = useState<
    | ({
        songs: {
          song: {
            id: number;
            title: string;
            description: string | null;
            length: string | null;
            file_id: string | null;
          };
        }[];
      } & {
        id: number;
        title: string;
        description: string | null;
        userId: number;
      })
    | null
  >(null);

  useEffect(() => {
    if (playlistId && typeof playlistId === "string") {
      const fun = async () => {
        await axios
          .get(`${PLAYLIST_ROUTE}/${playlistId}`)
          .then((res) => {
            setcurrentAlbum(res.data);
          })
          .catch((err: any) => {
            alert(err?.response?.data?.err);
          });
      };

      fun();
    }
  }, [playlistId]);

  return (
    <section className="flex flex-col">
      <Link href="/" className="mb-2 text-lg underline text-white">Uz sākumu</Link>

      <div className="flex flex-col w-full gap-4 ">
        <div className="w-full p-4 bg-gray-900 rounded-xl border flex">
          {currentAlbum && (
            <div className="flex flex-col gap-4 flex-1">
              <h1 className="text-4xl text-white">{currentAlbum.title}</h1>
              <p className="text-gray-200">{currentAlbum.description}</p>
            </div>
          )}

          <p className="text-pink-500 underline">{user?.username}</p>
        </div>

        <div className="flex flex-col min-h-80 bg-gray-900 flex-1 rounded-xl border overflow-hidden">
          <div className="w-full h-12 bg-gray-900/90 border-b text-white px-4 flex items-center justify-between">
            <p>Dziesmas</p>
          </div>

          {currentAlbum?.songs?.length ? (
            <div className="flex flex-col w-full">
              {currentAlbum.songs.map((song, i) => (
                <SongButton {...song.song} key={i} />
              ))}
            </div>
          ) : (
            <div className="w-full items-center justify-center flex-col gap-2 flex h-full p-4 text-center flex-1">
              <p className="text-white">Pagaidām nav nevienas dziesmas</p>

              <Link href="/" className="text-pink-500 underline">
                Pievienot
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PlaylistContainer;
