/** @type {import('next').NextConfig} */
module.exports = {
  outputFileTracingRoot: __dirname,
  output: "export",
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: { unoptimized: true },
};
