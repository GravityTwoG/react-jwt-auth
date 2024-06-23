import { useEffect, useState } from 'react';
import { Container } from '../components/Container/Container';
import { useAuthContext } from '../contexts/AuthContext/context';

export const ProfilePage = () => {
  const { user, getActiveSessions, logout } = useAuthContext();
  const [activeSessions, setActiveSessions] = useState<string[]>([]);

  useEffect(() => {
    getActiveSessions().then(setActiveSessions).catch(console.error);
  }, [user, getActiveSessions]);

  return (
    <Container>
      <h1>Profile</h1>

      <div>
        <p>
          <strong>id: </strong> {user.id}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      <h2 style={{ marginTop: '2rem' }}>Active sessions</h2>

      <ul>
        {activeSessions.map((session) => (
          <li key={session}>{session}</li>
        ))}
      </ul>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={logout}>Logout</button>
      </div>
    </Container>
  );
};
