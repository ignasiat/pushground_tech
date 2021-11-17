import React from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthSystem';
import './styles.scss';

const Header = ():JSX.Element => {
  const navigate = useNavigate();
  const { isLogged, signout } = useAuth();
  return (
    <div className='header'>
      <nav className='navbar'>
        <img src='https://app.pushground.com/assets/pushground.png' alt='logo pushground' />
        <ul className='list'>
          <li><Link to='/blog'>Blog</Link></li>
          <li><Link to='/features'>Features</Link></li>
          <li><Link to='/dashboard'>Dashboard</Link></li>
        </ul>
      </nav>
    {isLogged && <button className='button--logout' onClick={() => signout(() => navigate('/dashboard'))}>Logout</button>}
  </div>
  )
}

export default Header;