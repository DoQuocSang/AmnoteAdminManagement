const express = require('express');
const cors = require('cors');
const axios = require('axios');

const bodyParser = require('body-parser');

const app = express();
const PORT = 3001; 

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS middleware
app.use(cors());

// Define route to forward requests
app.use('/cors', async (req, res) => {
  try {
    console.log(req.body);
    const response = await axios({
      method: req.method,
      url: `http://118.69.170.50/API${req.url}`,
      headers: req.headers,
      data: req.body,
    });
    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    if (error.response && error.response.data) {
      res.status(error.response.status || 500).send(error.response.data);
    } else {
      res.status(error.response.status || 500).send('Internal Server Error');
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server listening at http://localhost:${PORT}`);
});
