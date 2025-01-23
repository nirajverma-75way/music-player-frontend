declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

interface User {
  _id: number;
  [key: string]: string;
}
interface Post {
  _id: string;
  [key: string]: string;
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
  username: string;
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