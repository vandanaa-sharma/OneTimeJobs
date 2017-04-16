
/* Settings based on deployment */

var config = {
    /* Local Debugging */
    local: {
        mode: 'local',
        port: 8080,
        database:'mongodb://localhost:27017/test'
    },
    /* Heroku */
    staging: {
        mode: 'staging',
    },
    /* Deployment */
    production: {
        mode: 'production',
    }
}

module.exports = function(mode) {
    /* process.argv[2] - command line argument */
    return config[mode || process.argv[2] || 'local'] || config.local;
}