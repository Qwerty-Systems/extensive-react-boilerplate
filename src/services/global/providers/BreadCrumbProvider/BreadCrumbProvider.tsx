import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type DisplayValue = { [key: string | number]: string };
interface Breadcrumb {
  displayValue: DisplayValue;
  setDisplayValue: (value: DisplayValue) => void;
}

const breadcrumbContext = createContext<Breadcrumb>({} as Breadcrumb);

const useBreadcrumb = () => {
  const context = useContext(breadcrumbContext);

  if (!context)
    throw new Error(
      "useBreadcrumb can only be used inside a BreadcrumbProvider"
    );
  return context;
};

const BreadCrumbProvider = ({ children }: any) => {
  const [displayValue, setDisplayValueState] = useState({});

  const setDisplayValue = useCallback((value: DisplayValue) => {
    setDisplayValueState((prevState) => ({ ...prevState, ...value }));
  }, []);

  const value = useMemo(
    () => ({ displayValue, setDisplayValue }),
    [displayValue, setDisplayValue]
  );

  return (
    <breadcrumbContext.Provider value={value}>
      {children}
    </breadcrumbContext.Provider>
  );
};

export { BreadCrumbProvider, useBreadcrumb };
