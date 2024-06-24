import { Link, Route, Router, Switch } from 'wouter';
import { Container } from './components/Container/Container';

import { ProfilePage } from './pages/Profile/Profile';
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
      <div className="App">
        <div className="Loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Container>
        <nav>
          <p>JWT Auth Example</p>

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
      </Container>

      <main>
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
      </main>

      <footer>
        <p className="author">
          Created by:{' '}
          <a target="_blank" href="https://github.com/GravityTwoG">
            GravityTwoG
          </a>
        </p>

        <p className="sources">
          <a
            target="_blank"
            href="https://github.com/GravityTwoG/react-jwt-auth"
          >
            Frontend
          </a>

          <a target="_blank" href="https://github.com/GravityTwoG/go-jwt-auth">
            Backend
          </a>
        </p>
      </footer>
    </div>
  );
}
