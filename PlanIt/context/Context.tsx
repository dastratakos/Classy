import { User, Context } from "../types";
import { createContext } from "react";

const initialContext = {
  user: {} as User,
  setUser: (arg0: User) => {},
  friendIds: [] as string[],
  setFriendIds: (arg0: string[]) => {},
}

const AppContext = createContext<Context>(initialContext);

export default AppContext;
