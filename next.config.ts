const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // API route to proxy
        destination: 'https://api.jsonserve.com/:path*', // The API you want to proxy
      },
    ];
  },
};
