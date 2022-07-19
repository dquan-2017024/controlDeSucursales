'use strict'

const ProductBranchOffice = require('../models/productBranchOffice.model');
const { validateData, checkPermission } = require('../utils/validate');
const BranchOffice = require('../models/branchOffice.model');

exports.sellProduct = async(req,res)=>{
    try{
        let params = req.body;
        let data = {
            name: params.name,
            quantity: Number(params.quantity),
            branchOffice: params.branchOffice,
            provider: params.provider
        };

        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let nameExist = await ProductBranchOffice.findOne({$and:[
            {name: data.name},
            {enterprise: req.enterprise.sub},
            {branchOffice: data.branchOffice},
            {provider: data.provider}
        ]});
        if(!nameExist) return res.send({message: 'Product not found'});
        let branchOfficeExist = await BranchOffice.findOne({_id: data.branchOffice});
        if(!branchOfficeExist) return res.send({message: 'BranchOffice not found'});
        if(data.quantity === 0) return res.status(400).send({message: 'Cannot distribute 0 products'});
        if(nameExist.stock < data.quantity) return res.send({message: `Only have ${nameExist.stock} in stock`});
        let permission = await checkPermission(branchOfficeExist.enterprise, req.enterprise.sub);
        if(permission === false) return res.status(401).send({message: 'The branchOffice not exist in this enterprise'});
        
        let info = {
            stock: nameExist.stock - data.quantity,
            sales: nameExist.sales + data.quantity
        };
        await ProductBranchOffice.findOneAndUpdate({_id: nameExist._id}, info, {new: true});
        return res.send({product:data, message: 'Product selling successfully'});

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error buying products'});
    }
};

exports.mostSales = async(req,res)=>{
    try{
        let branchOfficeId = req.params.id;

        let branchOfficeExist = await BranchOffice.findOne({_id: branchOfficeId});
        if(!branchOfficeExist) return res.send({message: 'BranchOffice not found'})
        
        let permission = await checkPermission(branchOfficeExist.enterprise, req.enterprise.sub);
        if(permission === false) return res.status(401).send({message: 'The branchOffice not exist in this enterprise'});
        let mostSales = await ProductBranchOffice.find({branchOffice: branchOfficeId}).lean().populate('branchOffice').populate('enterprise');
        mostSales.sort((a,b)=>{
            return b.sales-a.sales
        });
        if(mostSales.length === 0)return res.send({message: 'Not found products'});
        mostSales.map(mostSales=>{delete mostSales.enterprise.password; delete mostSales.enterprise.role});
        let names = mostSales.map(mostSales=>mostSales.name);
        let sales = mostSales.map(mostSales=>mostSales.sales)
        return res.send({mostSales, names, sales});

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error ordering products'});
    }  
};

exports.lessSales = async(req,res)=>{
    try{
        let branchOfficeId = req.params.id;

        let branchOfficeExist = await BranchOffice.findOne({_id: branchOfficeId});
        if(!branchOfficeExist) return res.send({message: 'BranchOffice not found'})
        let permission = await checkPermission(branchOfficeExist.enterprise, req.enterprise.sub);
        if(permission === false) return res.status(401).send({message: 'The branchOffice not exist in this enterprise'});
        let lessSales = await ProductBranchOffice.find({branchOffice: branchOfficeId}).lean().populate('branchOffice').populate('enterprise');
        lessSales.sort((a,b)=>{
            return a.sales-b.sales
        });
        if(lessSales.length === 0)return res.send({message: 'Not found products'});
        
        lessSales.map(lessSales=>{delete lessSales.enterprise.password; delete lessSales.enterprise.role});
        return res.send({lessSales});

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error ordering products'});
    }  
};


exports.searchProductsByName = async(req,res)=>{
    try{
        let params = req.body;
        let data = {
            name: params.name
        };

        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let productsBranchOffice = await ProductBranchOffice.find({$and:[
            {name: {$regex: params.name, $options: 'i'}},
            {enterprise: req.enterprise.sub}
        ]})
        .lean()
        .populate('branchOffice')
        .populate('enterprise');
        if(productsBranchOffice.length === 0) return res.send({message: 'No products found'});
        productsBranchOffice.map(productsBranchOffice=>{delete productsBranchOffice.enterprise.password; delete productsBranchOffice.enterprise.role});
        return res.send({products: productsBranchOffice});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error searching products'});
    }
};

exports.searchProductsByProvider = async(req,res)=>{
    try{
        let params = req.body;
        let data = {
            provider: params.provider
        };

        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let productsBranchOffice = await ProductBranchOffice.find({$and:[
            {provider: {$regex: params.provider, $options: 'i'}},
            {enterprise: req.enterprise.sub}
        ]})
        .lean()
        .populate('branchOffice')
        .populate('enterprise');
        if(productsBranchOffice.length === 0) return res.send({message: 'No products found'});
        productsBranchOffice.map(productsBranchOffice=>{delete productsBranchOffice.enterprise.password; delete productsBranchOffice.enterprise.role});

        return res.send({products: productsBranchOffice});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error searching products'});
    }
};

exports.getProductBranchOffice = async(req,res)=>{
    try{
        let productBranchOfficeId = req.params.id;
        let productBranchOffice = await ProductBranchOffice.findOne({$and:[
            {_id: productBranchOfficeId},
            {enterprise: req.enterprise.sub}
        ]})
        .lean()
        .populate('branchOffice')
        .populate('enterprise');
        if(!productBranchOffice) return res.send({message: 'Product not found'});
        delete productBranchOffice.enterprise.password;
        delete productBranchOffice.enterprise.role;
        
        return res.send({productBranchOffice});

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error ordering products'});
    }
};