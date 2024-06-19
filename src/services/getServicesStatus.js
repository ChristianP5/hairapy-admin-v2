const { ServicesClient } = require('@google-cloud/run').v2;

const runClient = new ServicesClient();

const SUCCESS = 'CONDITION_SUCCEEDED';

const getServicesStats = async () => {
    const getBaseService = async () => {
        return new Promise( async (resolve) => {
            const request = {
                name: 'projects/hairapy/locations/asia-southeast2/services/hairapy-api',
            }

            const response = await runClient.getService(request);

            resolve(response);
        })
    }

    const getAuthService = async () => {
        return new Promise( async (resolve) => {
            const request = {
                name: 'projects/hairapy/locations/asia-southeast2/services/hairapy-api-auth',
            }

            const response = await runClient.getService(request);

            resolve(response);
        } )
    }

    try{
        const results = await Promise.all([getBaseService(), getAuthService()]);
        const states = [];
        results.forEach(result => {
            const state = result[0].terminalCondition.state;
            states.push(state);
        })

        return {
            baseService: states[0] === SUCCESS ? true : false,
            authService: states[1] === SUCCESS ? true : false,
        }

    }catch(error){
        throw new Error('Something went wrong when getting Service Status');
    }
}

module.exports = getServicesStats;