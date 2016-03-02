var config=module.exports={};

config.db=process.env.TOKEN_MONGO_URL || "mongodb://127.0.0.1:27017/mpstoken";
config.account="CNSHJ001";
config.password="luis2x1or";
config.centralServer='127.0.0.1';
config.centralServerPort=3000;
config.centralServerAuthPath="/api/auth";
config.centralServerSyncPath="/api/sync";
config.scheduleTokenStr='1 1 * * *';
config.scheduleStoreStr='*/1 * * * *';
// config.updateIn=43200;


