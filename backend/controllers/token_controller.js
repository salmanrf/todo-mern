const jwt = require("jsonwebtoken");

exports.get_refresh = async (req, res, next) => {
  if(!req.cookies) 
    return res.sendStatus(401);

  if(req.cookies["refresh_token"]) {
    const refresh_token = req.cookies["refresh_token"];
    
    try {
      const {user} = await verifyRefreshToken(refresh_token);
      const newAct = await generateAccessToken({username: user.username, _id: user._id});

      res.status(202).json({accessToken: newAct});
    } catch {
      res.sendStatus(401);
    } 
  }
}

generateAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign({user: payload}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"},
      (err, token) => {
        if(err) return reject(err);

        return resolve(token);
      }
    );
  });
  
}

exports.generateRefreshToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign({user: payload}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "1d"},
      (err, token) => {
        if(err) return reject(err);

        return resolve(token);
      }
    );
  });
}

exports.verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, 
      (err, decoded) => {
        if(err) return reject(err);

        return resolve(decoded);
      }
    );
  })
}

const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, 
      (err, decoded) => {
        if(err) return reject(err);

        return resolve(decoded);
      }
    );
  })
}

exports.generateAccessToken = generateAccessToken;