const { post } = require("../routes/form");

const Db = require("../database/mongoConnect").getDb;

class Bio {
  constructor(username, file, url, name, bio) {
    this.username = username;
    this.bio = bio;
    this.public_id = file;
    this.secure_url = url;
    this.name = name;
    this.followers = 0;
    this.following = 0;
    this.post = 0;
  }
  save() {
    const db = Db();
    const query = { username: this.username };
    const update = {
      $set: {
        username: this.username,
        bio: this.bio,
        name: this.name,
        followers: this.followers,
        following: this.following,
        public_id: this.public_id,
        secure_url: this.secure_url,

        post: this.post,
      },
    };
    const options = { upsert: true };

    return db.collection("bio").updateOne(query, update, options);
  }
  static updateBio(username, file, url, name, bio) {
    console.log(username, name, bio);
    const db = Db();
    const query = { username: username },
      update = {
        $set: {
          bio: bio,
          name: name,
          public_id: file,
          secure_url: url,
        },
      },
      options = { upsert: true };
    return db.collection("bio").updateOne(query, update, options);
  }
  static getProfile(username) {
    const db = Db();
    return db.collection("bio").findOne({ username: username });
  }
  static incFollowing(username) {
    const db = Db();
    return db
      .collection("bio")
      .updateOne({ username: username }, { $inc: { following: 1 } });
  }
  static incFollower(username) {
    const db = Db();
    return db
      .collection("bio")
      .updateOne({ username: username }, { $inc: { followers: 1 } });
  }
  static decfollowing(username) {
    const db = Db();
    return db
      .collection("bio")
      .updateOne({ username: username }, { $inc: { following: -1 } });
  }
  static decFollower(username) {
    const db = Db();
    return db
      .collection("bio")
      .updateOne({ username: username }, { $inc: { followers: -1 } });
  }
  static incPost(username) {
    const db = Db();
    return db
      .collection("bio")
      .updateOne({ username: username }, { $inc: { post: 1 } });
  }
  static decPost(username) {
    const db = Db();
    return db
      .collection("bio")
      .updateOne({ username: username }, { $inc: { post: -1 } });
  }
}

module.exports = Bio;
