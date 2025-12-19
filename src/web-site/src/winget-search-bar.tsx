import * as React from 'react';
import { Autocomplete, Button, Stack, TextField } from '@mui/material';
import { search } from './winget-flexsearch-db.ts';
import type { WingetPackage } from '../../create-winget-packages-flexsearch-db/src/shared/winget-package.ts';

type WingetSearchBarProps = {
  onSearch: (query: string) => void;
};

export function WingetSearchBar({ onSearch }: WingetSearchBarProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<WingetPackage[]>([]);

  const debounceRef = React.useRef<number | null>(null);

  const triggerSearch = React.useCallback(
    (q?: string) => {
      const query = (q ?? inputValue).trim();
      if (!query) return;
      onSearch(query);
    },
    [inputValue, onSearch],
  );

  React.useEffect(() => {
    const q = inputValue.trim();
    if (!q) {
      setOptions([]);
      return;
    }

    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(() => {
      setOptions(search(q, 10));
    }, 120);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [inputValue]);

  return (
    <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
      <Autocomplete
        sx={{ flex: 1 }}
        freeSolo
        filterOptions={(x) => x}
        options={options}
        getOptionLabel={(opt: string | WingetPackage) => (typeof opt === 'string' ? opt : opt.PackageIdentifier)}
        renderOption={(props, opt) => (
          <li {...props} key={opt.PackageIdentifier}>
            <div>
              <div>{opt.PackageName}</div>
              <div style={{ opacity: 0.7, fontFamily: 'Consolas' }}>{opt.PackageIdentifier}</div>
            </div>
          </li>
        )}
        inputValue={inputValue}
        onInputChange={(_, value: string) => setInputValue(value)}
        onChange={(_, value: string | WingetPackage | null) => {
          if (!value) return;

          // User typed and picked "Enter" on freeSolo value
          if (typeof value === 'string') {
            triggerSearch(value);
            return;
          }

          // User selected a suggestion
          setInputValue(value.PackageIdentifier);
          triggerSearch(value.PackageIdentifier);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.defaultMuiPrevented) triggerSearch();
        }}
        renderInput={(params) => <TextField {...params} placeholder="PackageName or PackageIdentifier" />}
      />

      <Button variant="contained" onClick={() => triggerSearch()}>
        Search
      </Button>
    </Stack>
  );
}
