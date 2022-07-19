const mongoConfig = require('./configs/mongoConfigs');
const app = require('./configs/app');
const port = 3000;
const enterpriseController = require('./src/controllers/enterprise.controller');

mongoConfig.init();

app.listen(port, ()=>{
    console.log(`Server http is running in port ${port}`);
});

enterpriseController.createAdmin();