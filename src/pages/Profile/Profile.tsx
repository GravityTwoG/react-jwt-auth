import { useCallback, useEffect, useState } from 'react';

import classes from './profile.module.css';

import { Session, UserAuthProvider } from '@/types';
import { useAuthContext } from '@/contexts/AuthContext/context';
import { useAPIContext } from '@/contexts/APIContext/context';

import { H1, H2 } from '@/components/Typography';
import { Button } from '@/components/Button';
import { Paper } from '@/components/Paper/Paper';
import { Container } from '@/components/Container/Container';
import {
  GoogleOAuthButton,
  GithubOAuthButton,
  OAuthButtonProps,
} from '@/components/oauth';

export const ProfilePage = () => {
  const { user, getActiveSessions, logout, logoutAll, deleteUser } =
    useAuthContext();
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);

  useEffect(() => {
    getActiveSessions().then(setActiveSessions).catch(console.error);
  }, [user, getActiveSessions]);

  const onUpdate = () => {
    getActiveSessions().then(setActiveSessions).catch(console.error);
  };

  return (
    <Container className={classes.ProfilePage}>
      <H1>Profile</H1>

      <Paper className={classes.User}>
        <p>
          <strong>id </strong>: {user.id}
        </p>
        <p>
          <strong>Email</strong>: {user.email}
        </p>
      </Paper>

      <div className={classes.SessionsHeader}>
        <H2>Active sessions</H2>

        <button
          className="block px-2 py-1 border rounded-md active:scale-95"
          onClick={onUpdate}
        >
          Refresh
        </button>
      </div>

      <ul className={classes.Sessions}>
        {activeSessions.map((session, idx) => (
          <li className={classes.Session} key={idx}>
            <Paper>
              <p>
                <strong>IP</strong>: {session.ip}
              </p>
              <p>
                <strong>User agent</strong>: {session.userAgent}
              </p>

              <p>
                <strong>Created </strong>:{' '}
                {new Date(session.createdAt).toLocaleString()}
              </p>

              <p>
                <strong>Updated </strong>:{' '}
                {new Date(session.updatedAt).toLocaleString()}
              </p>
            </Paper>
          </li>
        ))}
      </ul>

      <ProvidersList />

      <div className="mt-8 mx-auto max-w-80 flex flex-col items-center justify-center gap-4">
        <Button onClick={logoutAll}>Logout all</Button>

        <Button onClick={logout}>Logout</Button>

        <Button
          className="flex flex-col items-center justify-center bg-red-500 hover:bg-red-700 py-1"
          onDoubleClick={deleteUser}
        >
          <p className="leading-none">Delete account</p>
          <p className="text-[10px] text-slate-200">Double click to delete.</p>
        </Button>
      </div>
    </Container>
  );
};

const mapAuthProviders = (providers: string[]) => {
  const providersMap: { [provider: string]: boolean } = {};
  for (const provider of providers) {
    providersMap[provider] = true;
  }

  return providersMap;
};

const connectOAuthButtons: Record<string, React.FC<OAuthButtonProps>> = {
  google: GoogleOAuthButton,
  github: GithubOAuthButton,
};

const ProvidersList = () => {
  const { authAPI } = useAPIContext();
  const { connectOAuth } = useAuthContext();

  const [supportedAuthProviders, setSupportedAuthProviders] = useState<{
    [provider: string]: boolean;
  }>({});

  const [userAuthProviders, setUserAuthProviders] = useState<{
    [provider: string]: UserAuthProvider;
  }>({});

  const getUserAuthProviders = useCallback(async () => {
    try {
      const providers = await authAPI.getAuthProviders();

      const map: {
        [provider: string]: UserAuthProvider;
      } = {};

      for (const provider of providers) {
        map[provider.name] = provider;
      }

      setUserAuthProviders(map);
    } catch (error) {
      console.error(error);
    }
  }, [authAPI]);

  useEffect(() => {
    getUserAuthProviders();

    authAPI
      .getSupportedAuthProviders()
      .then((providers) => {
        setSupportedAuthProviders(mapAuthProviders(['local', ...providers]));
      })
      .catch(console.error);
  }, [authAPI, getUserAuthProviders]);

  const connect = useCallback(
    async (provider: string) => {
      try {
        await connectOAuth(provider);
        getUserAuthProviders();
      } catch (error) {
        console.error(error);
        alert(`Failed to connect to ${provider}: ${error}`);
      }
    },
    [connectOAuth, getUserAuthProviders]
  );

  return (
    <section className="mt-8">
      <H2>Auth providers</H2>

      <Paper className="mt-4">
        <ul className="flex flex-col gap-4">
          {Object.keys(supportedAuthProviders).map((provider) => {
            const ConnectOAuthButton = connectOAuthButtons[provider];

            return (
              <li key={provider} className="flex items-center gap-2">
                <p>
                  <strong>{provider}</strong>
                </p>

                <p>-</p>

                {userAuthProviders[provider] ? (
                  <p>{userAuthProviders[provider].email}</p>
                ) : ConnectOAuthButton ? (
                  <ConnectOAuthButton
                    provider={provider}
                    className="max-w-[120px] py-1 px-2"
                    onClick={connect}
                    children="Connect"
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      </Paper>
    </section>
  );
};
