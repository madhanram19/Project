var express = require("express");
var router = express.Router();
var web3 = require('web3');


  router.post("/", async (req, res) => {
       try {
       const Account = web3.eth.accounts.create();
      console.log(Account);
     res.status(201)
     .json(Account);
    } catch (error) {
      res
        .status(400)
        .json({ message: "action failed", error: error.message });
      
    }
  });

module.exports = router;