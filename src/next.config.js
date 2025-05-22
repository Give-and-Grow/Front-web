module.exports = {
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        stream: require.resolve('stream-browserify'),
        zlib: require.resolve('browserify-zlib'),
        url: require.resolve('url/'),  // <-- إضافة هذه السطر
        assert: require.resolve('assert/'),  // <-- هنا أضف assert
       
        "stream": require.resolve("stream-browserify"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "assert": false,
        "fs": false,
        "path": false,
        "crypto": false,
      };
    }
    return config;
  },
};
