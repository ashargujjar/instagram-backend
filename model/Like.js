const Db = require("../database/mongoConnect").getDb;
const { useReducer } = require("react");
// inc in image class of count
const Image = require("../model/image");
class Like {
  constructor(username, postId) {
    this.username = username;
    this.postId = postId;
  }
  check(username, postId) {
    const db = Db();
    return db
      .collection("likes")
      .findOne({ username: username, postId: postId });
  }
  async save() {
    const db = Db();
    try {
      const liked = await Image.incLike(this.postId);
      if (liked) {
        return db.collection("likes").insertOne(this);
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
