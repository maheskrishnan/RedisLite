
/*
    1. simple key value datastore
    2. this datastore can contain multiple databases
    3. each database is stored in separate folder.
    4. each key-value is stored in .json file inside the database folder
    5. user entered database name and key name are converted to base32 before stored in filesystem
*/

module.exports = function (options){

    var fs = require('fs');
    var path = require('path');
    var base32 = require('base32');

    if (!options.rootDataDir) throw "rootDataDir: is not specified";
    if (!fs.existsSync(path.resolve(options.rootDataDir))) fs.mkdirSync(options.rootDataDir);


    var UserDB = function (dbName){
        var base32EncodedDBName = base32.encode(dbName);
        var fullDBDir = path.join(options.rootDataDir, base32EncodedDBName);
        if (!fs.existsSync(path.resolve(fullDBDir))) fs.mkdirSync(fullDBDir);
        this.dataDirectory= fullDBDir;
    };

    UserDB.prototype.valueFilePath= function(key){
        return path.join(this.dataDirectory, base32.encode(key));
    }

    UserDB.prototype.exists = function(key){
        var valueFilePath = this.valueFilePath(key);
        return fs.existsSync(valueFilePath);
    };

    UserDB.prototype.keys = function(){
        var arrKeys = fs.readdirSync(this.dataDirectory);
        arrKeys=arrKeys.map(function(fname){return base32.decode(fname);});
        return arrKeys;
    };

    UserDB.prototype.delete = function(key){
        if (this.exists(key)) {
            var valueFileName = this.valueFilePath(key);
            fs.unlinkSync(valueFileName);
        }
    };

    UserDB.prototype.get = function(key){
        if (this.exists(key)) {
            var valueFilePath = this.valueFilePath(key);
            var data = fs.readFileSync(valueFilePath, 'utf8');
            return JSON.parse(data);
        }else return null;
    };

    UserDB.prototype.set = function(key, value){
        var valueFilePath = this.valueFilePath(key);
        fs.writeFileSync(valueFilePath, JSON.stringify(value), 'utf8');
    };

    UserDB.prototype.hget = function(key, field){
        var obj = this.get(key);
        return obj[field];
    };

    UserDB.prototype.hset = function(key, field, value){
        var obj = this.get(key);
        obj[field]=value;
        this.set(key, obj);
    };


    var Provider = function(){};

    Provider.prototype.getOrCreateUserDB = function(dbName){ return new UserDB(dbName); };

    Provider.prototype.getNewRandomDBName = function(){
        var maxTimes = 1000;
        while(true){
            var rndNo = Math.floor(Math.random()*1000*1000*1000*1000*1000);
            var rndStr = rndNo.toString(36);
            var encodedRndStr = base32.encode(rndNo);
            var exists = fs.existsSync(path.join(options.rootDataDir, rndStr));
            if (!exists) return rndStr;
            maxTimes--;
            if (maxTimes<0) throw 'error unable to get new db name'
        }
    }

    return new Provider();

}


