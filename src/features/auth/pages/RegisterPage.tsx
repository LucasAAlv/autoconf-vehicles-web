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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { applyApiErrors } from "../../../shared/api/applyApiErrors";
import { useAuth } from "../AuthContext";
import { registerSchema, type RegisterFormValues } from "../schemas";

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setGeneralError(null);
    try {
      await registerUser(values);
      navigate("/vehicles", { replace: true });
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
            Criar conta
          </Typography>

          {generalError && <Alert severity="error">{generalError}</Alert>}

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nome"
                autoComplete="name"
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
              />
            )}
          />

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
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="password_confirmation"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirmar senha"
                type="password"
                autoComplete="new-password"
                error={!!errors.password_confirmation}
                helperText={errors.password_confirmation?.message}
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
            Criar conta
          </Button>

          <Typography variant="body2" textAlign="center">
            Já tem conta?{" "}
            <MuiLink component={RouterLink} to="/login">
              Entrar
            </MuiLink>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
