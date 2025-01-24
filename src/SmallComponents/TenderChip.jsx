import React from 'react';
import { Chip } from '@mui/material';

function getChipColor(tenderStatus) {
  switch (tenderStatus) {
    case 'Open':
      return 'warning'; // Orange
    case 'Submitted':
      return 'default'; // Yellow (use 'default' for a grayish color, or customize)
    case 'Won':
      return 'success'; // Green
    case 'Lost':
      return 'error'; // Red
    case 'Issued':
      return 'primary'; // Blue
    default:
      return 'default'; // Fallback color
  }
}

const TenderChip = ({ tender }) => (
  <Chip
    label={tender.Values.TenderStatus}
    color={getChipColor(tender.Values.TenderStatus)}
  />
);

export default TenderChip;
