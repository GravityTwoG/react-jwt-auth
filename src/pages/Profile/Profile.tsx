import { useEffect, useState } from 'react';

import classes from './profile.module.css';

import { useAuthContext } from '../../contexts/AuthContext/context';
import { Session } from '../../types';

import { Container } from '../../components/Container/Container';
import { Paper } from '../../components/Paper/Paper';

export const ProfilePage = () => {
  const { user, getActiveSessions, logout, logoutAll } = useAuthContext();
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);

  useEffect(() => {
    getActiveSessions().then(setActiveSessions).catch(console.error);
  }, [user, getActiveSessions]);

  const onUpdate = () => {
    getActiveSessions().then(setActiveSessions).catch(console.error);
  };

  return (
    <Container>
      <h1>Profile</h1>

      <Paper className={classes.User}>
        <p>
          <strong>id </strong>: {user.id}
        </p>
        <p>
          <strong>Email</strong>: {user.email}
        </p>
      </Paper>

      <div className={classes.SessionsHeader}>
        <h2>Active sessions</h2>

        <button onClick={onUpdate}>Update</button>
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
            </Paper>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '2rem' }}>
        <button className={classes.LogoutButton} onClick={logoutAll}>
          Logout all
        </button>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button className={classes.LogoutButton} onClick={logout}>
          Logout
        </button>
      </div>
    </Container>
  );
};
