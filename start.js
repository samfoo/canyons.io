require('babel/register');

var debug = require('debug')('canyons'),
    app = require('./server').app;

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('server listening on port ' + server.address().port);
});
