import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importez useNavigate
import {API} from "../services/API";

const Inscription = () => {
  const [username, setUsername] = useState('');
  // username : La première valeur du tableau est la valeur actuelle de l'état. À l'initialisation, il s'agit de la valeur que vous avez fournie ('' dans cet exemple).
  // setUsername : La deuxième valeur est une fonction que vous pouvez appeler pour modifier cet état. Lorsque vous voulez mettre à jour la valeur de username, vous appelez setUsername avec une nouvelle valeur.
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // Initialisation de useNavigate

  const register = async () => {
    if (!username.trim() || !email.trim() || !password) {
      alert('Merci de bien remplir tous les champs.');
      return;
    }
    try {
      const response = await API.post('/inscription', {
        // trim() est utilisé pour supprimer les espaces blancs avant et après les valeurs des champs, pour s'assurer que l'utilisateur n'a pas entré que des espaces.
        username: username.trim(),
        email: email.trim(),
        password: password
      });
      console.log(response.data);
      navigate('/login'); // Redirection vers la page '/login' en supposant que l'inscription a réussi.
    } catch (error) {
      console.error(error);
      alert("L'inscription a échoué: " + error.response?.data || 'Erreur inconnu');
    }
  };

  return (
    <div className="signin">
      <h1 className="loginTitle">Inscrivez-vous</h1>
      <div className="wrapper_inscription">
        <div className="center_inscription">
          <input 
            type="text" 
            placeholder="Identifiant" 
            onChange={(e) => setUsername(e.target.value)} 
            // Lorsque l'utilisateur saisit un texte dans le champ input, l'événement onChange est déclenché
            // Lorsque setUsername est appelée, React change la valeur de username dans l'état local du composant à la valeur que l'utilisateur a entrée. React détecte ensuite que l'état a changé.
          />
          <input 
            type="email"  // Type changé en email
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button className="submit" onClick={register}>S'inscrire</button>
          <p className="sign-up-prompt">Vous avez déjà un compte ? <a href="/login">Connectez-vous</a></p>
        </div>
      </div>
    </div>
  );
};

export default Inscription;
