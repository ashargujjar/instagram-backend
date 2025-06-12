const { ObjectId } = require("mongodb");
const { get } = require("../routes/form");
const { getDb } = require("../database/mongoConnect");
const Db = require("../database/mongoConnect").getDb;
class Post {
  constructor(username, image, url, title) {
    this.username = username;
    this.public_id = image;
    this.secure_url = url;
    this.title = title;
    this.like = {
      likes: 0,
      likedBy: [],
    };
    this.comments = [];
  }
  save() {
    const db = Db();
    return db.collection("post").insertOne(this);
  }
  static getPosts(username) {
    const db = Db();
    return db.collection("post").find({ username: username }).toArray();
  }
  static getPost(id) {
    const db = Db();
    return db.collection("post").findOne({ _id: new ObjectId(id) });
  }
  static incLike(id) {
    const db = Db();
    return db
      .collection("post")
      .updateOne({ _id: new ObjectId(id) }, { $inc: { "like.likes": 1 } });
  }
  static decLike(id) {
    const db = Db();
    return db
      .collection("post")
      .updateOne({ _id: new ObjectId(id) }, { $dec: { "like.likes": -1 } });
  }
  static getUserPostById(id) {
    const db = Db();
    return db.collection("post").findOne({ _id: new ObjectId(id) });
  }
  static deletePost(id) {
    // delete comment
    const db = Db();
    return db.collection("post").deleteOne({ _id: new ObjectId(id) });
  }
  static addComent(username, text, postId) {
    const db = getDb();
    return db
      .collection("post")
      .updateOne(
        { _id: new ObjectId(postId) },
        { $push: { comments: { username, text } } }
      );
  }
  static likePost(postId, userId) {
    const db = getDb();
    return db.collection("post").updateOne(
      { _id: new ObjectId(postId), "like.likedBy": { $ne: userId } },
      {
        $inc: { "like.likes": 1 },
        $push: { "like.likedBy": userId },
      }
    );
  }
  static disLikePost(postId, userId) {
    const db = getDb();
    return db.collection("post").updateOne(
      { _id: new ObjectId(postId), "like.likedBy": userId },
      {
        $inc: { "like.likes": -1 },
        $pull: { "like.likedBy": userId },
      }
    );
  }
}
module.exports = Post;
