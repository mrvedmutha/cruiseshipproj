const isProd = process.env.NODE_ENV === "production";

export default {
  images: {
    domains: isProd ? ["your-production-domain.com"] : ["localhost"],
  },
};
