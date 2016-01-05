var config=module.exports={};

// config.marathon_master="172.21.100.221:8080";
// config.username="ima";
// config.password="ima"

config.mailgun={
	api_key:"key-751478399dbedfd1eaa1bd824220eb4b",
	domain:'mg.kimatech.com'
}

config.emailFrom="james@kimatech.com";

config.app="MPSAPI";

config.db=process.env.MONGO_URL || "mongodb://127.0.0.1:27017/mpsapi";