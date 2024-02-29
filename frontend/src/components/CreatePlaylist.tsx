import { useStore } from "@/lib/zustand";
import { PLAYLIST_ROUTE } from "@/requests/routes";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const NewAlbum = () => {
  const { playlists, setPlaylists } = useStore();

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await axios
      .post(PLAYLIST_ROUTE, { title, description }, { withCredentials: true })
      .then((res) => {
        setPlaylists(playlists ? [...playlists, res.data] : [res.data]);
        router.replace(`/album/${res.data.id}`);
      })
      .catch((err: any) => {
        alert(err?.response?.data?.err);
      });
  };

  return (
    <div className="w-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className={`w-full flex flex-col items-start justify-start bg-gray-700 p-4 max-w-[600px] rounded-2xl gap-2`}
      >
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="title" className="text-white">
            Nosaukums
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className=""
            placeholder="Nosaukums"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="description" className="text-white">
            Apraksts
          </label>
          <textarea
            name="description"
            id="description"
            className="h-20 p-2"
            placeholder="Apraksts"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex w-full gap-4 items-center justify-start mt-2">
          <button
            className="bg-gray-800 border-2 border-pink-500 flex-1 py-3 max-w-[200px] rounded-full text-pink-500"
            type="submit"
          >
            Izveidot
          </button>

          <Link href="/" className="text-pink-500 underline">
            Atpakaļ
          </Link>
        </div>
      </form>
    </div>
  );
};

export default NewAlbum;
