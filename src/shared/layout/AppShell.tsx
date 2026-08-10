import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <AppBar
        position="static"
        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Toolbar>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            component={RouterLink}
            to="/"
            sx={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
          >
            <Box
              component="img"
              src="https://autoconf.com.br/wp-content/uploads/2025/11/Camada_1.png"
              alt="Autoconf"
              sx={{ height: 32, width: "auto" }}
            />
          </Stack>
          {user && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                {user.name}
              </Typography>
              <Button
                size="small"
                color="inherit"
                startIcon={<LogoutOutlinedIcon />}
                onClick={handleLogout}
              >
                Sair
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
