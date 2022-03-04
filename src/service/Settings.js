const env = 'dev';

const Settings = {
    environment: {
        pathUrlClassrooms: '/classrooms',
        pathUrlStudent: '/students',
        pathUrlPaymentEvent: '/payments-events',
        local : {
            baseUrl : 'http://localhost:8080/api/v1',
        },
        dev : {
            baseUrl : 'https://reforcando-backend.herokuapp.com/api/v1',
        }
    }
};

export  {Settings, env} ;
