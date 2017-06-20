require("./db");
var mongoose = require("mongoose");
var schedule = require("node-schedule");
var request = require("request");
var async   = require("async");
var updating = require("./updating");
var q = require("q");

var API_KEY = "";
if(process.env.API_KEY != null){
  API_KEY = process.env.API_KEY;
}

var TournamentTime = 0;
var UpcomingAndEndedGames = 0;
var RefreshTeams = 0;
var MaintainBotAlive = 0;
// Models
var LiveGamesModel = mongoose.model("LiveGames");
var UpComingGamesModel = mongoose.model("UpComingGames");
var EndedGamesModel = mongoose.model("EndedGames");
var TournamentsModel = mongoose.model("Tournaments");

function updateUpComingAndEndedGames(){
    request("http://watcherd2phpserver.herokuapp.com/api/gg/matches/v120/index.php",setTimeout(function() {}, 50),function (error, response, body) {
      if (error){
        console.log("Error, Upcoming" + error);
      } 
      if (!error && response.statusCode === 200) {
        var savedBody = JSON.parse(body);
        var upComingGames = savedBody["eventSoon"];
        var endedGames = savedBody["eventDone"];
        UpComingGamesModel.remove({},function(err){
          if(err) { 
            console.log("Error removing upcoming err = "+ err);
          }
        }).then(function(){
          if(upComingGames.length > 0){
            UpComingGamesModel.collection.insertMany(upComingGames,function (err,r){
              if(err) { 
                console.log("Error inserting upcoming err = "+ err);
              }
            });
          }
        });

        EndedGamesModel.remove({},function(err){
            if(err) {
              console.log("Error removing endedgames err = "+ err);
            }
          }).then(function(){
            if(endedGames.length > 0){
              EndedGamesModel.collection.insertMany(endedGames,function (err,r){
                if(err) {
                  console.log("Error inserting endedgames err = "+ err);
                }
              });               
            }
          });
      }
    });
}

function maintainBootAlive(){
  request("https://festrs-lendingbot.herokuapp.com",setTimeout(function() {}, 50),function (error, response, body) {
    if (error){
      console.log("Error, MantainBootAlive " + error);
    }
  });
}

function updateTournaments(){
  return q.Promise(function(resolve, reject, notify) {
    setTimeout(function(){
      request("https://api.steampowered.com/IDOTA2Match_570/GetLeagueListing/v0001/?key="+API_KEY, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var savedBody = JSON.parse(body);
          var resultJson = savedBody["result"];

          TournamentsModel.remove({},function(err){
            if(err) {
              reject(err);
            }
          }).then(function(){
            TournamentsModel.collection.insertMany(resultJson["leagues"],function (err,r){
              if(err) {
                reject(err);
              }
              resolve("Torunaments updated");
            }); 
          });
        }
      });
    },500);
  });
}

var proccessAll = function(){

  console.log(TournamentTime+" = Tournaments time");
  console.log(UpcomingAndEndedGames+" = UpcomingAndEndedGames time");
  console.log(RefreshTeams+" = RefreshTeams time");

  console.time("LiveGames");

  setTimeout(function(){
    request("https://api.steampowered.com/IDOTA2Match_570/GetLiveLeagueGames/v0001/?key="+API_KEY, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var savedBody = JSON.parse(body);
        var resultJson = savedBody["result"]; 
        var games = resultJson["games"];
        
        LiveGamesModel.remove({},function(err) {
          if(err) { 
            console.log("Error removing liveGames err = "+ err); 
          } 
        }).then(function(){
          if(games.length > 0){
            LiveGamesModel.collection.insertMany(games,function (err,r){
              if(err) {
                console.log("Error inserting liveGames err = "+ err);
              }
            });             
          }
        });
      }
    });
  },500);

  console.timeEnd("LiveGames");


  console.time("Games updating");
  // 30 minutos
  if (RefreshTeams >= 30*2) {
    updating.updateUrls(API_KEY);    
    RefreshTeams = 0;
  }
  
  console.timeEnd("Games updating");


  console.time("UpcomingAndEndedGames");
  // 5 minutes
  if(UpcomingAndEndedGames >= 5*2){
    updateUpComingAndEndedGames();
    UpcomingAndEndedGames = 0;
  }

  console.timeEnd("UpcomingAndEndedGames");

  console.time("Tournament");
  // 24 hours
  if(TournamentTime >= 24*60*2){
    updateTournaments();
    TournamentTime =0;
  }

  console.timeEnd("Tournament");

  console.time("MaintainBotAlive");
  // 5 minutes
  if(MaintainBotAlive >= 29*2){
    //maintainBootAlive();
    MaintainBotAlive = 0;
  }

  console.timeEnd("MaintainBotAlive");

};

var rule = new schedule.RecurrenceRule();
rule.second = [0, 30];

schedule.scheduleJob(rule, function() {
	proccessAll();
  TournamentTime++;
  UpcomingAndEndedGames++;
  RefreshTeams++;
  MaintainBotAlive++;
});




