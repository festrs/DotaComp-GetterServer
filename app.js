var mongo = require('mongoskin');
var schedule = require('node-schedule');
var request = require('request');
var dbURI = 'mongodb://localhost/watcherdb';
if (process.env.MONGODB_URI != null) {
  dbURI = process.env.MONGODB_URI;
}
var db = mongo.db(dbURI, {
    auto_reconnect : true,
    safe           : true
});
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
var ranking = 0;
var UpcomingTime = 0;
var NewsTime = 0;
var VODSTime = 0;
var TournamentTime = 0;
var ggTime = 0;

var proccessLiveGames = function(){
  // console.log(ranking+ " = Ranking time");
  // console.log(UpcomingTime+" = Upcoming time");
  // console.log(NewsTime+" = News time");
  // console.log(VODSTime+" = VODS time");
  // console.log(TournamentTime+" = Tournament time");
  console.log(ggTime+" = UpcomingGG time");
  if(ggTime >= 5*2){
    request('http://watcherd2phpserver.herokuapp.com/api/gg/matches/v120/index.php',setTimeout(function() {}, 50),function (error, response, body) {
      if (error){
        console.log('Error, UpcomingGG' + error);
      } 
      if (!error && response.statusCode == 200) {
        var savedBody = JSON.parse(body);
        collectionUpcomingGG.save({_id:"1", result:savedBody},{safe:true},function(err, objects) {
          if(!err){
            console.log('OK, adicionado com sucesso UpcomingGG');
          }else{
           console.log('Error, UpcomingGG');
          }
        });     
      }
    });
    ggTime = 0;
  }
  
  // if(NewsTime >= 33*2){
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
  //   NewsTime=0;
  // }

  // if(VODSTime >= 60*12*2){
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
  //   VODSTime=0;
  // }

  // if(ranking >= 60*24){
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
  //   ranking = 0;
  // }

  // });https://api.steampowered.com/IDOTA2Match_570/GetScheduledLeagueGames/v0001/?key=BB3D3E6CDF0500C64E74EAB466CF47F4
  // if(UpcomingTime >= 5*2){
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
  //   UpcomingTime = 0;
  // }

  request('https://api.steampowered.com/IDOTA2Match_570/GetLiveLeagueGames/v0001/?key=BB3D3E6CDF0500C64E74EAB466CF47F4', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var savedBody = JSON.parse(body);
      var resultJson = savedBody['result']; 
      collectionLiveGames.save({_id:"1", result:resultJson},{safe:true},function(err, objects) {
        if(!err){
          console.log('OK, adicionado com sucesso Live Games'); 
        }else{ 
          console.log('Error, Live Games');
        }
      });     
    }
  });


  // if(TournamentTime >= 60*24){
  //   request('https://api.steampowered.com/IDOTA2Match_570/GetLeagueListing/v0001/?key=BB3D3E6CDF0500C64E74EAB466CF47F4', function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       var savedBody = JSON.parse(body);
  //       var resultJson = savedBody['result'];
  //       var newTuornaments = {};
  //       request('http://api.steampowered.com/IEconItems_570/GetSchema/v0001/?key=BB3D3E6CDF0500C64E74EAB466CF47F4',setTimeout(function() {
  //         collectionTournaments.find().toArray(function(err, results) {
  //           for (var i = 0; i < resultJson['leagues'].length; i++) {
  //             var achou = 0;
  //             for (var j = 0; j < results[0]["result"]["leagues"].length; j++) {
  //               if(results[0]["result"]["leagues"][j]["leagueid"] == resultJson['leagues'][i]['leagueid']){ 
  //                 achou = 1;
  //                 if(!results[0]["result"]["leagues"][j]['new_name']){
  //                   results[0]["result"]["leagues"][j]['new_name'] = results[0]["result"]["leagues"][j]['name'].substring(11).replace(/_/gi, " ");
  //                 }
  //               }
  //             };
  //             if(achou == 0){                  
  //               results[0]["result"]["leagues"].push(resultJson['leagues'][i]);
  //             }
  //         };
  //         collectionTournaments.save({_id:"1", result:results[0]["result"]},{safe:true},function(err, objects) {
  //           if(!err){
  //             console.log('OK, adicionado com sucesso Tournaments without photo');
  //           }else{
  //            console.log('Error, Tournaments');
  //           }
  //         }); 
  //       });
  //       }, 50), function (error2, response2, body2) {
  //                 if (!error && response.statusCode == 200) {
  //                   var savedBodyItems = JSON.parse(body2);
  //                   var itens = savedBodyItems['result']['items'];
  //                   for (var i = 0; i < itens.length; i++) {
  //                       for (var j = 0; j < resultJson['leagues'].length; j++) {
  //                         if(itens[i]['defindex'] == resultJson['leagues'][j]['itemdef']){                      
  //                             resultJson['leagues'][j]['tournament_url'] = itens[i]['image_url_large'];
  //                             resultJson['leagues'][j]['new_name'] = itens[i]['name'];
  //                         }
  //                       };
  //                   };
  //                   collectionTournaments.save({_id:"1", result:resultJson},{safe:true},function(err, objects) {
  //                     if(!err){
  //                       console.log('OK, adicionado com sucesso Tournaments');
  //                     }else{
  //                      console.log('Error, Tournaments');
  //                     }
  //                   });     
  //                 }
  //             });
  //     }
  //   });
  //   TournamentTime =0;
  // }

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
	proccessLiveGames();
  //UpcomingTime++;
  ranking++; 
  NewsTime++;
  VODSTime++;
  TournamentTime++;
  ggTime++;
});




