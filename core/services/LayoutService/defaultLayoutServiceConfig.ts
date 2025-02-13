import { type ILayoutServiceConfig, Orientations } from 'Core/services/LayoutService/types'

export const defaultLayoutServiceConfig: Required<ILayoutServiceConfig> = {
  defaultDesktopAspectRatio: 1.57,
  defaultMobileLandscapeRatio: 1.4,
  defaultMobilePortraitAspectRatio: 0.7,
  maxTabletPortraitRatio: 0.74,
  maxTabletLandscapeRatio: 1.2,
  maxMobilePortraitRatio: 1,
  mobileLandscapeRatio: 1.4,
  desktopLandscapeRatio: 1.57,

  flexibleWidthPortrait: 0,
  flexibleHeightPortrait: 0,
  flexibleWidthLandscape: 0,
  flexibleHeightLandscape: 0,
  supportOrientations: Orientations.Desktop | Orientations.MobilePortrait | Orientations.MobileLandscape,
}
