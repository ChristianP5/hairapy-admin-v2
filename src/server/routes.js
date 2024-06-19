const {
    getRootHandler, getLostHandler,
    postCaptchaHandler, getLogsHandler,
    getServicesHandler
} = require('./handler');

const path = require('path');

const routes = [
    {
        path: '/',
        method: 'GET',
        handler: getRootHandler,
    },
    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: path.join(__dirname, 'public'),
                index: ['index.html']
            }
        }
    },
    {
        method: 'POST',
        path: '/captcha',
        handler: postCaptchaHandler,
    },
    {
        method: 'GET',
        path: '/logs',
        handler: getLogsHandler,
    },
    {
        method: 'GET',
        path: '/services',
        handler: getServicesHandler,
    },
    {
        path: '/{any*}',
        method: '*',
        handler: getLostHandler,
    }
]

module.exports = routes