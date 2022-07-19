const Enterprise = require('../models/enterprise.model');
const { validateData, encrypt, checkPassword, checkUpdate } = require('../utils/validate');
const jwt = require('../services/jwt');
const BranchOffice = require('../models/branchOffice.model');
const ProductBranchOffice = require('../models/productBranchOffice.model');
const ProductEnterprise = require('../models/productEnterprise.model')

exports.createAdmin = async(req,res)=>{
    try{
        
            let name= 'SuperAdmin';
            let adminExist = await Enterprise.findOne({name: name});
            let role= 'ADMIN';
            
        if(adminExist){

        }else{
            password = await encrypt('123456');
            data={
                name:name,
                role: role,
                password: password
            }
            let enterprise = new Enterprise(data);
            await enterprise.save();
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error creating admin'});
    }
};

//FUNCIONES PÚBLICAS
exports.login = async(req,res)=>{
    try{
        let params = req.body;
        let data = {
            name: params.name,
            password: params.password
        };
        
        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let enterpriseExist = await Enterprise.findOne({name: params.name}).lean();

        if(enterpriseExist && await checkPassword(params.password, enterpriseExist.password)){
            let token = await jwt.createToken(enterpriseExist);
            delete enterpriseExist.password;
            return res.send({token, enterprise:enterpriseExist, message: 'Login successfully'});
        }else return res.status(401).send({message: 'Invalid credentials'});

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error logging in'});
    }
};

//FUNCIONES PARA ADMIN
exports.createEnterprise = async(req,res)=>{
    try{
        let params = req.body;
        let data ={
            name: params.name,
            type: params.type,
            town: params.town,
            password: params.password,
            role: 'CLIENT'
        };

        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let enterpriseExist = await Enterprise.findOne({name: params.name});
        if(enterpriseExist) return res.status(400).send({message: `Enterprise ${params.name} already exist`});
        data.password = await encrypt(params.password);

        let enterprise = new Enterprise(data);
        await enterprise.save();
        return res.send({message: 'Enterprise created successfully'});

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error creating enterprise'});
    }
};

exports.getEnterprises = async(req,res)=>{
    try{
        let enterprises = await Enterprise.find().lean();
        return res.send({enterprises});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting enterprises'});
    }
};

exports.updateEnterprise = async(req,res)=>{
    try{
        let enterpriseId = req.params.id;
        let params = req.body;

        let enterpriseExist = await Enterprise.findOne({_id: enterpriseId});
        if(!enterpriseExist) return res.send({message: 'Enterprise not found'});
        let nameExist = await Enterprise.findOne({name: params.name});
        if(nameExist && enterpriseExist.name != params.name)return res.send({message: `Enterprise ${params.name} already exist`});
        const validateUpdate = await checkUpdate(params);
        if(validateUpdate === false) return res.status(400).send({message: 'Cannot update this information or invalid params'});
        let enterpriseUpdate = await Enterprise.findOneAndUpdate({_id: enterpriseId}, params, {new:true}).lean();
        return res.send({enterpriseUpdate, message: 'Enterprise updated'});

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error updating enterprise'})
    }
};

exports.deleteEnterprise = async(req,res)=>{
    try{
        let enterpriseId = req.params.id;
        
        let enterpriseExist = await Enterprise.findOne({_id: enterpriseId});
        if(!enterpriseExist) return res.send({message: 'Enterprise not found'});

        await BranchOffice.deleteMany({enterprise: enterpriseId});
        await ProductBranchOffice.deleteMany({enterprise: enterpriseId});
        await ProductEnterprise.deleteMany({enterprise: enterpriseId});
        let enterpriseDelete = await Enterprise.findOneAndDelete({_id: enterpriseId});
        return res.send({name: enterpriseDelete.name, message: 'Enterprise deleted'});

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error deleting enterprise'});
    }
};

exports.getEnterprise = async(req,res)=>{
    try{
        let enterpriseId = req.params.id;
        let enterprise = await Enterprise.findOne({_id: enterpriseId}).lean();
        return res.send({enterprise});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting enterprise'});
    }
};