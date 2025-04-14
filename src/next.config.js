module.exports = {
    webpack(config, { isServer }) {
      // فقط في حالة البناء على العميل
      if (!isServer) {
        config.resolve.fallback = {
          fs: false,
          stream: require.resolve('stream-browserify'),
          zlib: require.resolve('browserify-zlib'),
        };
      }
      return config;
    },
  };
  