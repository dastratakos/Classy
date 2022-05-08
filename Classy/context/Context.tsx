import { Context } from "../types";
import { createContext } from "react";

const AppContext = createContext<Context>({} as Context);

export default AppContext;
