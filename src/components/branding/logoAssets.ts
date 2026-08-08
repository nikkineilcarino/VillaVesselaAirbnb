const logoAssetRevision = "20260808-six-sampaguitas-spaced";

function versionLogoAsset<TPath extends `/logo/${string}`>(path: TPath) {
  return `${path}?v=${logoAssetRevision}` as const;
}

export const logoAssets = {
  appleTouchIcon: versionLogoAsset("/logo/apple-touch-icon.png"),
  favicon: versionLogoAsset("/logo/favicon.svg"),
  full: {
    dark: versionLogoAsset("/logo/villa-vessela-logo-dark.svg"),
    light: versionLogoAsset("/logo/villa-vessela-logo-light.svg"),
  },
  mark: {
    dark: versionLogoAsset("/logo/villa-vessela-mark.svg"),
    light: versionLogoAsset("/logo/villa-vessela-mark-light.svg"),
  },
  webAppIcon192: versionLogoAsset("/logo/web-app-icon-192.png"),
  webAppIcon512: versionLogoAsset("/logo/web-app-icon-512.png"),
} as const;
