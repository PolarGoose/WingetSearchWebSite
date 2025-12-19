import { Box, Chip, Stack, Typography } from '@mui/material';

type ChipsRowProps = { label: string; items: readonly string[] };
export function ChipsRow({ label, items }: ChipsRowProps) {
  if (items.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 0.75 }}>
      <Typography variant="caption" component="span" sx={{ opacity: 0.7, whiteSpace: 'nowrap', mr: 0.5 }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
        {items.map((x) => (
          <Chip key={x} label={x} size="small" variant="outlined" />
        ))}
      </Stack>
    </Box>
  );
}
