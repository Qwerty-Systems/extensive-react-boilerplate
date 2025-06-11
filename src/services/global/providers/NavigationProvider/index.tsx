import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  useContext,
  useState,
} from "react";

export interface NavigationContextValue {
  activeNavigationPath: string;
  setActiveNavigationPath: Dispatch<string>;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);

  if (!context)
    throw new Error(
      "useNavigationContext can only be used inside the NavigationContext"
    );

  return context;
};

export const NavigationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeNavigationPath, setActiveNavigationPath] = useState("");

  const value = {
    activeNavigationPath,
    setActiveNavigationPath,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
