declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

interface Base{
  _id: string;
  createdAt: string;
  updatedAt: string;
}
interface User extends Base {
  name: string;
  email: string;
  role: string;
  password: string;
}

interface Song extends Base {
  map(arg0: (data: Song) => number): unknown;
  title: string;
  artist: string;
  album: string;
  genre: string;
  lyrics: string;
  audioUrl: string;
}

interface Playlist extends Base{
  map(arg0: (data: Playlist) => number): unknown;
  name: string;
  description: string;
  songs: Song[];
}

interface PlaylistState{
  playlists: Playlist[]; 
}

interface SongState {
  songs: Song[];
}
interface PostRes {
  success: boolean;
  data:{
    total: number;
    data:{
      [key: string]: string | {};
    }
  }
}
interface LoginFormInputs {
  email: string;
  password: string;
}
interface RegisterFormInputs {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}
interface IResponse {
  data:{
    accessToken: string;
    refreshToken: string;
    user: {};
  }
  message: string;
  success: boolean;
}