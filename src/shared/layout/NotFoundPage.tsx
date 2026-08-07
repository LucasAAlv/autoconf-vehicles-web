import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function NotFoundPage() {
  return (
    <Stack spacing={2} alignItems="center" textAlign="center" py={8}>
      <Typography variant="h3">404</Typography>
      <Typography color="text.secondary">Esta página não existe.</Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Voltar para o início
      </Button>
    </Stack>
  );
}
