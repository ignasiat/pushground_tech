import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth, authValidation } from '../AuthSystem';
import './styles.scss';

const Login = ():JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const from = location.state?.from?.pathname;
  useEffect(() => {
    if(auth.isLogged) {
      navigate(from ?? '/dashboard', { replace: true });
    }
  }, [])
  

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (authValidation(username, password)) {
      auth.signin(()=> {
        navigate(from ?? '/dashboard', { replace: true });
      })
    } else {
      document.getElementsByClassName('form__validation')[0].classList.remove('display--none');
      setTimeout(() => {
        document.getElementsByClassName('form__validation')[0].classList.add('display--none');
      }, 3000);
    } 
  }

  return (
    <div className='form__container'>
      <form onSubmit={handleSubmit}>
        {from && (<p>You must log in to view the page at {from}</p>)}

        <div className='form__name'>
          <label>
            Username: <input name="username" type="text" />
          </label>
        </div>
        <div className='form__password'>
          <label>
            Password: <input name="password" type="password" />
          </label>
          <p>Password must be 8 characters and at leat 1 uppercase, 1 lowercase, 1 number and 1 character special @$!%*?&amp;</p>
        </div>
        <div className='form__submit'>
          <button type="submit">Login</button>
        </div>
      </form>
      <div className='form__validation display--none'>Username or password not valid</div>
    </div>
  );
}

export default Login;