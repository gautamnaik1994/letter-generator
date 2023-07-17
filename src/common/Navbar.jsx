import React from "react";
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Letter Generator</Link>
          <NavLink className="navbar-brand" to="/import">Import </NavLink>
        </div>
      </nav>
    )
}

export default Navbar;