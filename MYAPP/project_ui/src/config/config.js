const config = {
    // API Base URLs
    baseURL: {
        main: process.env.REACT_APP_API_URL || 'http://10.41.11.10:8080',
        message: process.env.REACT_APP_MESSAGE_API_URL || 'http://localhost:3000'
    },
    // API endpoints
    api: {
        base: '/api',
        auth: {
            login: '/login',
            register: '/register',
        },
        autoIntent: {
            login: '/loginAutoIntent',
            uploadDetails: '/uploadDetails',
            uploadSingleDetails: '/uploadSingleDetails',
            sendMail: '/send-mail',
            emailDetails: '/email-details',
            updateEmailDetails: '/update-email-details',
            deleteDashboardEmail: '/delete-dashboard-email',
        },
        files: {
            upload: '/upload',
            download: '/download',
        },
        gst: {
            execute: '/executeprocess-gst'
        },
        tds: {
            execute: '/executeprocess-tds'
        },
        messages: {
            send: '/send-message'
        },
    },

    // Routes
    routes: {
        home: '/',
        login: '/login',
        register: '/register',
        dashboard: '/dashboard',
        autoIntent: {
            dashboard: '/autointent_dashboard',
            upload: '/autointent_upload',
            singleUpload: '/autointent_singleUpload',
        },
        tds: {
            form: '/tds-form',
            upload: '/tds-upload',
        },
    },
};

export default config;