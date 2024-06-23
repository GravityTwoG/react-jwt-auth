import { Link, Route, Router, Switch } from 'wouter';

import { ProfilePage } from './pages/Profile';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';

import { useAuthContext } from './contexts/AuthContext/context';
import { AuthStatus } from './types';
import { privatePage } from './privatePage';
import { anonymousPage } from './anonymousPage';

const profilePage = privatePage(ProfilePage);
const loginPage = anonymousPage(LoginPage);
const registerPage = anonymousPage(RegisterPage);

export function App() {
  const { authStatus } = useAuthContext();

  if (authStatus === AuthStatus.LOADING) {
    return (
      <div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <nav>
        <ul>
          {authStatus === AuthStatus.AUTHENTICATED && (
            <li>
              <Link to={'/'}>Profile</Link>
            </li>
          )}
          {authStatus === AuthStatus.ANONYMOUS && (
            <>
              <li>
                <Link to={'/login'}>Login</Link>
              </li>
              <li>
                <Link to={'/register'}>Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <Router>
        <Switch>
          <Route path={'/'} component={profilePage} />
          <Route path={'/login'} component={loginPage} />
          <Route path={'/register'} component={registerPage} />

          <Route>
            <h1>Page not found</h1>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
