//taskkill /F /IM node.exe to kill NODE process
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
// const ejs=require('ejs')

//set dotenv
const dotenv = require('dotenv');
dotenv.config();

const connectionString =
	'mongodb+srv://netninja:test1234@nodepracticecluster.jmhpf.mongodb.net/ProfileCollector?retryWrites=true&w=majority';

app.use(bodyParser.urlencoded({ extended: true }));

//set template engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

//create data schema

const userSchema = {
	name: String,
	hobby: String,
	goal: String,
	dream: String,
	image: String
};

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
	let newUser = new User({
		name: req.body.name,
		hobby: req.body.hobby,
		goal: req.body.goal,
		dream: req.body.dream,
		image: req.body.image
	});

	newUser.save();
	res.redirect('/seeUsers');
});

app.get('/seeUsers', (req, res) => {
	mongodb.connect(connectionString, { useUnifiedTopology: true }, async (err, client) => {
		const db = client.db();
		const results = await db.collection('users').find().toArray();

		const users = results;
		console.log(users);
		// await res.send(results);
		res.render('seeCurrentUsers', { users: users });
	});
});

app.get('/seeUsers/:id', (req, res) => {
	const id = req.params.id;

	User.findByIdAndDelete(id)
		.then((result) => {
			res.redirect('/seeUsers');
		})
		.catch((err) => {
			console.log(err);
		});
});

app.listen(3000, () => {
	console.log('server is working');
});
