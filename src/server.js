const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const server = Hapi.server({
  port: 9000,
  host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
  routes: {
    cors: {
      origin: ['*'],
    },
  },
});

server.route(routes);

const init = async () => {
  await server.start();
};

init();
