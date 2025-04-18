import { useEffect } from 'react';

const Heartbeat = () => {
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await fetch('https://stats.ethiotech.net.et/heartbeat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'ok',
            app: 'ETN Ecosystem Stats',
            version: 'V0.1.1beta',
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error('Heartbeat failed:', err);
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 60000);
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default Heartbeat;
