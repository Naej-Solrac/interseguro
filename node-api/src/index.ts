// Entry point: Levanta el servidor
import httpApp from './infrastructure/config/http-app';

const serverPort = Number(process.env.PORT) || 3000;

httpApp.listen(serverPort, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor escuchando en http://localhost:${serverPort}`);
});

