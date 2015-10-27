Posts = new Mongo.Collection('posts');

Posts.allow({
  update: function (userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); },
});

Meteor.methods({
  PostInsert: function(postAttributes) {
    check(this.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });
    
    var postWithSameLink = Posts.findOne({url: postAtributes.url});
    if (postWithSameLink) {
      return {
        postExists: true, _id: postWithSameLink._id
      }
    }
    
    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
    
    var PostId = Posts.insert(post);
    
    return {
      _id: postId
    };
  }
});