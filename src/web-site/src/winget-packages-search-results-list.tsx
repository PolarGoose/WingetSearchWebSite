import { Stack, Typography } from '@mui/material';
import { WingetPackageCard } from './winget-package-card.tsx';
import type { WingetPackage } from '../../create-winget-packages-flexsearch-db/src/shared/winget-package.ts';

type WingetPackagesSearchResultsListProps = { packages: WingetPackage[] };

export function WingetPackagesSearchResultsList({ packages }: WingetPackagesSearchResultsListProps) {
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      {packages.length === 0 ? <Typography color="text.secondary">No packages found.</Typography> : packages.map((pkg) => <WingetPackageCard key={pkg.PackageIdentifier} pkg={pkg} />)}
    </Stack>
  );
}
