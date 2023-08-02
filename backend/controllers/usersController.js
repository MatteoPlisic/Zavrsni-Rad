const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function signup(req, res) {
  try {
    // Get the email and password off req body
    const { name, email, password, superUser } = req.body;
    //console.log(req.body);
    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Create a user with the daTa
    await User.create({ name, email, password: hashedPassword, superUser });

    // respond
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}

async function login(req, res) {
  try {
    // Get the email and password off rq body
    const { email, password } = req.body;

    // Find the user with requested email
    const user = await User.findOne({ email });
    if (!user) return res.sendStatus(401);

    // Compare sent in password with found user password hash
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) return res.sendStatus(401);

    // create a jwt token
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const token = jwt.sign({ sub: user._id, exp, name: user.name, superUser: user.superUser }, process.env.SECRET,);

    // Set the cookie
    res.cookie("Authorization", token, {
      expires: new Date(exp),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // send it
    res.json({ token })
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}

async function checkSuperUser(req, res) {


  try {
    const token = req.cookies.Authorization;
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log(decoded)
    const user = await User.findById(decoded.sub)
    console.log(user)
    if (user.superUser)
      res.sendStatus(200)
    else
      res.sendStatus(401)
  } catch (error) {
    console.log("Not superUser")
  }

}

function logout(req, res) {
  try {
    res.cookie("Authorization", "", { expires: new Date() });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}

function checkAuth(req, res) {
  try {
    res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(400);
  }
}



module.exports = {
  checkSuperUser,
  signup,
  login,
  logout,
  checkAuth
};