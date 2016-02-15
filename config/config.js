var config=module.exports={};

config.db=process.env.TOKEN_MONGO_URL || "mongodb://127.0.0.1:27017/mpstoken";
config.account="sq";
config.password="password";
config.centralServer='127.0.0.1';
config.centralServerPort=3000;
config.centralServerPath="/api/auth";
config.scheduleStr='*/1 * * * *';
// config.updateIn=43200;


// config.tokenSecret="whatdoyousee";