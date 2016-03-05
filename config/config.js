var config=module.exports={};

config.db=process.env.TOKEN_MONGO_URL || "mongodb://127.0.0.1:27017/mpstoken";
config.account="cnshMH002";
config.password="z55zbur3sor";
config.centralServer='127.0.0.1';
config.centralServerPort=3000;
config.centralServerAuthPath="/api/auth";
config.centralServerSyncPath="/api/sync";
config.scheduleTokenStr='* */5 * * *';
config.scheduleStoreStr='* */2 * * *';

config.tokenSecret="everyonelovesspeedqueen";

// config.updateIn=43200;


