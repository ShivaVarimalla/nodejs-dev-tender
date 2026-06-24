const adminAuth = (req,res,next) => {
  const token = "abcd";
  const isAuthorizied = token === "abcd";
  if (!isAuthorizied) {
    res.status(401).send("Unauthorizied User");
  } else {
    next();
  }
};

const userAuth =(req,res, next)=>{
    const token = "qwert";
    const isAuthorized = token === "qwert";
    if(!isAuthorized){
        res.status(401).send("Unauthorizied User");
    }
    else {
        next();
    }
}
module.exports = {
  adminAuth, userAuth
};
