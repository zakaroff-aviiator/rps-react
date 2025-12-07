import { Box, Typography } from '@mui/material';

export const LogoJanKenPon = () => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.3,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          textAlign: 'center',
          textShadow: '0 0 18px rgba(56,189,248,0.9)',
        }}
      >
        JAN-KEN-PON
      </Typography>
      <Typography
        variant="caption"
        sx={{
          fontSize: '0.85rem',
          letterSpacing: '0.18em',
          color: '#a5b4fc',
          textTransform: 'uppercase',
        }}
      >
        じゃんけんぽん
      </Typography>
    </Box>
  );
};
