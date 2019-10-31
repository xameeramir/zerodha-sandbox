import { router } from "./router";

const express = require('express');
const server = express();
const port = process.env.PORT || 3000;

router(server);

const path = require('path');
const publicFolder = path.join(__dirname, '../');
server.get('/', function (req: any, res: any) {
    res.sendFile(path.join(publicFolder, 'index.html'));
});
server.use('/', express.static(publicFolder));

server.listen(port, () => {
    
    console.log(`
Mock server is running at PORT ${port}\n
Free sandbox for testing Zerodha's Kite and Coin APIs\n
Learn more https://nordible.com/zerodha-sandbox/\n
\u00a9 nordible ${new Date().getFullYear()}`);
});