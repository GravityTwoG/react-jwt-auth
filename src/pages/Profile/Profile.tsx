import { useEffect, useState } from 'react';

import classes from './profile.module.css';

import { useAuthContext } from '../../contexts/AuthContext/context';
import { Session } from '../../types';

import { Container } from '../../components/Container/Container';
import { Paper } from '../../components/Paper/Paper';
import { Button } from '../../components/Button';
import { H1 } from '../../components/Typography';

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
        <h2>Active sessions</h2>

        <button className="block px-2 py-1 border" onClick={onUpdate}>
          Update
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
                {new Date(session.createdAt).toLocaleString()}{' '}
                <strong>Updated </strong>:{' '}
                {new Date(session.updatedAt).toLocaleString()}
              </p>
            </Paper>
          </li>
        ))}
      </ul>

      <div className="mt-8 mx-auto max-w-48 flex flex-col items-center justify-center gap-4">
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
