const { verify } = require("jsonwebtoken");
const { secret } = require("../../utils/services/auth");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({ error: "No token provided." });

    const parts = authHeader.split(" ");
    if(parts.length !== 2) return res.status(401).json({ error: "Token error." });

    const [scheme, token] = parts;
    if(!/^Bearer$/i.test(scheme)) return res.status(401).json({ error: "Token malformatted." });

    verify(token, secret, (err, decoded) => {
      if(err) return res.status(401).json({ error: "Token invalid." });
      req.query.id = decoded.id;
      return next();
    });
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
};
