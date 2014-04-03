var config = {};
config["imap"] = {};
config["smtp"] = {};

config["name"] = "OpenRecess";
config["email"] = process.env["emailLogin"];
config["username"] = process.env["emailLogin"];
config["password"] = process.env["emailPassword"];

    config.imap["host"] = "imap.gmail.com";
    config.imap["port"] = 993;
    config.imap["secure"] = true;

    config.smtp["host"] = "smtp.gmail.com";
    config.smtp["tls"] = true;
    config.smtp["port"] = 465;

module.exports = config;