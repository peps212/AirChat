/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, { webpack, isServer }) {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^node:/,
        (resource) => {
          resource.request = resource.request.replace(/^node:/, '');
        }
      )
    );
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
}

module.exports =  nextConfig
