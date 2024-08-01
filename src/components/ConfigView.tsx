import { useEffect, useState } from 'react';
import { useAPIContext } from '../contexts/APIContext/context';

export const ConfigView = () => {
  const { authAPI } = useAPIContext();

  const [config, setConfig] = useState({
    accessTokenTTLsec: 0,
    refreshTokenTTLsec: 0,
  });

  useEffect(() => {
    authAPI.getConfig().then(setConfig).catch(console.error);
  }, [authAPI]);

  return (
    <div className="rounded-xl border border-gray-300 px-8 py-4">
      <h3 className="text-2xl leading-snug">Config</h3>
      <p>
        <strong>Access token TTL</strong>: {config.accessTokenTTLsec} seconds
      </p>
      <p>
        <strong>Refresh token TTL</strong>: {config.refreshTokenTTLsec} seconds
      </p>
    </div>
  );
};
