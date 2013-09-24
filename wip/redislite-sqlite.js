
/*
    1. sqlite based key-value store
    2. a table stores key & value
    2.1  rec_id, user_id, user_db_name, key, field, value
 */


module.exports = function (options){
    console.log('hi there');

    var UserDB = function (dbName, db){
        this.sqliteDb = db;
        this.dbName= dbName;
    };

    UserDB.prototype.exists = function(key){};

    UserDB.prototype.keys = function(){ }

    UserDB.prototype.delete = function(key){};

    UserDB.prototype.get = function(key){ };

    UserDB.prototype.set = function(key, value){
        this.sqliteDb.get('SELECT count(*) FROM key_value_table WHERE db=? AND key=? AND field=?' ,function(err, row) {
            if (row['count(*)']==0) {
                this.sqliteDb.run('INSERT INTO key_value_table (db, key, field, value) values (?,?,?,?)', function(err){

                });
            } else {

            }
        });
    };

    UserDB.prototype.hget = function(key, field){ };

    UserDB.prototype.hset = function(key, field, value){};


    var Provider = function(){};

    Provider.prototype.open = function(options, callback) {

        if (!options.dbFileName) throw "SQLite database file name needs to be specified...";

        var sqlite3 = this.sqlite3 = require('sqlite3').verbose();
        var db = this.db = new sqlite3.cached.Database(options.dbFileName);

        db.serialize(function() {
            var qryTblExist = "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='key_value_table'";
            db.get(qryTblExist, function(err, row) {
                var exists = (row['count(*)'] == 1);
                if (!exists) {
                    db.serialize(function() {
                        var createTableCmd = 'CREATE TABLE key_value_table (';
                        createTableCmd += " db TEXT, ";
                        createTableCmd += " key TEXT, ";
                        createTableCmd += " field TEXT, ";
                        createTableCmd += " value TEXT, ";
                        createTableCmd += " PRIMARY KEY (db, key, field) ";
                        createTableCmd += " ) ";
                        db.run(createTableCmd, function(err){
                            callback(err);
                        });
                    });
                }else{
                    callback();
                }
            });
        });

    }

    Provider.prototype.close = function() {  this.db.close();    };

    Provider.prototype.getOrCreateUserDB = function(dbName) {
        return new UserDB(dbName, this.db);
    };

    Provider.prototype.getNewRandomDBName = function() {};

    return new Provider();

}


var kvs = module.exports();
kvs.open({dbFileName:'db-sqlite3.sqlite3'}, function(err){

    var udb = kvs.getOrCreateUserDB('testdb');
    udb.set('day', {title:'good day', scores:[1,23]});
    console.log(udb.get('day').title);
    console.log(udb.get('day').scores);
    console.log(udb.get('day').scores.length);
    console.log(':>'+udb.hget('day','title'))
    udb.hset('day','title', 'very good day');
    console.log(':>'+udb.hget('day','title'))

    console.log('closing..');
    kvs.close();
});



