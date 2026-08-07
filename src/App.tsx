import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { VehicleDetailPage } from "./features/vehicles/pages/VehicleDetailPage";
import { VehicleFormPage } from "./features/vehicles/pages/VehicleFormPage";
import { VehicleListPage } from "./features/vehicles/pages/VehicleListPage";
import { AppShell } from "./shared/layout/AppShell";
import { NotFoundPage } from "./shared/layout/NotFoundPage";
import { RequireAuth } from "./shared/layout/RequireAuth";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/*"
        element={
          <RequireAuth>
            <AppShell>
              <Routes>
                <Route path="/" element={<Navigate to="/vehicles" replace />} />
                <Route path="/vehicles" element={<VehicleListPage />} />
                <Route path="/vehicles/new" element={<VehicleFormPage />} />
                <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
                <Route
                  path="/vehicles/:id/edit"
                  element={<VehicleFormPage />}
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AppShell>
          </RequireAuth>
        }
      />
    </Routes>
  );
}
