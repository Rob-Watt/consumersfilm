// GitHub Pages serves project sites from /<repo-name>, so the deploy
// workflow sets NEXT_PUBLIC_BASE_PATH. Locally it is empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
