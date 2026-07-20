import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Log Vite env values at startup to help debug production builds on Vercel
try {
	// eslint-disable-next-line no-console
	console.info('VITE env:', {
		VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
		VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
		VITE_API_BASE: import.meta.env.VITE_API_BASE,
		VITE_FORCE_PROXY: import.meta.env.VITE_FORCE_PROXY,
	});
} catch (e) {
	// ignore
}

createRoot(document.getElementById("root")!).render(<App />);
