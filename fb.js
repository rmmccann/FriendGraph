$(document).ready(function(){
	$.ajaxSetup({ cache: true });
	$.getScript('//connect.facebook.net/en_US/all.js', function(){
		FB.init({
			appId: '816516365030567',
		});

		FB.login(function(){
			FB.api('/me/friends', function(response){
				// console.log(response);
			});
		});

		FB.getLoginStatus(function(response) {
			if (response.status === 'connected')
			{
				FB.api('/me/friends', function(friends){
					if (friends && friends.data){
						friends = friends.data;
						//find edges between friends
						// var edges = [];

						//inner query to get edges
						FB.api({
							method: 'fql.query',
							// query: 'SELECT uid, name FROM user WHERE uid = me()'
							query: 'SELECT uid1, uid2 FROM friend WHERE uid1 IN (SELECT uid2 FROM friend WHERE uid1 = me()) AND uid2 IN (SELECT uid1 FROM friend WHERE uid2 = me())'
						}, function(connections) {
							//now format the data
							// var edges = connections;
							// var tmp = connections;
							// var x = d3.values(tmp);
							// console.log(x);

							
							var friendMap = new Object();
							// var friendMap = d3.map();//map fb ids to array index
							for(var i=0; i<friends.length; i++)
							{
								friendMap[friends[i].id] = i;
								// friendMap.set(friends[j].id, j);
							}
							// console.log(friendMap);

							var edges = [];
							for(var i=0; i<connections.length; i++)
							{
								// console.log("i, " + connections[i].uid1);
								if(friendMap[connections[i].uid1] && friendMap[connections[i].uid2])
								{
									edges[i] = 
									{
										source: friendMap[connections[i].uid1],
										target: friendMap[connections[i].uid2]
									};
								}
								else {//dummy edge
									edges[i] = 
									{
										source: 0, target:0
									};
								}
							}


							dataLoaded(friends, edges);
						});
						

					} else {
						console.log('Something goes wrong', friends);
					}
				});

/*
				FB.api({
					method: 'fql.query',
					// query: 'SELECT uid, name FROM user WHERE uid = me()'
					query: 'SELECT uid1, uid2 FROM friend WHERE uid1 IN (SELECT uid2 FROM friend WHERE uid1 = me()) AND uid2 IN (SELECT uid1 FROM friend WHERE uid2 = me())'
				}, function(data) {
					// console.log(data);
					dataLoaded(data);
					// var res = data[0].name;
					// alert(res);
				});
*/
			}
		});
	});
});
