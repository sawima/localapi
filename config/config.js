var config=module.exports={};

config.db=process.env.TOKEN_MONGO_URL || "mongodb://127.0.0.1:27017/mpstoken";
config.account="shxhxtcarrefour";
config.password="gl94mer8uxr";
config.centralServer='mpsonline.sqstore.net';
config.centralServerPort=80;
config.centralServerAuthPath="/api/auth";
config.centralServerSyncPath="/api/sync";
config.scheduleTokenStr='* */2 * * *';
config.scheduleStoreStr='* */2 * * *';


