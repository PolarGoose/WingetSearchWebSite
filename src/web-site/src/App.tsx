import * as React from 'react';
import { search, wingetPackagesSqliteDbCreationDate } from './winget-packages-db.ts';
import { WingetPackagesSearchResultsList } from './winget-packages-search-results-list.tsx';
import { Box, Container, Link, Stack, Typography } from '@mui/material';
import { WingetSearchBar } from './winget-search-bar.tsx';
import type { WingetPackage } from '../../create-winget-packages-sqlite-db/src/shared/winget-package.ts';

export default function App() {
  const [packages, setPackages] = React.useState<WingetPackage[]>([]);
  const [hasSearched, setHasSearched] = React.useState(false);

  const handleSearch = (query: string) => {
    setPackages(search(query));
    setHasSearched(true);
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <Link href="https://github.com/PolarGoose/WingetSearchWebSite" target="_blank" underline="hover">
          <Typography variant="h6">Github</Typography>
        </Link>
      </Box>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h4">Winget search</Typography>

        <WingetSearchBar onSearch={handleSearch} />

        <Typography variant="body2" color="text.secondary">
          Database creation date: {wingetPackagesSqliteDbCreationDate.toLocaleString()}
        </Typography>

        {hasSearched && (
          <>
            <Typography variant="body2" color="text.secondary">
              {packages.length} result{packages.length === 1 ? '' : 's'}
            </Typography>
            <WingetPackagesSearchResultsList packages={packages} />
          </>
        )}
      </Stack>
    </Container>
  );
}
