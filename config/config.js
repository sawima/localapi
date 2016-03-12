var config=module.exports={};

config.db=process.env.TOKEN_MONGO_URL || "mongodb://127.0.0.1:27017/mpstoken";
config.account="CNSHMH001";
config.password="0n41dtb7qfr";
config.centralServer='db.kimacloud.com';
config.centralServerPort=80;
config.centralServerAuthPath="/api/auth";
config.centralServerSyncPath="/api/sync";
config.scheduleTokenStr='* */2 * * *';
config.scheduleStoreStr='* */2 * * *';

config.tokenSecret="everyonelovesspeedqueen";

// config.updateIn=43200;


