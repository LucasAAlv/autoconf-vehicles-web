import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { applyApiErrors } from "../../../shared/api/applyApiErrors";
import { useAuth } from "../AuthContext";
import { loginSchema, type LoginFormValues } from "../schemas";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setGeneralError(null);
    try {
      await login(values);
      const from =
        (location.state as { from?: Location })?.from?.pathname ?? "/vehicles";
      navigate(from, { replace: true });
    } catch (error) {
      const detail = applyApiErrors(error, setError);
      if (detail) setGeneralError(detail);
    }
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      px={2}
    >
      <Paper variant="outlined" sx={{ p: 4, width: 400, maxWidth: "100%" }}>
        <Stack spacing={3} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h5" textAlign="center">
            Autoconf Veículos
          </Typography>

          {generalError && <Alert severity="error">{generalError}</Alert>}

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="E-mail"
                type="email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Senha"
                type="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
          >
            Entrar
          </Button>

          <Typography variant="body2" textAlign="center">
            Não tem conta?{" "}
            <MuiLink component={RouterLink} to="/register">
              Cadastre-se
            </MuiLink>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
