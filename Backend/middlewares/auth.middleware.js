import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
  try {
    
    const token = req.cookies.access_token;
    if (!token) {
      return res.json({
        success: false,
        message: 'unauthorized user',
      });
    }
   
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
      if (error) {
        return res.json({
          success: false,
          message: "unauthorized user",
        });
      }      
      
      req.user = user;
      
      next();
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    })
  }
}
export default userAuth