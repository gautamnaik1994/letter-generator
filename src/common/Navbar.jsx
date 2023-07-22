import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar fixed-top bg-body-tertiary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand mb-0 h1" to="/">
          Letter Generator
        </Link>
        <div>
        <NavLink className=" btn btn-primary btn-sm top-link" to="/">
          Home
        </NavLink>
        <NavLink className=" btn btn-primary btn-sm ms-2 top-link" to="/import">
          Import Template
        </NavLink>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
