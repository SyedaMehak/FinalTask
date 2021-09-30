const express = require('express');
const path = require('path');
const fs = require('fs');
const { homedir } = require('os');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

app.get('/delete/:id', function(req, res) {
    const myId = req.params.id;
    const Mydatafile = JSON.parse(fs.readFileSync('data/users.json'));
    const newData = Mydatafile.filter(function(items) {
        if (items.id == req.params.id) {
            return false;
        } else {
            return true;
        }
    })
    fs.writeFileSync('data/users.json', JSON.stringify(newData));
    res.redirect("/");

});

app.get('/addUser', function(req, res) {
    res.render('addUser', {
        user: {
            id: 0,
            name: '',
            userlevel: '',
            date: '',
            status: '',
            email: ''
        }
    });
});
app.post('/addUser', function(req, res) {

    const Mydatafile = JSON.parse(fs.readFileSync('data/users.json'));
    const userData = {
        id: Mydatafile.length + 1,
        name: req.body.name,
        date: req.body.date,
        email: req.body.email


    }

    if (req.body.id == 0) {
        Mydatafile.push(userData);
        fs.writeFileSync('data/users.json', JSON.stringify(Mydatafile));
        res.redirect("/");
    } else {
        let updatedRecord = Mydatafile.map(function(item) {
            console.log(item.id, req.body.id);
            if (item.id == req.body.id) {
                let newItem = item;
                item.name = req.body.name;
                item.date = req.body.date;
                item.email = req.body.email;
                return newItem;
            } else {
                return item;
            }
        })
        fs.writeFileSync('data/users.json', JSON.stringify(updatedRecord));
        res.redirect("/");
    }


})

app.get('/update/:id', function(req, res) {
    const Mydatafile = JSON.parse(fs.readFileSync('data/users.json'));
    const updateID = req.params.id;
    const Newdata = Mydatafile.filter(function(items) {
        if (items.id == updateID) {
            return true;
        } else {
            return false;
        }
    })

    res.render("addUser.ejs", { user: Newdata[0] });

})


app.get('/', function(req, res) {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json').toString()));
    res.render('dashboard', { users });
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views/404.html'));
});

app.listen(6500);