var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

var csvFile = fs.readFileSync('friend_list.csv', 'utf8');
//console.log(csvFile);
var emailTemplate = fs.readFileSync('email_template.html', 'utf8');
//console.log(emailTemplate);

function csvParse(parseMe) {
	//by splitting on new lines, each element in the 'lines' arrary will be a different entry in our friends list
	var lines = parseMe.split("\n");
	//console.log(lines);
	//by looping through our lines array, we can process one 'entry' at a time and add that to our output
	var output = [];
	for(var i = 1; i < lines.length; i++) {
		var dividedLine = lines[i].split(",");
		var pushObject = {
			firstName : dividedLine[0],
			lastName : dividedLine[1],
			numMonthsSinceContact : dividedLine[2],
			emailAddress : dividedLine[3]
		}
		output.push(pushObject);
	}
	return output;
}

var client = tumblr.createClient({
  consumer_key: '***',
  consumer_secret: '***',
  token: '***',
  token_secret: '***'
});

var postsWithinWeek = [];
client.posts('everett980.tumblr.com', function(err, blog){
	for(var key in blog.posts) {
		var postDate = blog.posts[key].date;
		postDate = postDate.split(" ")[0].split("-");
		var postDateAsDate = new Date(postDate[0], (+postDate[1] - 1).toString(), postDate[2]);
		var todayDate = new Date();
		var howOldPostIs = Math.floor((todayDate.getTime() - postDateAsDate.getTime()) / (1000 * 3600 * 24));
		if(howOldPostIs < 7) {
			postsWithinWeek.push({
				title: blog.posts[key].title,
				href: blog.posts[key].short_url
			});
			//postsWithinWeek will actually end up displayed as newest first in the email.
			//This could be easily changed by using the reverse method that javascript has for arrays,
			//or by changing the email_template.html to work backwards.
		}
	}
	var parsedCVS = csvParse(csvFile);
	for (var entry in parsedCVS) {
		var customizedTemplate = ejs.render(emailTemplate, {
			firstName: parsedCVS[entry].firstName,
			numMonthsSinceContact: parsedCVS[entry].numMonthsSinceContact,
			latestPosts: postsWithinWeek
		});
		console.log(customizedTemplate);
		if(entry < (parsedCVS.length-1)) {
			console.log("\n\n---\n\n");
		}
	}
});












