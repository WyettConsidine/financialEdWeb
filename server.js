/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
//Cur Path on Blue Fish PC - C:\Users\wyett\OneDrive\Documents\myWebsite\Website\Website>

var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// //Create Database Connection
// var pgp = require('pg-promise')();

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.  We'll be using localhost and run our database on our local machine (i.e. can't be access via the Internet)
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab, we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database.  You'll need to set a password USING THE PSQL TERMINAL THIS IS NOT A PASSWORD FOR POSTGRES USER ACCOUNT IN LINUX!
**********************/

// //DATABASE STUFF
// let dbConfig = {
//  	host: 'localhost',
//  	port: 5432,
//  	database: 'cscifinal', /* Change the databse here**/
//  	user: 'postgres',
// 	password: 'pwd'
// };

// const isProduction = process.env.NODE_ENV === 'production';
// dbConfig = isProduction ? process.env.DATABASE_URL : dbConfig;
// let db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory



/*********************************
 Below we'll add the get & post requests which will handle:
   - Database access
   - Parse parameters from get (URL) and post (data package)
   - Render Views - This will decide where the user will go after the get/post request has been processed

************************************/

// login page  THIS IS THE INITIAL PAGE
app.get('/', function(req, res) {
	res.render('pages/home',{		
		my_title:"Wyett Considine"
	});
});

app.get('/home', function(req, res) {
	res.render('pages/home',{
		my_title:"Wyett Considine"
	});
});

app.get('/impFinNum', function(req, res) {
	res.render('pages/impFinNum',{
		my_title:"Wyett Considine"
	});
});


app.get('/whyFam', function(req, res) {
	res.render('pages/whyFam',{
		my_title:"WDC: Contact Me"
	});
});

app.get('/whyDiff', function(req, res) {
	res.render('pages/whyDiff',{
		my_title:"WDC: Contact Me"
	});
});

app.get('/culture', function(req, res) {
	res.render('pages/culture',{
		my_title:"WDC: Contact Me"
	});
});

app.get('/govPolicy', function(req, res) {
	res.render('pages/govPolicy',{
		my_title:"WDC: Contact Me"
	});
});


// registration page
app.get('/reviews', function(req, res) {
	var query = "select * from movie_reviews;";
	db.any(query)
	.then(function (rows) {
		res.render('pages/reviews',{
			my_title:"Reviews",
			data:rows
		})
	})
	.catch(function (err) {
		request.flash('error', err);
		response.render('pages/reviews',{
			my_title:"Reviews",
			data: ''
		})
	})

});
app.get('/add/reviews', function(req, res) {
	
	//console.log(req.query.title[0]);
	var title = req.query.title[0];
	var review = req.query.title[1];
	var date = new Date();
	var d = date.toISOString();
	console.log(title);
	console.log(review);
	console.log(d);
	var insert_statement = "INSERT INTO movie_reviews(title,review,date) VALUES('"+title+"','"+review+"','"+d+"');";
	console.log(insert_statement);
	var getReviews = "select * from movie_reviews;";
	db.task('get-everything',task => {
		console.log("in db section");
		return task.batch([
			task.any(insert_statement),
			task.any(getReviews)
		]);
		console.log("goint out db section");
	})
	.then(info => {
		console.log("in render section");
		console.log(info);
		res.render('pages/reviews',{
                	my_title:"Reviews",
			data:info[1] ///careful with this one
		})
	})
	.catch(error => {
		console.log("hecked up");
		request.flash('error',err);
		response.render('pages/reviews',{
			my_title:"Reviews",
			data: ''
		})
        });
});


app.post('/home/pick_color', function(req, res) {

	var color_hex = req.body.color_hex;
	var color_name = req.body.color_name;
	var color_message = req.body.color_message;
	var insert_statement = "INSERT INTO favorite_colors(hex_value, name, color_msg) VALUES('" + color_hex + "','" +
							color_name + "','" + color_message +"');";

	var color_select = 'select * from favorite_colors;';
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(color_select)
        ]);
    })
    .then(info => {
    	res.render('pages/home',{
				my_title: "Home Page",
				data: info[1],
				color: color_hex,
				color_msg: color_message
			})
    })
    .catch(error => {
        // display error message in case an error
            request.flash('error', err);
            response.render('pages/home', {
                title: 'Home Page',
                data: '',
                color: '',
                color_msg: ''
            })
    });


});

app.get('/home/pick_color', function(req, res) {
	var color_choice = req.query.color_selection;
	var color_options =  'select * from favorite_colors;';
	var color_message = "select color_msg from favorite_colors where hex_value = '" + color_choice + "';";
	 db.task('get-everything', task => {
        return task.batch([
            task.any(color_options),
            task.any(color_message)
        ]);
    })
    .then(data => {
    	res.render('pages/home',{
				my_title: "Home Page",
				data: data[0],
				color: color_choice,
				color_msg: data[1][0].color_msg
			})
    })
    .catch(error => {
        // display error message in case an error
            request.flash('error', err);
            response.render('pages/home', {
                title: 'Home Page',
                data: '',
                color: '',
                color_msg: ''
            })
    });

});


// Football Games Page
app.get('/team_stats', function(req, res) {
	var list_games = 'select * from football_games;';
	var count_losing = 'select count(*) from football_games where visitor_score > home_score;';
	var count_winning = 'select count(*) from football_games where visitor_score < home_score;';

  db.task('get-everything', task => {
        return task.batch([
            task.any(list_games),
            task.any(count_losing),
            task.any(count_winning)
        ]);
    })
    .then(data => {
    	res.render('pages/team_stats',{
				my_title: "Football Games",
				games: data[0],
				total_losses: data[1][0].count,
				total_wins: data[2][0].count
			})
    })
    .catch(error => {
        // display error message in case an error
            request.flash('error', err);
            response.render('pages/team_stats', {
                title: 'Footbal Games',
                data: '',
                total_wins: 'Error',
                total_losses: 'Error'
            })
    });

});

//app.listen(3000);
//app.listen(3000);
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`Express running → PORT ${server.address().port}`);
});
