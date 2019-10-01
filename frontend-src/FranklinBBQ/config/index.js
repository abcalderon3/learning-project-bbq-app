const urls = {
    gcp: 'https://ryac-44926.appspot.com/',
    local: 'http://127.0.0.1:5000/',
};

export const inventoryServiceConfig = {
    serviceUrl: urls.gcp,
    enabled: true,
    commonHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
};

export const today = '2017-07-20';