"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";

const AppContext = createContext<{
	isOffline: boolean;
	alertInDevelop: () => void;
} | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
	const [isOffline, setIsOffline] = useState(true);
	const alertInDevelop = () => {
		toast("In develop ... or not", { theme: "light", transition: Bounce });
	}

	useEffect(() => {
		document.addEventListener("contextmenu", e => {
			e.preventDefault();
		});

		// (async () => {
		// 	try {
		// 		await fetch(process.env.NEXT_PUBLIC_API_HOST as string);
		// 		setIsOffline(false);
		// 	} catch {
		// 		setIsOffline(true);
		// 		toast("Offline Mode (Backend is not available)");
		// 	}
		// })();
	}, []);

	return (
		<AppContext.Provider value={{ isOffline, alertInDevelop }}>{children}</AppContext.Provider>
	)
}

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) throw new Error("useAuth must be used within AuthProvider");
	return context;
}
