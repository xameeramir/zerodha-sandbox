const jsonServer = require('json-server')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const port = process.env.PORT || 3000

server.use(jsonServer.bodyParser)
server.use(middlewares)

server.listen(port, () => {
    console.log('JSON Server is running')
})

server.get('/users', (request: any, response: any) => {
    if (request.method === 'GET') {
        response.status(200).jsonp({ "TEST": "1234567" })
    }
})