let appConfig = {};

appConfig.port = 3000;
appConfig.allowedCorsOrigin = "*";
appConfig.env = "dev";
appConfig.db = {
    uri:"mongodb://node-shop:node-shop@cluster0-shard-00-00-zvxva.mongodb.net:27017,cluster0-shard-00-01-zvxva.mongodb.net:27017,cluster0-shard-00-02-zvxva.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
}
appConfig.apiVersion = "/api/v1";

module.exports = {
    port:appConfig.port,
    allowedCorsOrigin:appConfig.allowedCorsOrigin,
    environment:appConfig.env,
    db:appConfig.db,
    apiVersion:appConfig.apiVersion
}