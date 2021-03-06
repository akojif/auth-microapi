/**=================================================================
 * ====   TITLE:: IMPLEMENTATION OF EMAIL VERIFICATION SERVICE  ====  
 * ====   AUTHOR:: HACKINWALE <hackinwale.developer@gmail.com>  ====
 * ====   DATE::            28TH JUNE 2020                      ====
 * =================================================================
 */

const EmailVerification = require('../models/EmailVerification');
const User = require('../models/user');
const AdminUser = require('../models/admin');
const CustomError = require('../utils/CustomError');

class EmailVerificationService{

  async verifyEmail(req){
    // Collect the token from the URL and query for it
    let token = await EmailVerification.findOne({token: req.params.token});
    this.logger('Here is the token: '+token);
    if(!token){
      throw new CustomError('Verification Link Invalid/Expired', 404);
    }
    
    // Now update the user/admin profile and return updated data 
    this.logger(req.baseUrl);
    let userData;
    if(req.baseUrl !== '/api/admin/auth/email'){
      userData = await User.findByIdAndUpdate(token._userId, 
        {$set: {isEmailVerified: true}}, 
        {new: true});
    }else{
      userData = await AdminUser.findByIdAndUpdate(token._userId, 
        {$set: {isEmailVerified: true}}, 
        {new: true});
    }

    this.logger(userData);
    if(!userData)
    {throw new CustomError('User Could Not Be Updated', 401);}

    return {
      isVerified: userData.isEmailVerified
    };
    
  }

  // ================
  logger(msg){
    let debug = true;
    if(debug){
      console.log('==========MailService==LOGGER============');
      console.log(msg);
    }
      
  }

}

module.exports = new EmailVerificationService();