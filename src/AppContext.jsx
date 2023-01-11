import { createContext, useContext, useState } from "react";

export const MetaContext = createContext();
const sharedMeta = {
  elements: [],
};

export const useMetaContext = () => {
  return useContext(MetaContext);
};

const MetaContextProvider = ({ children }) => {
  const [meta, setMeta] = useState(sharedMeta);

  function updateMeta(newMeta) {
    setMeta((prevMeta) => {
      return {
        ...newMeta,
      };
    });
  }

  function setMetaElements(elements) {
    setMeta((prevMeta) => {
      prevMeta.elements = [...elements];
      return {
        ...prevMeta,
      };
    });
  }

  return (
    <MetaContext.Provider value={{ updateMeta, setMetaElements }}>
      {children}
    </MetaContext.Provider>
  );
};

export default MetaContextProvider;
