const express = require("express");
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('img'));

app.post('/api/fighters', (req, res) => {
  const pathFromReq = req.body.reqPath;
  res.contentType('application/octet-stream');
  console.log('-------', req.body)
  res.sendFile(path.join((__dirname + pathFromReq)));
});

app.get("/api/users", (req, res) => {
  res.json({ users: [{
      "name": "John Snow",
      "position": "The King of the North",
    }, {
      "name": "Serseya Lanister",
      "position": "Kings haven",
    }, {
      "name": "Deyeneris Targarien",
      "position": "Dragons mother",
    }] });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
