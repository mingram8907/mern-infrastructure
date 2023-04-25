//* Request handler logic
const User = require('../../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

async function create (req, res) {
    // console.log('[From POST handler]', req.body)
    try {
        //* creating/adding a new user to the database
        const user = await User.create(req.body);
        console.log(user);
        
        //* creating a new jwt. token will be a string
        const token = createJWT(user)

        //* Yes, we can use res.json to send back just a string
        //* The client code needs to take this into consideration
        res.json(token);

    } catch (error) {
        // console.log(error);
        res.status(400).json(error)
    }
}


//* /*-- Helper Functions --*/
function createJWT(user) {
    return jwt.sign(
        //* data payload
        {user},
        process.env.SECRET,
        {expiresIn: '24h'}
    );
}



async function login(req, res) {
    try {
        //* find user in db by looking for email
        const user = await User.findOne({ email: req.body.email });
      
        //* check if we found a user & if user not found ↓
        if (!user) throw new Error();

        //* if user exists in db → compare the password to the hashed password
        const match = await bcrypt.compare(req.body.password, user.password);
        
        //* check if passwords matched & if not ↓
        if (!match) throw new Error();

        //* if password is a match → send back a new token with the user data in the payload
        res.json( createJWT(user) );

    } catch {
      res.status(400).json('Bad Credentials');
    }
}

async function checkToken(req, res) {
    console.log(req.user);
    
    res.json(req.exp)
}

module.exports = {
    create,
    //* ↑ same as ' create: create '.. but in JS if the key & value are the same, you can just type it once 
    
    login, 
    checkToken
}