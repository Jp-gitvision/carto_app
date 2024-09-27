// Importation des composants nécessaires et des styles
import Navbar from "./components/Navbar";
import "./App.css";
import Home from "./pages/Home";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Inscription from "./pages/Inscription";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Importation des éléments de routing
import { useEffect, useState } from "react"; // Importation des hooks useEffect et useState de React
import {API} from "./services/API"; 


// Composant principal App
const App = () => {
  // Déclaration de l'état pour stocker l'utilisateur courant
  const [user, setUser] = useState(null);

  // useEffect pour charger les données utilisateur une fois au montage du composant
  useEffect(() => {
    // Fonction pour obtenir les données de l'utilisateur

    const getUser = async(resObject) => {
      const response = await API.get("/auth/login/success");
      const responseData = response.data;
      setUser(responseData.user);
    };

    getUser();
  }, []);

  // Le JSX retourné par le composant App
  return (
    <BrowserRouter> {/* Composant pour le routage */}
      <div>
        <Navbar user={user} /> {/* Barre de navigation avec les informations de l'utilisateur */}
        <Routes> {/* Définition des routes */}
          <Route path="/" element={<Home />} /> {/* Route pour la page d'accueil */}
          <Route
          path="/inscription"
          element={user ? <Navigate to="/" /> : <Inscription />} // Si l'utilisateur est connecté, redirige vers la page d'accueil, sinon affiche le composant d'inscription
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />} // Si l'utilisateur est connecté, redirection vers l'accueil, sinon page de connexion
          />
          <Route
            path="/post/:id"
            element={user ? <Post /> : <Navigate to="/login" />} // Si connecté, accès à la page de post, sinon redirection vers la connexion
          />
        </Routes>
        
      </div>
    </BrowserRouter>
  );
};
export default App; // Exportation du composant App pour utilisation ailleurs dans l'application
