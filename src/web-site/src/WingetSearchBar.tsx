import * as React from 'react';
import { Autocomplete, Button, Stack, TextField } from '@mui/material';
import { search } from './winget-packages-db.ts';
import type { WingetPackage } from '../../create-winget-packages-sqlite-db/src/shared/winget-package.ts';

type WingetSearchBarProps = {
  initialQuery: string;
};

export function WingetSearchBar({ initialQuery }: WingetSearchBarProps) {
  const [searchBoxText, setSearchBoxText] = React.useState(initialQuery);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = React.useState<WingetPackage[]>([]);

  const triggerSearch = (q = searchBoxText) => {
    const query = q.trim();
    if (query.length < 3) return;

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('q', query);
    window.location.search = searchParams.toString();
  };

  React.useEffect(() => {
    const q = searchBoxText.trim();
    if (!q) {
      setAutocompleteSuggestions([]);
      return;
    }

    const timeout = window.setTimeout(() => {
      setAutocompleteSuggestions(search(q, 20));
    }, 200);

    return () => window.clearTimeout(timeout);
  }, [searchBoxText]);

  return (
    <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
      <Autocomplete
        sx={{ flex: 1 }}
        freeSolo
        filterOptions={(x) => x}
        options={autocompleteSuggestions}
        getOptionLabel={(opt: string | WingetPackage) => (typeof opt === 'string' ? opt : opt.PackageIdentifier)}
        renderOption={(props, opt) => (
          <li {...props} key={opt.PackageIdentifier}>
            <div>
              <div>{opt.PackageName}</div>
              <div style={{ opacity: 0.7, fontFamily: 'Consolas' }}>{opt.PackageIdentifier}</div>
            </div>
          </li>
        )}
        inputValue={searchBoxText}
        onInputChange={(_, value: string) => setSearchBoxText(value)}
        onChange={(_, value: string | WingetPackage | null) => {
          if (!value) return;

          triggerSearch(typeof value === 'string' ? value : value.PackageIdentifier);
        }}
        renderInput={(params) => <TextField {...params} placeholder="PackageName or PackageIdentifier. Minimum 3 characters" />}
      />

      <Button variant="contained" disabled={searchBoxText.trim().length < 3} onClick={() => triggerSearch()}>
        Search
      </Button>
    </Stack>
  );
}
