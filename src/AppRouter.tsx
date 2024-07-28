import { privatePage } from './components/hocs/privatePage';
import { anonymousPage } from './components/hocs/anonymousPage';

import { Router, Route, Switch } from 'wouter';

import { RegisterPage } from './pages/auth/local/Register';
import { LoginPage } from './pages/auth/local/Login';

import { RegisterWithGooglePage } from './pages/auth/google/RegisterWithGoogle';
import { LoginWithGooglePage } from './pages/auth/google/LoginWithGoogle';

import { ProfilePage } from './pages/Profile/Profile';

const profilePage = privatePage(ProfilePage);
const loginPage = anonymousPage(LoginPage);
const registerWithGooglePage = anonymousPage(RegisterWithGooglePage);
const loginWithGooglePage = anonymousPage(LoginWithGooglePage);
const registerPage = anonymousPage(RegisterPage);

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path={'/'} component={profilePage} />
        <Route path={'/register'} component={registerPage} />
        <Route path={'/login'} component={loginPage} />

        <Route path={'/register/google'} component={registerWithGooglePage} />
        <Route path={'/login/google'} component={loginWithGooglePage} />

        <Route>
          <h1>Page not found</h1>
        </Route>
      </Switch>
    </Router>
  );
};
