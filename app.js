require('./db');
var mongoose = require('mongoose');
var schedule = require('node-schedule');
var request = require('request');
var async   = require('async');
var updating = require('./updating');

var API_KEY = "";
if(process.env.API_KEY != null){
  API_KEY = process.env.API_KEY;
}

var TournamentTime = 0;
var UpcomingAndEndedGames = 0;
var RefreshTeams = 0;

// Models
var LiveGamesModel = mongoose.model('LiveGames');
var UpComingGamesModel = mongoose.model('UpComingGames');
var EndedGamesModel = mongoose.model('EndedGames');
var TournamentsModel = mongoose.model('Tournaments');

var proccessAll = function(){

  console.log(TournamentTime+" = Tournament time");
  console.log(UpcomingAndEndedGames+" = UpcomingAndEndedGames time");
  console.log(RefreshTeams+" = RefreshTeams time");

  console.time("LiveGames");

  request('https://api.steampowered.com/IDOTA2Match_570/GetLiveLeagueGames/v0001/?key='+API_KEY, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var savedBody = JSON.parse(body);
      var resultJson = savedBody['result']; 
      var games = resultJson["games"];
      
      LiveGamesModel.remove({},function(err){
        if(err) console.log("Error removing liveGames err = "+ err);
      });

      LiveGamesModel.collection.insertMany(games,function (err,r){
        if(err) console.log("Error inserting liveGames err = "+ err);
      });
      
    }
  });

  console.timeEnd("LiveGames");


  console.time("Games updating");
  //30 minutes
  if (RefreshTeams >= 30*2){
    updating.updateUrls(API_KEY);    
    RefreshTeams = 0;
  }
  
  console.timeEnd("Games updating");


  console.time("UpcomingAndEndedGames");
  // 5 minutes
  if(UpcomingAndEndedGames >= 5*2){
    request('http://watcherd2phpserver.herokuapp.com/api/gg/matches/v120/index.php',setTimeout(function() {}, 50),function (error, response, body) {
      if (error){
        console.log('Error, Upcoming' + error);
      } 
      if (!error && response.statusCode == 200) {
        var savedBody = JSON.parse(body);

        UpComingGamesModel.remove({},function(err){
          if(err) console.log("Error removing upcoming err = "+ err);
        });

        EndedGamesModel.remove({},function(err){
          if(err) console.log("Error removing endedgames err = "+ err);
        });

        UpComingGamesModel.collection.insertMany(savedBody["eventSoon"],function (err,r){
          if(err) console.log("Error inserting upcoming err = "+ err);
        });

        EndedGamesModel.collection.insertMany(savedBody["eventDone"],function (err,r){
          if(err) console.log("Error inserting endedgames err = "+ err);
        });

      }
    });
     UpcomingAndEndedGames = 0;
  }

  console.timeEnd("UpcomingAndEndedGames");

  console.time("Tournament");
  // 24 hours
  if(TournamentTime >= 24*60*2){
    request('https://api.steampowered.com/IDOTA2Match_570/GetLeagueListing/v0001/?key='+API_KEY, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var savedBody = JSON.parse(body);
        var resultJson = savedBody['result'];

        TournamentsModel.remove({},function(err){
          if(err) console.log("Error removing tournament err = "+ err);
        });

        TournamentsModel.collection.insertMany(resultJson["leagues"],function (err,r){
          if(err) console.log("Error inserting tournament err = "+ err);
        });    
      }
    });
    TournamentTime =0;
  }

  console.timeEnd("Tournament");

};

var rule = new schedule.RecurrenceRule();
rule.second = [0, 30];

schedule.scheduleJob(rule, function(){
	proccessAll();
  TournamentTime++;
  UpcomingAndEndedGames++;
  RefreshTeams++;
});




