var mongo = require('mongoskin');
var schedule = require('node-schedule');
var request = require('request');
var db = mongo.db('mongodb://felipe:com:8768@alex.mongohq.com:10020/followdota2?auto_reconnect',{w:'majority'});
var collectionTournaments = db.collection('Tournaments');
var collectionLiveGames = db.collection('LiveGames');
var collectionStreams = db.collection('Streams');
var collectionRank = db.collection('Ranking');
var collectionUpcomingGG = db.collection('UpcomingGG');
var collectionUpcoming = db.collection('Upcoming');
var collectionVODS = db.collection('Vods');
var collectionNews = db.collection('News');
var collectionNewStreams = db.collection('NewStreams');
var collectionLiveStreams = db.collection('LiveStreams');
var collectionEndedGames = db.collection('EndedGames');
var hour = 0;
var UpcomingTime = 0;
var NewsTime = 0;
var VODSTime = 0;
var TournamentTime = 0;
var fs = require('fs');

var url = require('url');
var http = require('http');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};



// // App variables
// var file_url = 'http://cdn.dota2.com/apps/570/scripts/items/items_game.63caf4621c13bb49d11dfbcc21de20f983646edc.txt';
// var DOWNLOAD_DIR = './downloads/';

// // We will be downloading the files to a directory, so make sure it's there
// // This step is not required if you have manually created the directory
// var mkdir = 'mkdir -p ' + DOWNLOAD_DIR;
// var child = exec(mkdir, function(err, stdout, stderr) {
//     if (err) throw err;
//     else download_file_httpget(file_url);
// });

// // Function to download file using HTTP.get
// var download_file_httpget = function(file_url) {

// var options = {
//     host: url.parse(file_url).host,
//     port: 80,
//     path: url.parse(file_url).pathname
// };

// var file_name = url.parse(file_url).pathname.split('/').pop();
// var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);


// var request = http.get(file_url, function(response) {
//     response.pipe(file);
//     file.on('finish', function() {
//       file.close();
//       console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
//     });
//   });
// };

var proccessLiveGames = function(){
  console.log(hour+ " = Ranking time");
  console.log(UpcomingTime+" = Upcoming time");
  console.log(NewsTime+" = News time");
  console.log(VODSTime+" = VODS time");
  console.log(TournamentTime+" = Tournament time");
  // if(ggTime >= 5*2){
  //   request('http://watcherd2phpserver.herokuapp.com/api/gg/matches/v120/index.php',setTimeout(function() {}, 50),function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       var savedBody = JSON.parse(body);
  //       collectionUpcomingGG.save({_id:"1", result:savedBody},{safe:true},function(err, objects) {
  //         if(!err){
  //           console.log('OK, adicionado com sucesso UpcomingGG');
  //         }else{
  //          console.log('Error, UpcomingGG');
  //         }
  //       });     
  //     }
  //   });
  //   ggTime = 0;
  // }
  
  //   request('http://watcherd2phpserver.herokuapp.com/api/news/v150/index.php',setTimeout(function() {}, 50), function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       var savedBody = JSON.parse(body);
  //       collectionNews.save({_id:"1", result:savedBody},{safe:true},function(err, objects) {
  //         if(!err){
  //           console.log('OK, adicionado com sucesso News');
  //         }else{
  //          console.log('Error, News');
  //         }
  //       });     
  //     }
  //   });
  //   request('http://watcherd2phpserver.herokuapp.com/api/stream/v160/index.php',setTimeout(function() {}, 50), function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       var savedBody = JSON.parse(body);
  //       collectionVODS.save({_id:"1", result:savedBody},{safe:true},function(err, objects) {
  //         if(!err){
  //           console.log('OK, adicionado com sucesso VODS');
  //         }else{
  //          console.log('Error, VODS');
  //         }
  //       });     
  //     }
  //   });

  //   request('http://watcherd2phpserver.herokuapp.com/api/rankings/v150/index.php',setTimeout(function() {}, 50), function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       var savedBody = JSON.parse(body);
  //       collectionRank.save({_id:"1", result:savedBody},{safe:true},function(err, objects) {
  //         if(!err){
  //           console.log('OK, adicionado com sucesso Rankings');
  //         }else{
  //          console.log('Error, Rankings');
  //         }
  //       });     
  //     }
  //   });


  // // request('http://watcherd2phpserver.herokuapp.com/api/jd/matches/v130/index.php', function (error, response, body) {
  // //   if (!error && response.statusCode == 200) {
  // //     var savedBody = JSON.parse(body);
  // //     collectionLiveStreams.save({_id:"1", result:savedBody},{safe:true},function(err, objects) {
  // //       if(!err){
  // //         console.log('OK, adicionado com sucesso Live Streams'); 
  // //       }else{ 
  // //         console.log('Error, Live Streams');
  // //       }
  // //     });     
  // //   }
  // // });https://api.steampowered.com/IDOTA2Match_570/GetScheduledLeagueGames/v0001/?key=BB3D3E6CDF0500C64E74EAB466CF47F4
  //   request('https://api.steampowered.com/IDOTA2Match_570/GetScheduledLeagueGames/v0001/?key=BB3D3E6CDF0500C64E74EAB466CF47F4', function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       var savedBody = JSON.parse(body);
  //       var resultJson = savedBody['result']; 
  //       collectionUpcoming.save({_id:"1", result:resultJson},{safe:true},function(err, objects) {
  //         if(!err){
  //           console.log('OK, adicionado com sucesso Upcoming'); 
  //         }else{ 
  //           console.log('Error, Upcoming');
  //         }
  //       });     
  //     }
  //   });


  // request('https://api.steampowered.com/IDOTA2Match_570/GetLiveLeagueGames/v0001/?key=BB3D3E6CDF0500C64E74EAB466CF47F4', function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     var savedBody = JSON.parse(body);
  //     var resultJson = savedBody['result']; 
  //     collectionLiveGames.save({_id:"1", result:resultJson},{safe:true},function(err, objects) {
  //       if(!err){
  //         console.log('OK, adicionado com sucesso Live Games'); 
  //       }else{ 
  //         console.log('Error, Live Games');
  //       }
  //     });     
  //   }
  // });


    request('https://api.steampowered.com/IDOTA2Match_570/GetLeagueListing/v0001/?key=BB3D3E6CDF0500C64E74EAB466CF47F4', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var savedBody = JSON.parse(body);
        var resultJson = savedBody['result'];
        var newTuornaments = {};
        request('http://api.steampowered.com/IEconItems_570/GetSchema/v0001/?key=BB3D3E6CDF0500C64E74EAB466CF47F4',setTimeout(function() {
          collectionTournaments.find().toArray(function(err, results) {
            for (var i = 0; i < resultJson['leagues'].length; i++) {
              var achou = 0;
              for (var j = 0; j < results[0]["result"]["leagues"].length; j++) {
                if(results[0]["result"]["leagues"][j]["leagueid"] == resultJson['leagues'][i]['leagueid']){ 
                  achou = 1;
                  if(!results[0]["result"]["leagues"][j]['new_name']){
                    results[0]["result"]["leagues"][j]['new_name'] = results[0]["result"]["leagues"][j]['name'].substring(11).replace(/_/gi, " ");
                  }
                }
              };
              if(achou == 0){                  
                results[0]["result"]["leagues"].push(resultJson['leagues'][i]);
              }
          };
          collectionTournaments.save({_id:"1", result:results[0]["result"]},{safe:true},function(err, objects) {
            if(!err){
              console.log('OK, adicionado com sucesso Tournaments without photo');
            }else{
             console.log('Error, Tournaments');
            }
          }); 
        });
        }, 50), function (error2, response2, body2) {
                  if (!error && response.statusCode == 200) {
                    var savedBodyItems = JSON.parse(body2);
                    var itens = savedBodyItems['result']['items'];
                    for (var i = 0; i < itens.length; i++) {
                        for (var j = 0; j < resultJson['leagues'].length; j++) {
                          if(itens[i]['defindex'] == resultJson['leagues'][j]['itemdef']){                      
                              resultJson['leagues'][j]['tournament_url'] = itens[i]['image_url_large'];
                              resultJson['leagues'][j]['new_name'] = itens[i]['name'];
                          }
                        };
                    };
                    collectionTournaments.save({_id:"1", result:resultJson},{safe:true},function(err, objects) {
                      if(!err){
                        console.log('OK, adicionado com sucesso Tournaments');
                      }else{
                       console.log('Error, Tournaments');
                      }
                    });     
                  }
              });
      }
    });


  // //if(EndedTime >= 1*60*24*1*2){
  //   request('https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v0001/?key=BB3D3E6CDF0500C64E74EAB466CF47F4&tournament_games_only=1&min_players=10&matches_requested=40', function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       var savedBody = JSON.parse(body);
  //       var resultJson = savedBody['result'];
  //       //RADIANT
  //       for (var j = 0; j < resultJson['matches'].length; j++) {
  //         request('https://api.steampowered.com/IDOTA2Match_570/GetTeamInfoByTeamID/v0001/?key=BB3D3E6CDF0500C64E74EAB466CF47F4&teams_requested=1&start_at_team_id='+resultJson['matches'][j]['radiant_team_id'], function (error2, response2, body2) {
  //           if (!error2 && response2.statusCode == 200) {
  //             var savedBodyTeam = JSON.parse(body2);
  //             var team = savedBodyTeam['result']['teams'][0];
  //             request('http://api.steampowered.com/ISteamRemoteStorage/GetUGCFileDetails/v1/?key=BB3D3E6CDF0500C64E74EAB466CF47F4&appid=570&ugcid='+team['logo'], function (error3, response3, body3) {
  //               if (!error3 && response3.statusCode == 200) {
  //                 var savedBodyLogo = JSON.parse(body3);
  //                 var logo = savedBodyLogo['data'];
  //                 resultJson['matches'][j]['radiant_logo_url'] = [];
  //                 resultJson['matches'][j]['radiant_logo_url'] = logo['url'];
  //               }
  //             });
  //           }
  //         });
  //         //DIRE
  //         request('https://api.steampowered.com/IDOTA2Match_570/GetTeamInfoByTeamID/v0001/?key=BB3D3E6CDF0500C64E74EAB466CF47F4&teams_requested=1&start_at_team_id='+resultJson['matches'][j]['dire_team_id'], function (error2, response2, body2) {
  //           if (!error2 && response2.statusCode == 200) {
  //             var savedBodyTeam = JSON.parse(body2);
  //             var team = savedBodyTeam['result']['teams'][0];
  //             request('http://api.steampowered.com/ISteamRemoteStorage/GetUGCFileDetails/v1/?key=BB3D3E6CDF0500C64E74EAB466CF47F4&appid=570&ugcid='+team['logo'], function (error3, response3, body3) {
  //               if (!error3 && response3.statusCode == 200) {
  //                 var savedBodyLogo = JSON.parse(body3);
  //                 var logo = savedBodyLogo['data'];    
  //                 resultJson['matches'][j]['dire_logo_url'] = [];        
  //                 resultJson['matches'][j]['dire_logo_url'] = logo['url'];
  //               }
  //             });
  //           }
  //         });
  //       };

  //       collectionEndedGames.save({_id:"1", result:resultJson},{safe:true},function(err, objects) {
  //         if(!err){
  //           console.log('OK, adicionado com sucesso Ended Games'); 
  //         }else{ 
  //           console.log('Error, Ended Games');
  //         }
  //       });     
  //     }
  //   });
  //   EndedTime =0;
  // //}

  // request('https://api.twitch.tv/kraken/streams?game=Dota+2&limit=15', function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     var savedBody = JSON.parse(body);
  //     collectionStreams.save({_id:"1", result:savedBody},{safe:true},function(err, objects) {
  //       if(!err){
  //         console.log('OK, adicionado com sucesso New Streams'); 
  //       }else{ 
  //         console.log('Error, New Streams');
  //       }
  //     });     
  //   }
  // });


};


var rule = new schedule.RecurrenceRule();
rule.second = [0, 30];

schedule.scheduleJob(rule, function(){
  //download_file_httpget(file_url);
  proccessLiveGames();
  UpcomingTime++;
  hour++; 
  NewsTime++;
  VODSTime++;
  TournamentTime++;
});




