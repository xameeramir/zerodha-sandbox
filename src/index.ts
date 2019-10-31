import { router } from "./router";

const express = require('express');
const server = express();
const port = process.env.PORT || 3000;

router(server);

const path = require('path');
const publicFolder = path.join(__dirname, '../public');
server.get('/', function (req: any, res: any) {
    res.sendFile(path.join(publicFolder, 'index.html'));
});
server.use('/', express.static(publicFolder));

server.listen(port, () => {
    console.log(`Server is running at PORT ${port}`);
});