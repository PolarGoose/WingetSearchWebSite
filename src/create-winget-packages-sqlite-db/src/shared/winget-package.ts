export type WingetPackage = {
  PackageIdentifier: string;
  PackageVersion: string;
  PackageName: string;
  ShortDescription: string;
  Description?: string;
  Tags: string[];
  PackageUrl?: string;
  SupportedArchitecture: string[];
};
