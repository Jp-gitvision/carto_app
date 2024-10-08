import { useState } from "react";
import { useNavigate } from "react-router-dom";  // Importez useNavigate pour la redirection
import { API, baseURL } from "../services/API";

const Login = () => {
  const navigate = useNavigate();  // Initialisation de useNavigate
  const [username, setUsername] = useState("");  // Initialisez à une chaîne vide
  const [password, setPassword] = useState("");  // Initialisez à une chaîne vide
  const [error, setError] = useState("");  // Pour afficher les messages d'erreur

  // Fonctions pour gérer les connexions OAuth avec redirection
  const google = () => {
    window.open(baseURL + "/auth/google", "_self");
  };

  const github = () => {
    window.open(baseURL + "/auth/github", "_self");
  };

  const facebook = () => {
    window.open(baseURL + "/auth/facebook", "_self");
  };

  const loginSimple = async () => {
    try {
      const response = await API.post('/login-simple', {
        username: username.trim(),
        password: password
      });

      if (response.status === 200) {
        navigate('/');  // Redirection vers la page de la carte
      } else {
        setError("Identifiant ou mot de passe incorrect.");
      }
    } catch (err) {
      setError(err.response ? err.response.data : "La connexion a échoué. Veuillez réessayer.");
    }
  };

  return (
    <div className="login">
      <h1 className="loginTitle">Connectez-vous</h1>
      <div className="wrapper">
        <div className="left">
          <div className="loginButton google" onClick={google}>
            <img src= "img/google.png" alt="Google logo" className="icon" />
            Google
          </div>
          <div className="loginButton github" onClick={github}>
            <img src="img/github.png" alt="Github logo" className="icon" />
            Github
          </div>
          <div className="loginButton facebook" onClick={facebook}>
            <img src="img/facebook.png" alt="Facebook logo" className="icon" />
            Facebook
          </div>
        </div>
        <div className="center">
          <div className="line" />
          <div className="or">OU</div>
        </div>
        <div className="right">
          <input type="text" placeholder="Identifiant" onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)}/>
          <button className="submit" onClick={loginSimple}>Se connecter</button>
          {error && <p className="error">{error}</p>}
          <p className="sign-up-prompt">Vous n'avez pas encore de compte ? <a href="/inscription">Inscrivez-vous</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
