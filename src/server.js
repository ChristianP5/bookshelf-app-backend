const Hapi = require('@hapi/hapi');
const routes = require('./routes');

 const server = Hapi.server({
    port: 9000,
    host: "localhost",
    routes: {
        cors: {
            origin: ['*']
        }
    }
 })

 server.route(routes);

 const init = async () => {
    await server.start();
    console.log(`Server started at ${server.info.uri}`);
 }

 init();