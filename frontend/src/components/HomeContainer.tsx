import { useStore } from "@/lib/zustand";
import {
  ADD_TO_PLAYLIST_ROUTE,
  LOGOUT_ROUTE,
  SONG_ROUTE,
} from "@/requests/routes";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/16/solid";
import {
  Bars2Icon,
  ListBulletIcon,
  PlayCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Song } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const HomeContainer = () => {
  const {
    user,
    playlists,
    songs,
    setSongs,
    setUser,
    setPlaying,
    setPlaylists,
    setCurrentSong,
  } = useStore();

  useEffect(() => {
    if (!songs) {
      const fun = async () => {
        await axios
          .get(SONG_ROUTE, { withCredentials: true })
          .then((res) => {
            setSongs(res.data);
          })
          .catch((err: any) => {
            alert(err?.response?.data?.err);
          });
      };

      fun();
    }
  }, []);

  const handleLogout = async () => {
    await axios
      .post(LOGOUT_ROUTE, {}, { withCredentials: true })
      .then((_res) => {
        setUser(null);
        setCurrentSong(null);
        setSongs(null);
        setPlaying(false);
        setPlaylists(null);
      });
  };

  return (
    <section className="flex flex-col w-full gap-4 ">
      <div className="w-full p-4 bg-gray-900 rounded-xl border flex items-center justify-between">
        <h1 className="text-4xl text-white">Sveicināts {user?.username}!</h1>

        <button onClick={handleLogout}>
          <ArrowLeftEndOnRectangleIcon className="text-pink-500 h-6" />
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col min-h-80 bg-gray-900 w-full max-w-[250px] border rounded-xl overflow-hidden">
          <div className="w-full h-12 bg-gray-900/90 border-b text-white px-4 flex items-center justify-between">
            <p>Albumi</p>

            <Link href="/new-album">
              <PlusIcon className="text-white h-5" />
            </Link>
          </div>

          {playlists?.length ? (
            <div className="flex flex-col text-white">
              {playlists.map((p, i) => (
                <Link
                  href={`/album/${p.id}`}
                  key={i}
                  className="flex w-full gap-1 items-center justify-start p-2 hover:bg-gray-800 min-h-12"
                >
                  <div className="flex-1 flex flex-col items-start justify-center overflow-hidden">
                    <p>{p.title}</p>

                    <small className="truncate w-full text-gray-400">
                      {p.description}
                    </small>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 text-gray-100">
              <p>Pagaidām nav neviena albuma</p>
            </div>
          )}
        </div>
        <div className="flex flex-col min-h-80 bg-gray-900 flex-1 rounded-xl border overflow-hidden">
          <div className="w-full h-12 bg-gray-900/90 border-b text-white px-4 flex items-center justify-between">
            <p>Dziesmas</p>
          </div>

          {songs?.length ? (
            <div className="flex flex-col w-full">
              {songs.map((song, i) => (
                <SongButton {...song} key={i} />
              ))}
            </div>
          ) : (
            <div className=""></div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeContainer;

export const SongButton: React.FC<Song> = ({ ...props }) => {
  const { currentSong, setCurrentSong, playlists, setPlaylists } = useStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState<number[]>([]);

  const handleAddToPlaylist = async () => {
    await axios
      .post(ADD_TO_PLAYLIST_ROUTE, {
        songId: props.id,
        playlistIds: selectedPlaylists,
      })
      .then((res) => {
        setSelectedPlaylists([]);
        setMenuOpen(false);
        setPlaylists(res.data.playlists);
      })
      .catch((err: any) => {
        alert(err?.response?.data?.err);
      });
  };

  return (
    <div className="w-full min-h-12 flex items-center justify-start text-gray-200 px-2 gap-4 hover:bg-gray-800 group">
      {menuOpen ? (
        <div className="w-full h-full absolute top-0 left-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="w-full max-w-[600px] p-4 rounded-md bg-gray-800 border gap-4 flex flex-col">
            <strong>Pievienot albumiem</strong>

            <select
              onChange={(e) =>
                e.target.value
                  ? setSelectedPlaylists(
                      Array.from(
                        new Set([...selectedPlaylists, Number(e.target.value)])
                      )
                    )
                  : null
              }
            >
              <option value=""></option>
              {playlists?.map((p, i) => (
                <option key={i} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>

            <div className="flex gap-2 flex-wrap">
              {selectedPlaylists.map((pl, i) => (
                <p
                  className="text-pink-500 hover:line-through cursor-pointer"
                  key={i}
                  onClick={() =>
                    setSelectedPlaylists(
                      selectedPlaylists.filter((p) => p !== pl)
                    )
                  }
                >
                  #{playlists?.find((p) => p.id === pl)?.title}
                </p>
              ))}
            </div>

            <div className="flex w-full gap-4 items-center justify-start mt-2">
              <button
                className="bg-gray-800 border-2 border-pink-500 flex-1 py-3 max-w-[200px] rounded-full text-pink-500"
                onClick={handleAddToPlaylist}
              >
                Saglabāt
              </button>

              <button
                className="text-pink-500 underline"
                onClick={() => {
                  setSelectedPlaylists([]);
                  setMenuOpen(false);
                }}
              >
                Atpakaļ
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        className="flex flex-1 h-full items-center justify-between"
        onClick={() => setCurrentSong(props)}
      >
        <p className="text-white">{props.title}</p>

        <PlayCircleIcon
          className={`h-6 text-pink-500 ${
            currentSong?.id !== props.id ? "hidden group-hover:block" : ""
          }`}
        />
      </button>

      <button
        className="z-10"
        onClick={() => {
          setMenuOpen(true);
          setSelectedPlaylists(
            playlists
              ?.filter((p) => p.songs.some((s) => s.songId === props.id))
              .map((p) => p.id) as number[]
          );
        }}
      >
        <ListBulletIcon className="text-white h-6" />
      </button>
    </div>
  );
};
