const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('api/accounts.json');
const middleWares = jsonServer.defaults();
const port = process.env.PORT || 8080;

server.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
server.use(middleWares);
server.use('/api', router);


server.listen(port, () => {
  console.log('JSON Server is running')
});
