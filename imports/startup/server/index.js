// Import server startup through a single index entry point

import '../both/defaults.js';
import './defaults.js';
import './fixtures.js';
import './register-api.js';

// inserts google analytics based on if server is development or production
WebAppInternals.registerBoilerplateDataCallback('someKey', (request, data, arch) => {
    if(Meteor.isDevelopment) {
        data.head = data.head + `
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-139764993-2');
        </script>`;
    }
    if(Meteor.isProduction) {
        data.head = data.head + `
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-139764993-1');
        </script>`;
    }
});