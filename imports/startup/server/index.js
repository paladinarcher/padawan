// Import server startup through a single index entry point

import '../both/defaults.js';
import './defaults.js';
import './fixtures.js';
import './register-api.js';

// inserts google analytics based on if server is production, staging, or dev
WebAppInternals.registerBoilerplateDataCallback('someKey', (request, data, arch) => {
    // console.log('Meteor.absoluteUrl: ', Meteor.absoluteUrl());
    let url = Meteor.absoluteUrl();
    let isApp = isStage = isDev = isLocal = false;
    isApp = (/app/g.test(url)) ? true : false;
    isStage = (/stage/g.test(url)) ? true : false;
    isDev = (/dev/g.test(url)) ? true : false;
    isLocal = (/local/g.test(url)) ? true : false;
    if(isApp && Meteor.isProduction) {
        data.head = data.head + `
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-139764993-1"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-139764993-1');
        </script>`;
    } else if(isStage && Meteor.isProduction) {
        data.head = data.head + `
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-139764993-2"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-139764993-2');
        </script>`;
    } else if(isDev && Meteor.isProduction) {
        data.head = data.head + `
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-139764993-3"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-139764993-3');
        </script>`;
    } else if(isLocal && Meteor.isDevelopment) {
        data.head = data.head + `
        <!-- local development does not use google analytics gtags -->
        `;
    }
});