import { Box, Chip, Stack, Typography } from '@mui/material';

type ChipsRowProps = { label: string; items: readonly string[] };
export function ChipsRow({ label, items }: ChipsRowProps) {
  if (items.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5, alignSelf: 'center' }}>
          {label}
        </Typography>
        {items.map((x) => (
          <Chip key={x} label={x} size="small" variant="outlined" />
        ))}
      </Stack>
    </Box>
  );
}
