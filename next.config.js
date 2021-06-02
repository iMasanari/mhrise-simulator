module.exports = {
  future: {
    webpack5: true,
  },
  webpack(config) {
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      child_process: false,
    }

    return config
  },
}
