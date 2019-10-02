let router = require('express').Router();
let Map = require('../models/Map');
/**
 * TODO : special header for handling an
 *  auth for this part
 *  here just we try to set up the site
 * */


 // TODO : adding jwt

router.post('/map' , function(req , res , next){
    let token = req.headers['pgr-token'];
    if(token == "admin@admin"){
        next();
    }else{
        res.status(403).json({
            msg : "access denied"
        });
    }
});

router.post('/login' , function(req , res){
    if(req.body.email == "admin@gmail.com" && req.body.password == "admin" ){
        res.json({
            msg : "logged in" ,
            token : "admin@admin" ,
            isadmin : true
        });
    }else{
        res.status(403).json({
            msg : "access denied"
        });
    }
});

router.post('/map' , function (req, res) {
    /**
        let data = {
            matrix: '0.99.99.1.99.0.2.99.3.99.0.99.99.2.99.0',
            count: 4 ,
            stores: '1.4.3'
        };
    */
    Map.register(req.body , function(err , map){
        if(!err){
            res.json({
                msg : "done and ready to use" ,
                router : map.router
            });
        }else{
            res.status(406).json({
                msg : "error occured",
                err : err
            });
        }

    });
});


module.exports = router;

