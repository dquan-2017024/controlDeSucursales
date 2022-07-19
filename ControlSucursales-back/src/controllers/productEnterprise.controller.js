'use strict'

const ProductEnterprise = require('../models/productEnterprise.model');
const { validateData, checkPermission, checkUpdate } = require('../utils/validate');
const ProductBranchOffice = require('../models/productBranchOffice.model');
const BranchOffice = require('../models/branchOffice.model');

//FUNCIONES PARA CLIENT
exports.addProduct = async(req,res)=>{
    try{
        let params = req.body;
        let data ={
            name: params.name,
            provider: params.provider,
            stock: params.stock,
            enterprise: req.enterprise.sub
        };
        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let productEnterpriseExist = await ProductEnterprise.findOne({ $and:[
            {name: params.name},
            {provider: params.provider},
            {enterprise: data.enterprise}
        ]});
        if(productEnterpriseExist) return res.status(400).send({message: `Product ${params.name} with provider ${params.provider} already exist`});
        if(data.stock === 0)return res.send({message: 'Input a valid value for stock'})
        let productEnterprise = new ProductEnterprise(data);
        await productEnterprise.save();
        return res.send({message: 'Product created successfully'});

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error creating product'});
    }
};

exports.getProductsEnterprise = async(req,res)=>{
    try{
        let productsEnterprise = await ProductEnterprise.find({enterprise: req.enterprise.sub}).lean().populate();
        if(productsEnterprise.length === 0) return res.send({message: 'Not found products'});
        for(let products of productsEnterprise){
            delete products.enterprise.password;
            delete products.enterprise.role;
        };
        return res.send({products: productsEnterprise});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting products'});
    }
};

exports.updateProductEnterprise = async(req,res)=>{
    try{
        let productEnterpriseId = req.params.id;
        let params = req.body;
        let productEnterpriseExist = await ProductEnterprise.findOne({_id: productEnterpriseId});
        if(!productEnterpriseExist) return res.send({message: 'Product not found'});
        let nameExist = await ProductEnterprise.findOne({name: params.name, provider: params.provider, enterprise: req.enterprise.sub});
        if(nameExist && (productEnterpriseExist.provider != params.provider || productEnterpriseExist.name != params.name)) return res.status(400).send({message: `Product ${nameExist.name} with provider ${nameExist.provider} already exist in this enterprise`});
        let permission = await checkPermission(productEnterpriseExist.enterprise, req.enterprise.sub);
        if(permission === false)  return res.status(401).send({message: 'You dont have permission to update products in this enterprise'});
        const validateUpdate = await checkUpdate(params);
        if(validateUpdate === false) return res.status(400).send({message: 'Cannot update this information or invalid params'});
        let productEnterpriseUpdate = await ProductEnterprise.findOneAndUpdate({_id: productEnterpriseId}, params, {new:true})
        .lean()
        .populate('enterprise');
        delete productEnterpriseUpdate.enterprise.password;
        delete productEnterpriseUpdate.enterprise.role;
        return res.send({productEnterpriseUpdate, message: 'ProductEnterprise updated'})

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error updating product'})
    }
};

exports.deleteProductEnterprise = async(req,res)=>{
    try{
        let productEnterpriseId = req.params.id;

        let productEnterpriseExist = await ProductEnterprise.findOne({_id: productEnterpriseId});
        if(!productEnterpriseExist) return res.send({message: 'Product not found'});
        let permission = await checkPermission(productEnterpriseExist.enterprise, req.enterprise.sub);
        if(permission === false)  return res.status(401).send({message: 'You dont have permission to delete products in this enterprise'});
        let productEnterpriseDelelete = await ProductEnterprise.findOneAndDelete({_id: productEnterpriseId});
        return res.send({name: productEnterpriseDelelete.name, message: 'Product deleted'});

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error deleting product'});
    }
};

exports.distributeProducts = async(req,res)=>{
    try{
        let params = req.body;
        let data = {
            name: params.name,
            stock: Number(params.stock),
            sales: 0,
            branchOffice: params.branchOffice
        };

        let msg = validateData(data);
        if(msg) return res.status(400).send(msg);
        let nameExist = await ProductEnterprise.findOne({$and:[
            {name: data.name},
            {enterprise: req.enterprise.sub}
        ]});
        if(!nameExist) return res.send({message: 'Product not found'});
        let branchOfficeExist = await BranchOffice.findOne({$and:[
            {name: data.branchOffice},
            {enterprise: req.enterprise.sub}
        ]}).lean();
        if(!branchOfficeExist) return res.send({message: 'BranchOffice not found'});
        if(data.stock === 0) return res.status(400).send({message: 'Cannot distribute 0 products'});
        if(nameExist.stock < data.stock) return res.send({message: `Only have ${nameExist.stock} in stock`});
        let validatePermission = await checkPermission(nameExist.enterprise, req.enterprise.sub);
        let permission = await checkPermission(branchOfficeExist.enterprise, req.enterprise.sub);
        if(permission === false || validatePermission === false) return res.status(401).send({message: 'You dont have permission to distribute products of this enterprise'});
        let productExist = await ProductBranchOffice.findOne({$and:[
            {name: data.name},
            {provider: nameExist.provider},
            {branchOffice: branchOfficeExist._id}
        ]});
        
        if(!productExist){

            let stock = nameExist.stock - data.stock;
            await ProductEnterprise.findOneAndUpdate({_id: nameExist._id}, {stock: stock}, {new: true});
            data.branchOffice = branchOfficeExist._id;
            data.provider = nameExist.provider;
            data.enterprise = req.enterprise.sub;
            let productBranchOffice = new ProductBranchOffice(data);
            await productBranchOffice.save();
            productBranchOffice.branchOffice = undefined;
            productBranchOffice.enterprise = undefined;
            return res.send({productBranchOffice, message: 'Product distribute successfully'});

        }else{
            
            let quantity = nameExist.stock - data.stock;
            await ProductEnterprise.findOneAndUpdate({_id: nameExist._id}, {stock: quantity}, {new: true});
            let stock = productExist.stock + data.stock;
            let productBranchOfficeUpdate = await ProductBranchOffice.findOneAndUpdate({_id: productExist._id}, {stock: stock}, {new: true})
            .lean()
            .populate('branchOffice')
            .populate('enterprise');
            delete productBranchOfficeUpdate.enterprise.password;
            delete productBranchOfficeUpdate.enterprise.role;

            return res.send({product:productBranchOfficeUpdate, message: 'Product distribute successfully'})

        }
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error distributing products'});
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
        let productsEnterprise = await ProductEnterprise.find({$and:[
            {name: {$regex: params.name, $options: 'i'}},
            {enterprise: req.enterprise.sub}
        ]})
        .lean()
        .populate('enterprise');
        for(let product of productsEnterprise){
            delete product.enterprise.password;
            delete product.enterprise.role;
        }
        if(productsEnterprise.length === 0) return res.send({message: 'No products found'});
        return res.send({products: productsEnterprise});
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
        let productsEnterprise = await ProductEnterprise.find({$and:[
            {provider: {$regex: params.provider, $options: 'i'}},
            {enterprise: req.enterprise.sub}
        ]})
        .lean()
        .populate('enterprise');
        for(let product of productsEnterprise){
            delete product.enterprise.password;
            delete product.enterprise.role;
        }
        if(productsEnterprise.length === 0) return res.send({message: 'No products found'});
        return res.send({products: productsEnterprise});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error searching products'});
    }
};

exports.getProductEnterprise = async(req,res)=>{
    try{
        let productEnterpriseId = req.params.id;
        let productEnterprise = await ProductEnterprise.findOne({_id: productEnterpriseId}).lean().populate('enterprise');
        if(!productEnterprise) return res.send({message: 'Product not found'});
        let permission = await checkPermission(productEnterprise.enterprise._id, req.enterprise.sub);
        if(permission === false) return res.status(401).send({message: 'You dont have permission to get this product'});
        delete productEnterprise.enterprise.password;
        delete productEnterprise.enterprise.role;
        return res.send({productEnterprise});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting product'});
    }
};