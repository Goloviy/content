export enum Orientations {
  Default = 0,
  MobilePortrait = 1 << 0,
  MobileLandscape = 1 << 1,
  TabletPortrait = 1 << 2,
  TabletLandscape = 1 << 3,
  Desktop = 1 << 4,
  DesktopWide = 1 << 5,
}

export type ILayoutServiceConfig = {
  defaultDesktopAspectRatio?: number
  defaultMobilePortraitAspectRatio?: number
  defaultMobileLandscapeRatio?: number
  maxTabletPortraitRatio?: number
  maxTabletLandscapeRatio?: number
  maxMobilePortraitRatio?: number
  mobileLandscapeRatio?: number
  desktopLandscapeRatio?: number
  flexibleWidthPortrait?: number
  flexibleHeightPortrait?: number
  flexibleWidthLandscape?: number
  flexibleHeightLandscape?: number
  supportOrientations?: Orientations
}
