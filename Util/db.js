const mongo = require('mongodb').MongoClient;
const settings = require('../settings.json');
const LocalURL = 'mongodb://' + settings.db.DatabaseIP + ':' + settings.db.DatabasePort + '/' + settings.db.Database; // Use only if you're using hosting it locally and not with a VPS.
const url = `mongodb://${settings.db.user}:${settings.db.password}@${settings.db.DatabaseIP}/${settings.db.Database}`;
module.exports.MongoConnect = () => {
  return new Promise((resolve) => {
    mongo.connect(LocalURL).then((db) => {
      console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n") // Spacing xD
      global.dbo = db;
      if (this.int !== null) {
        clearInterval(this.int);
        this.int = null;
      }
      db.on('close', () => {
        console.log("The DB has closed, attempting to reconnect.")
        module.exports.AttemptReconnect();
      });
      db.on('error', (err) => {
        console.log(err);
      })
      console.log("The DB has been connected successfully!");
      resolve();
    });
  });
};
module.exports.MongoUpdate = (collection, identifier, newData) => {
  return new Promise((resolve, reject) => {
    const _collection = dbo.collection(collection);
    _collection.updateOne(identifier, {
      $set: newData,
    }, {
      upsert: true,
    }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};
module.exports.MongoInsert = (collection, data) => {
  return new Promise((resolve, reject) => {
    const _collection = dbo.collection(collection);
    _collection.insert(data, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};
module.exports.MongoFind = (collection, filter) => {
  return new Promise((resolve, reject) => {
    const _collection = dbo.collection(collection);
    _collection.find(filter, (err, docs) => {
      if (err) return reject(err);
      resolve(docs.toArray());
    });
  });
};

module.exports.MongoDelete = (collection, filter) => {
  return new Promise((resolve, reject) => {
    const _collection = dbo.collection(collection);
    _collection.deleteOne(filter, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

module.exports.AttemptReconnect = () => {
  this.int = setInterval(() => {
    console.log('Attempting to reconnect.');
    module.exports.MongoConnect();
  }, 5000);
};

module.exports.MongoDB = () => this.db;
