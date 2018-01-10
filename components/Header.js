import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Breadcrumbs from './Breadcrumbs';

const Header = props => (
  <header>
    <div className="header-title">
      <span className="menu" onClick={props.toggleMenu}>
        &#9776;
      </span>
      <Link to="/">signal</Link>
    </div>
    {props.isAuthenticated && (
      <nav>
        <Breadcrumbs {...props} />
      </nav>
    )}
    {props.isAuthenticated && (
      <div className="logout-label">
        <span className="clickable" onClick={props.logout}>
          Logout
        </span>
      </div>
    )}
  </header>
);

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

export default Header;
