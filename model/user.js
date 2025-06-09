const { ObjectId } = require("mongodb");

const Db = require("../database/mongoConnect").getDb;
const Image = require("../model/image");
const { getDb } = require("../database/mongoConnect");
class User {
  constructor(email, password, fullname, username) {
    this.email = email;
    this.password = password;
    this.fullname = fullname;
    this.username = username;
    this.following = [];
    this.follower = [];
  }
  save() {
    const db = Db();
    return db.collection("user").insertOne(this);
  }
  static checkFollowing(username, follower) {
    const db = Db();
    return db
      .collection("user")
      .findOne({ username: username, following: new ObjectId(follower) });
  }
  static checkUsername(username) {
    const db = Db();
    return db.collection("user").findOne({ username: username });
  }
  static Login(username, password) {
    const db = Db();
    return db
      .collection("user")
      .findOne(
        { username: username, password: password },
        { projection: { password: 0 } }
      );
  }
  static addFollowing(username, followingTo) {
    const db = Db();
    return db
      .collection("user")
      .updateOne(
        { username: username },
        { $addToSet: { following: new ObjectId(followingTo) } }
      );
  }
  static removeFollowing(username, followingTo) {
    const db = Db();
    return db
      .collection("user")
      .updateOne(
        { username: username },
        { $pull: { following: new ObjectId(followingTo) } }
      );
  }
  static addFollower(username, follower) {
    const db = Db();
    return db
      .collection("user")
      .updateOne(
        { _id: new ObjectId(username) },
        { $addToSet: { follower: new ObjectId(follower) } }
      );
  }
  static removeFollower(username, follower) {
    const db = Db();
    return db
      .collection("user")
      .updateOne(
        { _id: new ObjectId(username) },
        { $pull: { follower: new ObjectId(follower) } }
      );
  }
  static getAllExcept(username) {
    const db = Db();
    return db
      .collection("user")
      .find({ username: { $ne: username } }, { projection: { password: 0 } })
      .toArray();
  }
  static getUserById(id) {
    const db = Db();
    return db.collection("user").findOne({ _id: new ObjectId(id) });
  }
  static async getAllFollowings(id) {
    const db = Db();

    const usersId = await db
      .collection("user")
      .find({ _id: new ObjectId(id) })
      .toArray();
    const following = usersId[0]?.following;
    const followingUsers = await db
      .collection("user")
      .find(
        { _id: { $in: following } },
        { projection: { password: 0, follower: 0 } }
      )
      .toArray();
    return followingUsers;
  }
  static async GetNotFollowings(id) {
    const db = Db();
    const usersId = await db
      .collection("user")
      .find({ _id: new ObjectId(id) })
      .toArray();
    const following = usersId[0]?.following;
    const notFollowing = await db
      .collection("user")
      .find(
        { _id: { $nin: [...following, new ObjectId(id)] } },
        { projection: { password: 0, follower: 0 } }
      )
      .toArray();
    console.log("notFollowing", notFollowing);
    return notFollowing;
  }
  static async getAllFollowingsPost(userId) {
    const db = getDb();
    const followings = await db
      .collection("user")
      .find({ _id: new ObjectId(userId) }, { following: 1, _id: 0 })
      .toArray();
    console.log(followings);
    const id = followings[0];
    if (id.following.length > 0) {
      const users = await db
        .collection("user")
        .find({ _id: { $in: id.following } }, { username: 1, _id: 0 })
        .toArray();
      const usernames = users.map((u) => u.username);
      const post = await db
        .collection("post")
        .find({ username: { $in: usernames } })
        .toArray();
      return post;
    } else {
      return false;
    }
  }
}

module.exports = User;
