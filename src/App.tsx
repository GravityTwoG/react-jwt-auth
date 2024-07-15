import { Link, Route, Router, Switch } from 'wouter';
import { Container } from './components/Container/Container';

import { ProfilePage } from './pages/Profile/Profile';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';

import { useAuthContext } from './contexts/AuthContext/context';
import { AuthStatus } from './types';
import { privatePage } from './privatePage';
import { anonymousPage } from './anonymousPage';
import { useAPIContext } from './contexts/APIContext/context';
import { useEffect, useState } from 'react';

const profilePage = privatePage(ProfilePage);
const loginPage = anonymousPage(LoginPage);
const registerPage = anonymousPage(RegisterPage);

export function App() {
  const { authAPI } = useAPIContext();
  const { authStatus } = useAuthContext();

  const [config, setConfig] = useState({
    accessTokenTTLsec: 0,
    refreshTokenTTLsec: 0,
  });

  useEffect(() => {
    authAPI.getConfig().then(setConfig).catch(console.error);
  }, [authAPI]);

  if (authStatus === AuthStatus.LOADING) {
    return (
      <div className="App py-16 flex flex-col items-stretch">
        <div className="m-auto text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App py-16 flex flex-col items-stretch">
      <Container>
        <nav className="mb-16 rounded-xl border border-gray-300 px-8 py-4 flex items-center justify-between gap-12">
          <p className="text-2xl font-bold leading-none">JWT Auth Example</p>

          <ul className="flex flex-wrap items-center justify-center gap-8">
            {authStatus === AuthStatus.AUTHENTICATED && (
              <li>
                <Link to={'/'} className="text-xl hover:underline">
                  Profile
                </Link>
              </li>
            )}
            {authStatus === AuthStatus.ANONYMOUS && (
              <>
                <li>
                  <Link to={'/login'} className="text-xl hover:underline">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to={'/register'} className="text-xl hover:underline">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </Container>

      <main className="flex-1">
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

      <Container
        style={{
          marginTop: '1rem',
        }}
      >
        <h3 className="text-2xl leading-snug">Config</h3>
        <p>
          <strong>Access token TTL</strong>: {config.accessTokenTTLsec} seconds
        </p>
        <p>
          <strong>Refresh token TTL</strong>: {config.refreshTokenTTLsec}{' '}
          seconds
        </p>
      </Container>

      <footer className="mt-auto pt-2 text-center">
        <p>
          Created by:{' '}
          <a
            className="underline font-bold hover:no-underline"
            target="_blank"
            href="https://github.com/GravityTwoG"
          >
            GravityTwoG
          </a>
        </p>

        <p className="mt-2 inline-flex items-center justify-start gap-4">
          <a
            className="underline font-bold hover:no-underline"
            target="_blank"
            href="https://github.com/GravityTwoG/react-jwt-auth"
          >
            Frontend
          </a>

          <a
            className="underline font-bold hover:no-underline"
            target="_blank"
            href="https://github.com/GravityTwoG/go-jwt-auth"
          >
            Backend
          </a>
        </p>
      </footer>
    </div>
  );
}
