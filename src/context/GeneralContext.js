"use client";

import { createContext, useState } from "react";
import { dataInitialState } from "../utils/states";

export const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
  const [data, setData] = useState(dataInitialState);

  return (
    <GeneralContext.Provider
      value={{
        data,
        setData,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};
