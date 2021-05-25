module.exports = {
  webpack(config, { defaultLoaders }) {
    config.node = {
      fs: 'empty',
      child_process: 'empty',
    }

    config.module.rules.push({
      test: /worker\.ts$/,
      use: [
        { loader: 'worker-loader', options: { publicPath: '/_next/', filename: 'static/worker/worker.[hash].js' } },
        defaultLoaders.babel,
      ],
    })

    config.output.globalObject = 'self'

    return config
  },
}
