import { Context } from "../types";
import { createContext } from "react";

const emptyContext = {
  userName: "",
  userMajor: "",
  userGradYear: "",
  userInterests: "",
  userNumFriends: "",
  userInClass: false,
  userPrivate: false,
  setUserName: (arg0: string) => {},
  setUserMajor: (arg0: string) => {},
  setUserGradYear: (arg0: string) => {},
  setUserInterests: (arg0: string) => {},
  setUserPrivate: (arg0: boolean) => {},

  channel: null,
  setChannel: null,
};

const AppContext = createContext<Context>(emptyContext);

export default AppContext;
