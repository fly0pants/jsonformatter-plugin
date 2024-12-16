declare module "*.json" {
  const manifest: chrome.runtime.ManifestV3;
  export default manifest;
} 