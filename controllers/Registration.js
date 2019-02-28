

const handleRegistration = (req, res, db, bcrypt) => {
	const {name, email, password} = req.body
	if(!name || !email || !password){
		res.json('invalid form submission')
	}
	else{
	db.transaction(trx => {
		const hash = bcrypt.hashSync(password);
		trx.insert({
			hash:hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {

			return	trx('users')
			.returning('*')
			.insert({
				name:name,
				joined: new Date(),
				email: loginEmail[0]
			})
			.then(user =>{
				res.json(user[0]);
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('Error Registering'))
	})
	}
}

module.exports = {
	handleRegistration: handleRegistration
}