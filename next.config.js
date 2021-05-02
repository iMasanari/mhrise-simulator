module.exports = {
  future: {
    webpack5: true,
  },
  webpack(config, { isServer, dev }) {
    config.resolve.fallback = {
      fs: false,
      path: false,
      crypto: false,
    }

    config.output.chunkFilename = isServer
      ? `${dev ? '[name]' : '[name].[fullhash]'}.js`
      : `static/chunks/${dev ? '[name]' : '[name].[fullhash]'}.js`

    return config
  },
}
