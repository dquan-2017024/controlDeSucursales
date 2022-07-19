'use strict'

const BranchOffice = require('../models/branchOffice.model');
const { validateData, checkPermission, checkUpdate } = require('../utils/validate');
const Enterprise = require('../models/enterprise.model');

//FUNCIONES PARA CLIENT
exports.createBranchOffice = async(req,res)=>{
    try{
        let params = req.body;
        let data = {
            name: params.name,
            address: params.address,
            businessHours: params.businessHours,
            phone: params.phone,
            enterprise: req.enterprise.sub
        };

        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let nameExist = await BranchOffice.findOne({name:params.name});
        if(nameExist) return res.send({message: `BranchOffice ${params.name} already exist`});
        let addressExist = await BranchOffice.findOne({address:params.address});
        if(addressExist) return res.send({message: `The address:${params.address} is already in used`});
        let branchOffice = new BranchOffice(data);
        await branchOffice.save();
        return res.send({message: 'BranchOffice created successfully'});

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error creating branchOffice'});
    }
};

exports.updateBranchOffice = async(req,res)=>{
    try{
        let branchOfficeId = req.params.id;
        let params = req.body;

        let branchOfficeExist = await BranchOffice.findOne({_id: branchOfficeId});
        if(!branchOfficeExist) return res.send({message: 'BranchOffice not found'});
        let nameExist = await BranchOffice.findOne({name: params.name});
        if(nameExist && branchOfficeExist.name != params.name) return res.send({message: `BranchOffice ${params.name} already exist`}); 
        let addressExist = await BranchOffice.findOne({address:params.address});
        if(addressExist && branchOfficeExist.address != params.address) return res.send({message: `The address:${params.address} is already in used`});
        let permission = await checkPermission(branchOfficeExist.enterprise, req.enterprise.sub);
        if(permission === false)  return res.status(401).send({message: 'You dont have permission to update branchOffices in this enterprise'});
        const validateUpdate = await checkUpdate(params);
        if(validateUpdate === false) return res.status(400).send({message: 'Cannot update this information or invalid params'});
        let branchOfficeUpdate = await BranchOffice.findOneAndUpdate({_id: branchOfficeId}, params, {new:true}).lean().populate('enterprise');
        delete branchOfficeUpdate.enterprise.password;
        delete branchOfficeUpdate.enterprise.role;
        
        return res.send({branchOfficeUpdate, message: 'BranchOffice updated'})

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error updating branchOffice'})
    }
};

exports.deleteBranchOffice = async(req,res)=>{
    try{
        let branchOfficeId = req.params.id;
        
        let branchOfficeExist = await BranchOffice.findOne({_id: branchOfficeId});
        if(!branchOfficeExist) return res.send({message: 'BranchOffice not found'});
        let permission = await checkPermission(branchOfficeExist.enterprise, req.enterprise.sub);
        if(permission === false)  return res.status(401).send({message: 'You dont have permission to delete branchOffices in this enterprise'});
        let branchOfficeDelelete = await BranchOffice.findOneAndDelete({_id: branchOfficeId});
        return res.send({name: branchOfficeDelelete.name, message: 'BranchOffice deleted'});

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error deleting branchOffice'});
    }
};

exports.searchBranchOffice = async(req,res)=>{
    try{
        let params = req.body;
        let data = {
            name: params.name
        };

        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let branchOffices = await BranchOffice.find({$and:[
            {name: {$regex: params.name, $options: 'i'}},
            {enterprise: req.enterprise.sub}
        ]})
        .lean()
        .populate('enterprise');
        if(branchOffices.length === 0) return res.send({message: 'No branchOffices found'});
        for(let branchOffice of branchOffices){
            delete branchOffice.enterprise.password;
            delete branchOffice.enterprise.role;
        };
        return res.send({branchOffices: branchOffices});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error searching branchOffices'});
    }
}

exports.getBranchOffice = async(req,res)=>{
    try{
        let branchOfficeId = req.params.id;
        let branchOffice = await BranchOffice.findOne({
            $and:[
                {_id: branchOfficeId},
                {enterprise: req.enterprise.sub}
            ]})
        .lean()
        .populate('enterprise');
        if(!branchOffice) return res.send({message: 'BranchOffice not found'});
        let permission = await checkPermission(branchOffice.enterprise._id,req.enterprise.sub);
        if(permission == false)  return res.status(401).send({message: 'You dont have permission to get this branchOffice'});
        delete branchOffice.enterprise.password;
        delete branchOffice.enterprise.role;
        return res.send({branchOffice});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting branchOffice'});
    }
};

exports.getBranchOffices = async(req,res)=>{
    try{
        let branchOffices = await BranchOffice.find({enterprise: req.enterprise.sub}).lean().populate('enterprise');
        if(branchOffices.length === 0)return res.send({message: 'Branchoffices not found'})
        for(let branchOffice of branchOffices){
            delete branchOffice.enterprise.password;
            delete branchOffice.enterprise.role;
        }
        return res.send({branchOffices});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting branchOffices'});
    }
};
//FUNCIONES PARA ADMIN
exports.obtainBranchOffices = async(req,res)=>{
    try{
        let enterpriseId = req.params.id;
        let enterpriseExist = await Enterprise.findOne({_id:enterpriseId});
        if(!enterpriseExist) return res.send({message: 'Enterprise not found'});
        let branchOffices = await BranchOffice.find({enterprise: enterpriseId}).lean().populate('enterprise');
        return res.send({branchOffices});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error obtaining branchOffices'});
    }
};
