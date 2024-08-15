import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar({ loggedIn, handleLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-between">
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink to="/" className="nav-link">Charts</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/videos" className="nav-link">Videos</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/calculator" className="nav-link">Calculator</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/calendar" className="nav-link">News</NavLink>
        </li>
      </ul>
      <ul className="navbar-nav">
        {loggedIn ? (
          <li className="nav-item">
            <button onClick={handleLogout} className="nav-link btn btn-link">Logout</button>
          </li>
        ) : (
          <li className="nav-item">
            <NavLink to="/login" className="nav-link">Login</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
