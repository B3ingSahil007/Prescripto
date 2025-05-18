import { createContext } from "react";
import { doctors } from "../assets/assets_frontend/assets";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const currency = "INR";
    const currencySymbol = "₹";

    const value = { doctors, currency, currencySymbol };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
};

export default AppContextProvider;