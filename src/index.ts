import { router } from "./router";

const jsonServer = require('json-server')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const port = process.env.PORT || 3000

server.use(jsonServer.bodyParser)
server.use(middlewares)

router(server);

server.listen(port, () => {
    console.log(`JSON Server is running at PORT ${port}`);
});