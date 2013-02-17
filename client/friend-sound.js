Template.hello.greeting = function () {
  return "Welcome to friend-sound !";
};

Template.hello.events({
  'click input' : function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
      console.log("You pressed the button");
  }
});


Template.audioplayer.artist = function () {
  return "Tricky";
};

Template.audioplayer.title = function () {
  return "Black Steel";
};

var player = function () {
  return Players.findOne(Session.get('player_id'));
};

//////
////// Initialization
//////

Meteor.startup(function () {
  // Allocate a new player id.
  //
  // check for a pre-existing player, and if it exists, make sure the server still
  // knows about us.
  var player_id = Session.get('player_id');
  if (!player_id) {
    player_id = Players.insert({name: smurfs[Math.floor(Math.random() * smurfs.length)], idle: false});
    Session.set('player_id', player_id);
  }

  // subscribe to all the players, the game i'm in, and all
  // the words in that game.
  Meteor.autorun(function () {
    Meteor.subscribe('players');

    if (Session.get('player_id')) {
      var me = player();
      /*
      if (me && me.game_id) {
        Meteor.subscribe('games', me.game_id);
        Meteor.subscribe('words', me.game_id, Session.get('player_id'));
      }
      */
    }
  });

  // send keepalives so the server can tell when we go away.
  //
  // XXX this is not a great idiom. meteor server does not yet have a
  // way to expose connection status to user code. Once it does, this
  // code can go away.
  Meteor.setInterval(function() {
    if (Meteor.status().connected)
      Meteor.call('keepalive', Session.get('player_id'));
  }, 20*1000);
});