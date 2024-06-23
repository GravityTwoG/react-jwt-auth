import { APIContext, api } from './context';

export const APIContextProvider = (props: { children: React.ReactNode }) => {
  return (
    <APIContext.Provider value={api}>{props.children}</APIContext.Provider>
  );
};
