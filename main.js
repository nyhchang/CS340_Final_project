var express = require('express');
var app = express();

var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var mysql = require('./dbcon.js');
var getFunctions = require('./getFunctions.js');


app.set('port', 25252);

const request = require('request');

app.get('/', function (req, res, next) {
    res.render('index');
});

app.get('/servantList', function (req, res, next) {
    var context = {};
    mysql.pool.query("SELECT a.id, a.name, a.rarity, c.name as class, s1.name as skill1, s2.name as skill2, s3.name as skill3 FROM servants a INNER JOIN classes c ON c.id = a.class INNER JOIN skills s1 ON s1.id = a.skill_1 INNER JOIN skills s2 ON s2.id = a.skill_2 INNER JOIN skills s3 ON s3.id = a.skill_3", function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        if (rows) {
            var servlist = [];
            for (var row in rows) {
                var addItem = {
                    'ID': rows[row].id,
                    'Servant': rows[row].name,
                    'Rarity': rows[row].rarity,
                    'Class': rows[row].class,
                    'Skill1': rows[row].skill1,
                    'Skill2': rows[row].skill2,
                    'Skill3': rows[row].skill3
                };

                servlist.push(addItem);

            }

            context.servlist = servlist;
        }
        res.render('servantList', context);
    })
});

app.get('/masters', function (req, res, next) {
    var context = {};
    mysql.pool.query("SELECT id, name, Master_Level FROM masters ORDER BY id ASC", function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        if (rows) {
            var masters = [];
            for (var row in rows) {
                var addItem = {
                    'userName': rows[row].name,
                    'masterLevel': rows[row].Master_Level,
                };

                masters.push(addItem);

            }

            context.masters = masters;
        }
        res.render('masters', context);
    })
});

app.get('/materialsList', function (req, res, next) {
    var context = {};
    mysql.pool.query("SELECT id, name FROM materials ORDER BY id ASC", function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        if (rows) {
            var materials = [];
            for (var row in rows) {
                var addItem = {
                    'id': rows[row].id,
                    'material': rows[row].name,
                };

                materials.push(addItem);

            }

            context.materials = materials;
        }
        res.render('materialsList', context);
    })
});

app.get('/mastersServants', function (req, res, next) {
    res.render('mastersServants');
});

app.get('/mastersMaterials', function (req, res, next) {
    var context = {};
    mysql.pool.query("SELECT m.name as userName, mat.name as material, list.quantity as quantity FROM materials_list list INNER JOIN masters m ON m.id = list.Master_id INNER JOIN materials mat ON mat.id = list.material_id ORDER BY list.Master_id ASC", function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        if (rows) {
            var mastmats = [];
            for (var row in rows) {
                var addItem = {
                    'userName': rows[row].userName,
                    'material': rows[row].material,
                    'quantity': rows[row].quantity
                };

                mastmats.push(addItem);

            }

            context.mastersMaterials = mastmats;
        }
        res.render('mastersMaterials', context);
    })

});

app.get('/skillsList', function (req, res, next) {
    var context = {};
    mysql.pool.query("SELECT id, name FROM skills ORDER BY id ASC", function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        if (rows) {
            var skills = [];
            for (var row in rows) {
                var addItem = {
                    'id': rows[row].id,
                    'skill': rows[row].name,
                };

                skills.push(addItem);

            }

            context.skills = skills;
        }
        res.render('skillsList', context);
    })
});

app.get('/classesList', function (req, res, next) {
    var context = {};
    mysql.pool.query("SELECT DISTINCT a.id, a.name as class, w.name as cWeakness FROM classes a INNER JOIN classes w ON w.id = a.weakness ORDER BY a.id ASC", function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        if (rows) {
            var classes = [];
            for (var row in rows) {
                var addItem = {
                    'id': rows[row].id,
                    'class': rows[row].class,
                    'cWeakness': rows[row].cWeakness
                };

                classes.push(addItem);

            }

            context.classes = classes;
        }
        res.render('classesList', context);
    })

});

//Error 404 - Page not found
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

//Error handler	
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

//Start server
app.listen(app.get('port'), function () {
    console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port'));
    console.log('Press Ctrl-C to terminate.')
});

