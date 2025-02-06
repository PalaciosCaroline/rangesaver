import { AuthProvider } from "./components/authContext";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css"; // Import des styles globaux
import Navbar from "./components/navBar";
import "./styles/navBar.css";

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
    <html lang="fr">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
    </AuthProvider>
  );
}