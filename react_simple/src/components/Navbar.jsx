import { Link } from "react-router-dom";


const Navbar = ({ user }) => {
  const logout = () => {
    window.open("http://15.188.54.179:8080/auth/logout", "_self");
  };
  return (
    <div className="navbar">
      <span className="logo">
        <Link className="link" to="/">
          <img src="img/logo.png" alt="Logo" className="navbar-logo" />
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
          <li className="listItem" onClick={logout}>
            Se déconnecter
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