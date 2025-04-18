// src/pages/Heartbeat.jsx
const Heartbeat = () => {
  return (
    <pre>
      {JSON.stringify({
        status: 'ok',
        app: 'Ecosystem Stats',
        version: 'V1.0.0',
        timestamp: new Date().toISOString(),
      }, null, 2)}
    </pre>
  );
};

export default Heartbeat;
