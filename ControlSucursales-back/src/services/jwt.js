'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secretKey = 'ControlSucursales'

exports.createToken = async(enterprise)=>{
    try{
        let payload = {
            sub: enterprise._id,
            name: enterprise.name,
            type: enterprise.type,
            town: enterprise.town,
            role: enterprise.role,
            password: enterprise.password,
            iat: moment().unix(),
            exp: moment().add(24, 'hour').unix()
        }
        return jwt.encode(payload, secretKey);
    }catch(err){
        console.log(err);
        return err;
    }
}