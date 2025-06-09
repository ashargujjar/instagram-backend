require("dotenv").config();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
let _db = null;
const connectMongo = async (callback) => {
  const client = await mongoClient.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  if (client) {
    _db = client.db("instagram");
    console.log("database connected");
    callback();
  } else {
    console.log("not found any client ");
  }
};
function getDb() {
  if (_db) {
    return _db;
  } else {
    console.log("no database found");
  }
}
module.exports.connectMongo = connectMongo;
module.exports.getDb = getDb;
