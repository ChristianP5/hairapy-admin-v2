const getRootHandler = (request, h) => {
    const response = h.response({
        status: 'success',
        message: 'Welcome to Root!',
    })

    response.code(200);

    return response;
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

module.exports = {
    getRootHandler, getLostHandler,
    postCaptchaHandler
}