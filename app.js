'use strict';
const express = require('express');
const passport = require('passport');
// var path = require('path');
// var app = express();
// const cors = require('cors');
// app.use(cors());

var app = express();
app.use(require('cors')());
app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').json());
app.use(require('express-session')({ 
    secret: 'keyboard cat', resave: true, saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

// var logger = require('morgan');
// app.use(logger('dev'));

// var bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// var cookieParser = require('cookie-parser');
// app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'public')));

// const session = require('express-session');
// app.use(session({

// }));

// DB & models
const db = require('./models');
db.sequelize.sync()
    .then(async() => {
        console.log('DB synced');
        await db.initialize();
        console.log('DB intialized');
    })
    .catch(error => {
        console.log(`Failed to sync db ${error.message}`)
    })

// routes
var routes = require('./routes/index');
app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            'error': {
                message: err.message,
                error: {}
            }
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        'error': {
            message: err.message,
            error: {}
        }
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
