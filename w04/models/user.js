const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let dbOp;
    if(this._id) {
      dbOp = db
      .collection('users')
      .updateOne({_id: this._id}, {$set: this});
    }
    if(this.email) {
      return dbOp 
      .then(result => {
        console.log('Email already exists')
      })
      .catch(err => {
        console.log(err);
      })
    }
    if(this.username) {
      return dbOp 
      .then(result => {
        console.log('Username already exists')
      })
      .catch(err => {
        console.log(err);
      })
    }
    else {
      dbOp = db
      .collection('users')
      .insertOne(this);}
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
    });  

  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users')
      .find({ _id: new mongodb.ObjectId(userId) })
      .next()
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
    });

  }



}
module.exports = User;
