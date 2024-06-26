const getServicesStats = require('../services/getServicesStatus');
const listCronLogs = require('../services/listCronLogs');

const getRootHandler = (request, h) => {

    return h.redirect('/index.html');
}

const getLostHandler = (request, h) => {
    const response = h.response({
        status: 'fail',
        message: 'Welcome to the Service, but you seem to be Lost!',
    })

    response.code(404);

    return response;
}

const postCaptchaHandler = async (reqeust, h) => {
    const {response: captchaResponse } = reqeust.payload;

    const { default: fetch } = await import('node-fetch');

    const targetEndpoint = 'https://www.google.com/recaptcha/api/siteverify';
    const body = new URLSearchParams({
        secret: process.env.CAPTCHA_SECRET_KEY,
        response: captchaResponse,
      }).toString();

    const result = await fetch(targetEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
        },
        body: body,
    })

    const data = await result.json();

    if(data.success !== true){
        throw new Error('Invalid reCaptcha');
    }

    const response = h.response({
        status: 'success',
        message: 'Valid reCaptcha',
    })

    response.code(200);

    return response;
}

const getLogsHandler = async (request, h) => {
    const logs = await listCronLogs();
    
    const response = h.response({
        status: 'success',
        message: 'Cron Logs retrieved successfully!',
        data: {
            logs: logs,
        }
    })

    response.code(200);
    return response;
}

const getServicesHandler = async (request, h) => {
    const result = await getServicesStats();

    const response = h.response({
        status: 'success',
        message: 'services retrieved successfully',
        data: {
            servicesStatus : result,
        }
    })

    response.code(200);

    return response;
}

module.exports = {
    getRootHandler, getLostHandler,
    postCaptchaHandler, getLogsHandler,
    getServicesHandler
}