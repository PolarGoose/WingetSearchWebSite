import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Autocomplete, Button, Stack, TextField } from '@mui/material';
import { search } from './winget-packages-db.ts';
import type { WingetPackage } from '../../create-winget-packages-sqlite-db/src/shared/winget-package.ts';

type WingetSearchBarProps = {
  onSearch: (query: string) => void;
};

export function WingetSearchBar({ onSearch }: WingetSearchBarProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchBoxText, setSearchBoxText] = React.useState(() => searchParams.get('q') ?? '');
  const [autocompleteSuggestions, setAutocompleteSuggestions] = React.useState<WingetPackage[]>([]);

  const autocompleteSuggestionsGenerationDebounce = React.useRef<number | null>(null);
  const lastSearchedRef = React.useRef<string>('');

  // If `q` search query parameter changes (back/forward navigation, external link), sync it into the input + search
  React.useEffect(() => {
    const q = (searchParams.get('q') ?? '').trim();

    if (q !== searchBoxText) {
      setSearchBoxText(q);
    }

    if (q.length >= 3 && q !== lastSearchedRef.current) {
      lastSearchedRef.current = q;
      onSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, onSearch]); // intentionally not depending on searchBoxText to avoid loops

  const triggerSearch = React.useCallback(
    (q?: string) => {
      const query = (q ?? searchBoxText).trim();
      if (query.length < 3) return;

      // Update URL param `q` (preserve other params)
      const currentQparam = (searchParams.get('q') ?? '').trim();
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.set('q', query);
      setSearchParams(nextSearchParams, { replace: currentQparam === query /* avoid adding identical history entries */ });

      lastSearchedRef.current = query;
      onSearch(query);
    },
    [searchBoxText, onSearch, searchParams, setSearchParams],
  );

  React.useEffect(() => {
    const q = searchBoxText.trim();
    if (!q) {
      setAutocompleteSuggestions([]);
      return;
    }

    if (autocompleteSuggestionsGenerationDebounce.current) window.clearTimeout(autocompleteSuggestionsGenerationDebounce.current);

    autocompleteSuggestionsGenerationDebounce.current = window.setTimeout(() => {
      setAutocompleteSuggestions(search(q, 20));
    }, 200);

    return () => {
      if (autocompleteSuggestionsGenerationDebounce.current) window.clearTimeout(autocompleteSuggestionsGenerationDebounce.current);
    };
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

          // User typed and picked "Enter" on freeSolo value
          if (typeof value === 'string') {
            triggerSearch(value);
            return;
          }

          // User selected a suggestion
          setSearchBoxText(value.PackageIdentifier);
          triggerSearch(value.PackageIdentifier);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.defaultMuiPrevented) triggerSearch();
        }}
        renderInput={(params) => <TextField {...params} placeholder="PackageName or PackageIdentifier. Minimum 3 characters" />}
      />

      <Button variant="contained" disabled={searchBoxText.trim().length < 3} onClick={() => triggerSearch()}>
        Search
      </Button>
    </Stack>
  );
}
