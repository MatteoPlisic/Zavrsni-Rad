const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function signup(req, res) {
  try {
    
    const { name, email, password, superUser } = req.body;
    
   
    const hashedPassword = bcrypt.hashSync(password, 8);

    
    await User.create({ name, email, password: hashedPassword, superUser });

   
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}

async function login(req, res) {
  try {
    
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.sendStatus(401);

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) return res.sendStatus(401);

  
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const token = jwt.sign({ sub: user._id, exp, name: user.name, superUser: user.superUser }, process.env.SECRET,);

  
    res.cookie("Authentication", token, {
      expires: new Date(exp),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    
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

async function createUser(req, res) {
  try {

      const token = req.cookies.Authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      console.log(decoded)
      const admin = await User.findById(decoded.sub)
      console.log(admin)
      if (!admin.superUser)
        res.sendStatus(401)

    const { name, email, password, superUser } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = await User.create({ name, email, password: hashedPassword, superUser });
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}

async function getUsers(req, res) {
  try {
      const token = req.cookies.Authorization;
      const decoded = jwt.verify(token, process.env.SECRET);
      console.log(decoded)
      const admin = await User.findById(decoded.sub)
      console.log(admin)
      if (!admin.superUser){
        res.sendStatus(401)
        return;
      }
      
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}

async function getUserById(req, res) {
  try {
    const token = req.cookies.Authorization;
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log(decoded)
    const admin = await User.findById(decoded.sub)
    console.log(admin)
    if (!admin.superUser){
      res.sendStatus(401)
      return;
    }
    const userId = req.params.id;
    console.log("id "+ req.params.id)
    const user = await User.findById(req.params.id);
    if (!user) return res.sendStatus(404);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}

async function updateUser(req, res) {
  try {
    const token = req.cookies.Authorization;
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log(decoded)
    const admin = await User.findById(decoded.sub)
    console.log(admin)
    if (!admin.superUser){
      res.sendStatus(401)
      return;
    }
    const userId = req.params.id;
    const { name, email, password, superUser } = req.body;
    const user = await User.findById(userId);
    if(name !== null){
      user.name = name;
    }
    if(password !== null){
      user.password = password;
    }

    if(email !== null){
      user.email = email;
    }
    if(superUser !== null){
      user.superUser = superUser;
    }

   user.save()

    if (!user) return res.sendStatus(404);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}

async function deleteUser(req, res) {
  try {
    const token = req.cookies.Authorization;
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log(decoded)
    const admin = await User.findById(decoded.sub)
    console.log(admin)
    if (!admin.superUser){
      res.sendStatus(401)
      return;
    }
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) return res.sendStatus(404);
    user.deleteOne();
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}

module.exports = {
  checkSuperUser,
  signup,
  login,
  logout,
  checkAuth,
 
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};




