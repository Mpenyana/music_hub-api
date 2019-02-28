const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

const Registration = require('./controllers/Registration');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'VTMNKCMT2real',
    database : 'music_hub'
  }
});

const app = express();
app.use(bodyParser.json())
app.use(cors())

app.delete('/delete', (req, res) =>{
	db('login')
  .where('email', '')
  .del()
  .then(response => console.log(response))
  .then(action => res.json(action))
  .catch(err => res.json(err))
})

app.post('/signin', (req, res) =>{
	db.select('*').from('login')
	.where('email', '=', req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
		console.log(isValid)
		if(isValid === true){
			db.select('*').from('users')
			.where('email', '=' , req.body.email)
			.then(user => {
				res.json(user[0])
			})
		}
		else{
			res.json('wrong credentials!')
		}
	})
	.catch(err => res.json('wrong credentials!'))
})

app.post('/register', (req, res) => Registration.handleRegistration(req, res, db, bcrypt))

app.get('/', (req, res) => {
	res.json(database.users)
})

PORT = process.env.PORT
app.listen(3000, () => {
	console.log(`Okay World 94! Port ${PORT}`)
})