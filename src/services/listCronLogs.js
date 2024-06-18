const { Logging } = require('@google-cloud/logging');

const listCronLogs = async () => {
    const logging = new Logging({
        projectId: process.env.PROJECT_ID,
    })

    const payloadFilter = 'textPayload=~"((?:\\d[,.]?)*\\d) responseTokens deleted successfully\\."';
    const payloadFilter_2 = 'textPayload=~"((?:\\d[,.]?)*\\d) refreshTokens deleted successfully\\."';

    const maxDate = new Date();
    const minDate = new Date();
    minDate.setDate(maxDate.getDate() - 6);

    const parsedMaxDate = maxDate.toISOString();
    const parsedMinDate = minDate.toISOString();
    const dateFilter = `timestamp >= "${parsedMinDate}" AND timestamp <= "${parsedMaxDate}"`;

    const logsFilter = `(${payloadFilter} OR ${payloadFilter_2}) AND ${dateFilter}`;

    const options = {
        filter: logsFilter,
    }

    const [entries] = await logging.getEntries(options);

    const logs = [];
    entries.forEach(entry => {
        const obj = {
            date: entry.metadata.timestamp,
            value: +entry.data.split(" ")[0],
        }

        logs.push(obj);
    })


    return logs;
}

module.exports = listCronLogs;