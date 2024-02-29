import { useStore } from "@/lib/zustand";
import {
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  USER_INFO_ROUTE,
} from "@/requests/routes";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const Form = () => {
  const { user, setUser, setPlaylists } = useStore();

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (router.asPath !== "/auth/register") {
      await axios
        .post(LOGIN_ROUTE, { username, password }, { withCredentials: true })
        .then(async (res) => {
          await axios
            .get(USER_INFO_ROUTE, { withCredentials: true })
            .then((res) => {
              setUser(res.data);
              setPlaylists(res.data.playlists);
              router.replace("/");
            })
            .catch((err: any) => {
              console.log(err);
              alert(err?.response?.data?.err);
            });
        })
        .catch((err: any) => {
          console.log(err);
          alert(err?.response?.data?.err);
        });

      return;
    }

    await axios
      .post(REGISTER_ROUTE, { username, password }, { withCredentials: true })
      .then(async (res) => {
        await axios
          .get(USER_INFO_ROUTE, { withCredentials: true })
          .then((res) => {
            setUser(res.data);
            setPlaylists(res.data.playlists);
            router.replace("/");
          })
          .catch((err: any) => {
            alert(err?.response?.data?.err);
          });
      })
      .catch((err: any) => {
        alert(err?.response?.data?.err);
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full flex flex-col items-start justify-start bg-gray-700 p-4 max-w-[600px] rounded-2xl gap-2`}
    >
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="username" className="text-white">
          Lietotājvārds
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className=""
          placeholder="Lietotājvārds"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="password" className="text-white">
          Parole
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className=""
          placeholder="Parole"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex w-full gap-4 items-center justify-start mt-2">
        <button
          className="bg-gray-800 border-2 border-pink-500 flex-1 py-3 max-w-[300px] rounded-full text-pink-500"
          type="submit"
        >
          Pieslēgties
        </button>

        <Link
          href={
            router.asPath !== "/auth/register"
              ? "/auth/register"
              : "/auth/login"
          }
          className="text-pink-500 underline"
        >
          {router.asPath !== "/auth/register" ? "Reģistrēties" : "Pieslēgties"}
        </Link>
      </div>
    </form>
  );
};

export default Form;
