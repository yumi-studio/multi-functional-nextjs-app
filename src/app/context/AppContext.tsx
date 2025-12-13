"use client"

import { createContext, useContext, useEffect } from "react";
import { Bounce, toast } from "react-toastify";

const AppContext = createContext<{
	alertInDevelop: () => void;
} | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
	const alertInDevelop = () => {
		toast("In develop ... or not", { theme: "light", transition: Bounce });
	}

	useEffect(() => {
		document.addEventListener("contextmenu", e => {
			e.preventDefault();
		});
	}, []);

	return (
		<AppContext.Provider value={{ alertInDevelop }}>{children}</AppContext.Provider>
	)
}

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) throw new Error("useAuth must be used within AuthProvider");
	return context;
}
