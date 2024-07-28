import { useEffect, useState } from 'react';

import classes from './profile.module.css';

import { useAuthContext } from '../../contexts/AuthContext/context';
import { Session } from '../../types';

import { Container } from '../../components/Container/Container';
import { Paper } from '../../components/Paper/Paper';

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
    <Container>
      <h1 className="text-5xl leading-snug">Profile</h1>

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

      <div className="mt-8">
        <button
          className="block mx-auto max-w-48 bg-blue-500"
          onClick={logoutAll}
        >
          Logout all
        </button>
      </div>
      <div className="mt-4">
        <button className="block mx-auto max-w-48 bg-blue-500" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="mt-4">
        <button
          className="flex flex-col items-center justify-center mx-auto max-w-48 bg-red-500"
          onDoubleClick={deleteUser}
        >
          <p>Delete account</p>
          <p className="text-xs text-gray-300">Double click to delete.</p>
        </button>
      </div>
    </Container>
  );
};
