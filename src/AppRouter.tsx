import { privatePage } from './components/hocs/privatePage';
import { anonymousPage } from './components/hocs/anonymousPage';

import { Router, Route, Switch } from 'wouter';

import { RegisterPage } from './pages/auth/local/Register';
import { LoginPage } from './pages/auth/local/Login';

import { RegisterWithOAuthPage } from './pages/auth/oauth/RegisterWithOAuth';
import { LoginWithOAuthPage } from './pages/auth/oauth/LoginWithOAuth';

import { ProfilePage } from './pages/Profile/Profile';

const profilePage = privatePage(ProfilePage);

const registerPage = anonymousPage(RegisterPage);
const loginPage = anonymousPage(LoginPage);

const registerWithOAuthPage = anonymousPage(RegisterWithOAuthPage);
const loginWithOAuthPage = anonymousPage(LoginWithOAuthPage);

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path={'/'} component={profilePage} />
        <Route path={'/register'} component={registerPage} />
        <Route path={'/login'} component={loginPage} />

        <Route path={'/register/:provider'} component={registerWithOAuthPage} />
        <Route path={'/login/:provider'} component={loginWithOAuthPage} />

        <Route>
          <h1>Page not found</h1>
        </Route>
      </Switch>
    </Router>
  );
};
