import { Playlist, Song, User } from "@prisma/client";
import { create } from "zustand";

type Store = {
  currentSong: Song | null;
  user: User | null;
  songs: Song[] | null;
  playlists: ExPlaylist[] | null;
  playing: boolean;
  setPlaying: (newPlaying: boolean) => void;
  setCurrentSong: (newCurrentSong: Song | null) => void;
  setUser: (newUser: User | null) => void;
  setSongs: (newSongs: Song[] | null) => void;
  setPlaylists: (newPlaylists: ExPlaylist[] | null) => void;
};

export const useStore = create<Store>()((set) => ({
  currentSong: null,
  songs: null,
  user: null,
  playing: false,
  playlists: null,
  setPlaying: (playing) => set(() => ({ playing })),
  setCurrentSong: (currentSong) => set(() => ({ currentSong })),
  setSongs: (songs) => set(() => ({ songs })),
  setUser: (user) => set(() => ({ user })),
  setPlaylists: (playlists) => set(() => ({ playlists })),
}));

type ExPlaylist = {
  id: number;
  title: string;
  description: string | null;
  userId: number;
  songs: {
    songId: number;
  }[];
};
