
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
        this.userDBDataDirectory= fullDBDir;
    };

    UserDB.prototype.valueFilePath= function(key){
        return path.join(this.userDBDataDirectory, base32.encode(key));
    }

    UserDB.prototype.exists = function(key){
        var valueFilePath = this.valueFilePath(key);
        return fs.existsSync(valueFilePath);
    };

    UserDB.prototype.removeDB = function (){
        var fullDBDir = this.userDBDataDirectory;
        if (fs.existsSync(path.resolve(fullDBDir))){
            var arrFiles = fs.readdirSync(path.resolve(fullDBDir));
            arrFiles.forEach(function(filename){
                var filepath = path.join(path.resolve(fullDBDir), filename);
                fs.unlinkSync(filepath);
            });
            fs.rmdirSync(fullDBDir);
        }
    };


    UserDB.prototype.keys = function(){
        var arrKeys = fs.readdirSync(this.userDBDataDirectory);
        arrKeys=arrKeys.map(function(fname){return base32.decode(fname);});
        return arrKeys;
    };

    UserDB.prototype.delete = function(key){
        if (this.exists(key)) {
            var valueFileName = this.valueFilePath(key);
            fs.unlinkSync(valueFileName);
            return true;
        }return false;
    };


    UserDB.prototype.rename = function(key, newKey){
        if (this.exists(key)) {
            if (this.exists(newKey)) return false;
            var valueFilePath = this.valueFilePath(key);
            var valueFilePathNew = this.valueFilePath(newKey);
            fs.renameSync(valueFilePath, valueFilePathNew);
            return true;
        }else return false;
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
        return this.get(key);
    };

    UserDB.prototype.hget = function(key, field){
        var obj = this.get(key);
        if (obj!= null) return obj[field];
        else return null;
    };

    UserDB.prototype.hset = function(key, field, value){
        var obj = {};
        if (this.exists(key)) obj=this.get(key);
        obj[field]=value;
        this.set(key, obj);
        return this.hget(key, field);
    };


    var Provider = function(){};

    Provider.prototype.getOrCreateUserDB = function(dbName){ return new UserDB(dbName); };

    Provider.prototype.getUserDBList = function() {
        var arrDBList = fs.readdirSync(options.rootDataDir);
        arrDBList=arrDBList.map(function(fname){return base32.decode(fname);});
        return arrDBList;
    };

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

    Provider.prototype.testDB = function (dbname, recordsCount){
        var st = process.hrtime();
        var testdb = new UserDB(dbname);

        var arrKey = [];
        var c=0;
        while(recordsCount>c){
            c++;
            arrKey.push(''+Math.random());
        }

        arrKey.forEach(function(key){ testdb.set(key,key); });
        var df = process.hrtime(st);
        console.log('set::diff: s:'+df[0]+' ns:'+df[1]/1000000000);

        var v = '';
        arrKey.forEach(function(key){ v=testdb.get(key); });
        var df = process.hrtime(st);
        console.log('get::diff: s:'+df[0]+' ns:'+df[1]/1000000000);

        testdb.removeDB();

    };

    return new Provider();

}


