module.exports = function (grunt) {
    "use strict";

    var proxy = require('http-proxy-middleware')
    var modifyResponse = require('node-http-proxy-json')
    grunt.loadNpmTasks('grunt-browser-sync')

    var s4HanaProxy = proxy('/S4_HANA', {
        target: 'http://s4d.patrimar.com.br:8090',
        logLevel: 'debug',
        changeOrigin: true,
        auth: 'MLOLIVEIRA:123456',
        pathRewrite: {
            '/S4_HANA': 'http://s4d.patrimar.com.br:8090'
        },
        onProxyReq: function (proxyReq, req, res) {
            proxyReq.setHeader('sap-client', '300');
        }
    });

    var userApiProxy = proxy('/services/userapi', {
        logLevel: 'debug',
        target: 'https://avzotlg5p.accounts.ondemand.com',
        changeOrigin: true,
        auth: 'MLOLIVEIRA:123456',
        onProxyReq: function (proxyReq, req, res) {
            proxyReq.setHeader('sap-client', '300');
            res.write(JSON.stringify({
                loginname: "11414766000139",
                email: "sdiego@seidor.com.br",
                name: "P000002",
                lastname: "Silva",
                firstname: "Diêgo",
                supplier: "100089"
            }));
        }
    });

    var resourcesProxy = proxy('/resources', {
        target: 'https://sapui5.hana.ondemand.com',
        changeOrigin: true
    })

    var testResourcesProxy = proxy('/test-resources', {
        target: 'https://sapui5.hana.ondemand.com',
        changeOrigin: true
    })

    grunt.initConfig({
        browserSync: {
            default_options: {
                bsFiles: {
                    src: '**/*,js'
                },
                options: {
                    server: {
                        baseDir: ['webapp'],
                        middleware: [s4HanaProxy, resourcesProxy, testResourcesProxy, userApiProxy]
                    },
                    startPath: "/test/flpSandbox.html"
                }
            },
        },
    });

    grunt.registerTask("default", [
        "browserSync",
    ]);

};
