const express = require('express');
const app = express();
const fileHandler = require('./modules/fileHandler');

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const employees = await fileHandler.read();
    res.render('index', { employees });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
