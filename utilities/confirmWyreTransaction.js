const axios = require("axios");

module.exports = confirmWyreTransaction = async (transferId ) => {
    try{
      if(!transferId){
        throw new Error("Transfer Id or Token in not valid");
      }
      let resppp = await axios.post(`https://api.testwyre.com/v3/transfers/${transferId}/confirm`, {
        email: "usmanqasim0900@gmail.com"
      }, {
        headers: {
          "Authorization": `Bearer ${process.env.ADMIN_SECRET_KEY}`, 
          "Accept": "application/json"
        }
      });
      let data;
      data.confirmations = true;
      // console.log("Try Block");
      // console.log(resppp);
      // process.exit();
      return data;
    }catch(e){
      let data;
      data.confirmations = false;
      return data;
        // console.log("Catch Block");
        // console.log(e.message);
        // console.log(e.response.data.message);
        // process.exit();
        // let data = {confirmations : false};
    }
  };