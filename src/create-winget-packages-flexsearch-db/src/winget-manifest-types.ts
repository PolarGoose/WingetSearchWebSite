// Type definitions for winget manifest files
// Based on https://github.com/microsoft/winget-pkgs

export type MainManifest = {
  PackageIdentifier: string;
  PackageVersion: string;
  DefaultLocale: string;
};

export type LocaleManifest = {
  PackageName: string;
  ShortDescription: string;
  Description?: string;
  Tags?: string[];
  PackageUrl?: string;
};

export type Installer = {
  Architecture: string;
};

export type InstallerManifest = {
  Installers: Installer[];
};
