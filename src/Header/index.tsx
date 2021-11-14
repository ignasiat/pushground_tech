import React from 'react';
import { Link } from 'react-router-dom';

const Header = ():JSX.Element => {
  return (
  <ul>
    <li><Link to='/blog'>Blog</Link></li>
    <li><Link to='/features'>Features</Link></li>
    <li><Link to='/dashboard'>Dashboard</Link></li>
  </ul>)
}

export default Header;