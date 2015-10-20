require('babel/register');

var db = require('../src/db'),
    sql = require('sql');

var users = sql.define({
  name:    'users',
  columns: [
    {
      name:       "id",
      dataType:   "uuid",
      primaryKey: true
    },
    {
      name:     "email",
      dataType: "text"
    },
    {
      name:     "password",
      dataType: "text"
    }
  ]
})

exports.up = function(next) {
    db.query(users.create().toQuery().text)
        .then(() => next())
        .catch((e) => next(e));
};

exports.down = function(next) {
    console.log(users.drop().toQuery().text);
    db.query(users.drop().toQuery().text)
        .then(() => next())
        .catch((e) => next(e));
};
