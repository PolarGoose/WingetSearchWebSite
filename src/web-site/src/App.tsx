import * as React from 'react';
import { search, flexSearchDatabaseCreationDate } from './winget-flexsearch-db.ts';
import { WingetPackagesSearchResultsList } from './winget-packages-search-results-list.tsx';
import { Container, Stack, Typography } from '@mui/material';
import { WingetSearchBar } from './winget-search-bar.tsx';
import type { WingetPackage } from '../../create-winget-packages-flexsearch-db/src/shared/winget-package.ts';

export default function App() {
  const [packages, setPackages] = React.useState<WingetPackage[]>([]);
  const [hasSearched, setHasSearched] = React.useState(false);

  const handleSearch = (query: string) => {
    setPackages(search(query));
    setHasSearched(true);
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h4">Winget search</Typography>

        <WingetSearchBar onSearch={handleSearch} />

        <Typography variant="body2" color="text.secondary">
          Database created: {flexSearchDatabaseCreationDate.toLocaleString()}
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
