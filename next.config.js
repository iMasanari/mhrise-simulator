module.exports = {
  webpack(config) {
    // https://github.com/vercel/next.js/issues/26152#issuecomment-862346528
    config.optimization.splitChunks = false

    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      child_process: false,
    }

    return config
  },
}
