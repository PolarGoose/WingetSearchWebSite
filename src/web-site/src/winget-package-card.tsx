import * as React from 'react';
import { Card, CardContent, Stack, Typography, TextField, Box, Link, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { ChipsRow } from './chips-row.tsx';
import type { WingetPackage } from '../../create-winget-packages-sqlite-db/src/shared/winget-package.ts';

type WingetPackageCardProps = { pkg: WingetPackage };
export function WingetPackageCard({ pkg }: WingetPackageCardProps) {
  const hasText = (s?: string) => !!s && s.length > 0;

  const titleNode = (
    <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
      {pkg.PackageName}
    </Typography>
  );

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, alignItems: 'baseline' }}>
            {hasText(pkg.PackageUrl) ? (
              <Link href={pkg.PackageUrl} target="_blank" rel="noreferrer" underline="hover" sx={{ display: 'inline-flex', alignItems: 'baseline' }}>
                {titleNode}
              </Link>
            ) : (
              titleNode
            )}

            <Typography variant="body2" sx={{ opacity: 0.7, whiteSpace: 'nowrap' }}>
              {pkg.PackageVersion}
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ opacity: 0.75, fontFamily: 'Consolas' }}>
            {pkg.PackageIdentifier}
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
            {pkg.ShortDescription}
          </Typography>

          <ChipsRow label="Tags" items={pkg.Tags} />

          <ChipsRow label="Supported architecture" items={pkg.SupportedArchitecture} />

          {hasText(pkg.Description) && (
            <Accordion>
              <AccordionSummary expandIcon={<ArrowDownwardIcon />} aria-controls="description-content" id="description-header">
                <Typography component="span">Detailed description</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{pkg.Description}</Typography>
              </AccordionDetails>
            </Accordion>
          )}

          <TextField
            value={`winget install -e --id ${pkg.PackageIdentifier}`}
            label="Install command"
            fullWidth
            size="small"
            margin="dense"
            slotProps={{
              input: {
                readOnly: true,
                sx: { fontFamily: 'Consolas' },
                onFocus: (e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.select(),
              },
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
