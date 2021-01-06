const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
    if(!email || !password || !name){
        return res.status(400).json('please enter details');
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    }).then(user => {
                        res.json(user[0]);
                    })
                    .then(trx.commit)
                    .catch(trx.rollback)

            })
            .catch(err => res.status(400).json('unable to register'))
    })
    // bcrypt.hash(password, null, null, function (err, hash) {
    //     // Store hash in your password DB.
    //     console.log(hash);
    // });

}

module.exports = {
  handleRegister: handleRegister
}