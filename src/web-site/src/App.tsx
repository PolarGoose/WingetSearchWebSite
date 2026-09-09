import { search, wingetPackagesSqliteDbCreationDate } from './winget-packages-db.ts';
import { WingetPackagesSearchResultsList } from './WingetPackagesSearchResultsList.tsx';
import { Box, Container, Link, Stack, Typography } from '@mui/material';
import { WingetSearchBar } from './WingetSearchBar.tsx';
import dayjs from 'dayjs';

export default function App() {
  const query = (new URLSearchParams(window.location.search).get('q') ?? '').trim();
  const hasSearched = query.length >= 3;
  const packages = hasSearched ? search(query) : [];

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <Link href="https://github.com/PolarGoose/WingetSearchWebSite" target="_blank" underline="hover">
          <Typography variant="h6">Github</Typography>
        </Link>
      </Box>
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ mt: 3, mb: 2 }}>
          Winget search
        </Typography>

        <WingetSearchBar initialQuery={query} />

        <Typography variant="body2" color="text.secondary">
          Database creation date: {dayjs(wingetPackagesSqliteDbCreationDate).locale('en').format('D-MMM-YYYY HH:mm:ss').toUpperCase()}
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
