import { useAuthContext } from './contexts/AuthContext/context';
import { AuthStatus } from './types';

import { Link } from 'wouter';
import { Container } from './components/Container/Container';
import { ConfigView } from './components/ConfigView';
import { AppRouter } from './AppRouter';

export function App() {
  const { authStatus } = useAuthContext();

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
        <AppRouter />
      </main>

      <Container className="mt-4">
        <ConfigView />
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
