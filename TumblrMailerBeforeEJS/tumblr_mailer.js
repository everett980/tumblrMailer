var fs = require('fs');

var csvFile = fs.readFileSync('friend_list.csv', 'utf8');
//console.log(csvFile);

var emailTemplate = fs.readFileSync('email_template.html', 'utf8');
console.log(emailTemplate);

function csvParse(parseMe) {
	//by splitting on new lines, each element in the 'lines' arrary will be a different entry in our friends list
	var lines = parseMe.split("\n");
	//console.log(lines);
	//by looping through our lines array, we can process one 'entry' at a time and add that to our output
	var output = [];
	for(var i = 1; i < lines.length; i++) {
		var pushObject = new Object();
		var dividedLine = lines[i].split(",");
		pushObject.firstName = dividedLine[0];
		pushObject.lastName = dividedLine[1];
		pushObject.numMonthsSinceContact = dividedLine[2];
		pushObject.emailAddress = dividedLine[3];
		output.push(pushObject);
	}
	return output;
}

function templateLogger(parsedCVS) {
	for(var key in parsedCVS) {
		var modifiedEmail = emailTemplate.replace("FIRST_NAME", parsedCVS[key]['firstName']);
		var modifiedEmail = modifiedEmail.replace("NUM_MONTHS_SINCE_CONTACT", parsedCVS[key]['numMonthsSinceContact']);
		console.log(modifiedEmail);
	}
}

templateLogger(csvParse(csvFile));