import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Effectuez la déconnexion
    window.open("http://localhost:4000/auth/logout", "_self");
    // window.open("http://13.39.109.183:4000/auth/logout", "_self");
    // Redirigez vers la page de connexion après un court délai
    setTimeout(() => {
      navigate('/login');
    }, 500); // 500ms devrait être suffisant pour permettre à la requête de se terminer
  };

  return (
    <div className="navbar">
      <span className="logo">
        <Link className="link" to="/">
          <img src="img/new_logo.png" alt="Logo" className="navbar-logo" />
        </Link>
      </span>
      {user ? (
        <ul className="list">
          <li className="listItem">
            <img
              src={user.photos[0].value}
              alt=""
              className="avatar"
            />
          </li>
          <li className="listItem">{user.displayName}</li>
          <li className="listItem">
            <Link className="link" to="login" onClick={handleLogout}>
              Se déconnecter
            </Link>
          </li>
        </ul>
      ) : (
        <Link className="link" to="login">
          Se connecter
        </Link>
      )}
    </div>
  );
};
export default Navbar;
