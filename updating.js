var mongoose = require("mongoose");
var async   = require("async");
var request = require("request");
var q = require("q");
// Models
var LiveGamesModel = mongoose.model("LiveGames");
var UpComingGamesModel = mongoose.model("UpComingGames");
var EndedGamesModel = mongoose.model("EndedGames");
var TournamentsModel = mongoose.model("Tournaments");
var Teams = mongoose.model("Teams");

function requestTeamLogoUrl(ugcid, API_KEY) {
  return q.Promise(function(resolve, reject, notify) {
    setTimeout(function() {
      request("http://api.steampowered.com/ISteamRemoteStorage/GetUGCFileDetails/v1?ugcid="+ugcid+"&appid=570&key="+API_KEY, function (error, response, body) {
        if (error) {
          reject(error);
        }else {
          var savedBody = JSON.parse(body);
          var data = savedBody["data"];
          if (data){
            resolve(data["url"]);
          }
          resolve(null);   
        }
      });
    }, 500);
  });
}

function createNewTeam(ID, team, API_KEY){
  var newTeam = new Teams();
  newTeam._id = ID;
  newTeam.name = team["name"];
  newTeam.tag = team["tag"];
  newTeam.timeCreated = team["time_created"];
  newTeam.logo = team["logo"];
  newTeam.logoSponsor = team["logo_sponsor"];
  newTeam.countryCode = team["country_code"];
  newTeam.url = team["url"];
  
  requestTeamLogoUrl(team["logo"], API_KEY).then(function (value) {
    newTeam.logoUrl = value;
    newTeam.save(function (err, team) {
      if (err) {
        console.log(err);
      }else{
        console.log("team saved = "+ team.name + " with logo_url = " + team.logoUrl + " team_log = " + team.logo);
      }
    });
  }).catch(function (error) {
    if (error) {
      console.log(error);
    }
  }).done();
}


function getTeamInfo(teamID, API_KEY){
  setTimeout( function() {
    request("https://api.steampowered.com/IDOTA2Match_570/GetTeamInfoByTeamID/v001/?key="+API_KEY+"&start_at_team_id="+teamID+"&teams_requested=1", function (error, response, body) {
      if (error) {
        console.log(error);
      }
      if (!error) {
        var savedBody = JSON.parse(body);
        var result = savedBody["result"];
        var teams = result["teams"];
        if(teams.length > 0){
          var team = teams[0];
          createNewTeam(teamID, team, API_KEY);
        }   
      }
    });
  }, 500);
}

function findTeamByID(ID, API_KEY){
    Teams.findById(ID, function (err, team) {  
      if (err) {
          console.log(err);
      } else {
        if(team && team.logo_url === null){
          requestTeamLogoUrl(team.logo, API_KEY).then(function (url) {
            team.logoUrl = url;
            team.save(function (err, newTeam) {
              if (err) {
                console.log(err);
              }else{
                console.log("refreshed team saved = "+ newTeam.name + " with logo_url = " + newTeam.logoUrl + " team_log = " + newTeam.logo);
              }
            });
          });
        }else if (!team) {
          getTeamInfo(ID, API_KEY);
        }
      }
    });

}

module.exports.updateUrls = function(API_KEY) { 
  LiveGamesModel.find()
  .populate("properties.radiant_team")
  .populate("properties.dire_team")
  .populate("properties.players").exec(function(err, games) {
    if(err){ 
      return console.log(err); 
    }else{
      games.forEach(function(game){
        var gameString = JSON.stringify(game);
        var gameObject = JSON.parse(gameString);
        if(gameObject.radiant_team){
          findTeamByID(gameObject.radiant_team.team_id, API_KEY);
        }
        if(gameObject.dire_team){ 
          findTeamByID(gameObject.dire_team.team_id, API_KEY);
        }
      });
      return console.log("Teams Updated");
    }
  });
};









