var config=module.exports={};

config.db=process.env.TOKEN_MONGO_URL || "mongodb://127.0.0.1:27017/mpstoken";
config.account="CNSH003";
config.password="htk4l2chaor";
config.centralServer='127.0.0.1';
config.centralServerPort=3000;
config.centralServerAuthPath="/api/auth";
config.centralServerSyncPath="/api/sync";
config.scheduleTokenStr='* */5 * * *';
config.scheduleStoreStr='* */2 * * *';
// config.updateIn=43200;


