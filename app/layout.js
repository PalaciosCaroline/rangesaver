import { AuthProvider } from "./components/authContext";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css"; // Import des styles globaux

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="fr">
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}
