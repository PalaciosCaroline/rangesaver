import { AuthProvider, useAuth } from "./components/authContext";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css"; // Import des styles globaux
import Navbar from "./components/navBar";
import "./styles/navBar.css";

function LayoutContent({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <body>
      {user && <Navbar />} {/* ✅ La Navbar s'affiche uniquement si l'utilisateur est connecté */}
      {children}
    </body>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
