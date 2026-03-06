const express = require('express');
const { engine } = require('express-handlebars');
const fs = require('fs');
const path = require('path');
const app = express();

app.engine('hbs', engine({
    extname: 'hbs',
    helpers: {
        rejectBtn: () => `<button type="button" onclick="window.location.href='/'">Отказаться</button>`
    }
}));
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const DATA_PATH = './mas.json';
const getData = () => JSON.parse(fs.readFileSync(DATA_PATH));
const saveData = (data) => fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

app.get('/', (req, res) => res.render('index', { items: getData(), disabled: false }));
app.get('/Add', (req, res) => res.render('add', { items: getData(), disabled: true }));
app.get('/Update', (req, res) => {
    const data = getData();
    const item = data.find(i => i.id === req.query.id);
    res.render('update', { items: data, item, disabled: true });
});

app.post('/Add', (req, res) => {
    const data = getData();
    data.push({ id: Date.now().toString(), name: req.body.name, phone: req.body.phone });
    saveData(data);
    res.redirect('/');
});

app.post('/Update', (req, res) => {
    let data = getData();
    data = data.map(i => i.id === req.body.id ? { ...i, name: req.body.name, phone: req.body.phone } : i);
    saveData(data);
    res.redirect('/');
});

app.post('/Delete', (req, res) => {
    let data = getData();
    data = data.filter(i => i.id !== req.body.id);
    saveData(data);
    res.redirect('/');
});

app.get('/debug-json', (req, res) => {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    res.header("Content-Type", "application/json");
    res.send(data);
});

//app.listen(3000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});