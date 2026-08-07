import { Alert, Snackbar } from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Severity = "success" | "error";

interface Notification {
  key: number;
  message: string;
  severity: Severity;
}

interface NotificationContextValue {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  const notify = useCallback((message: string, severity: Severity) => {
    setNotification({ key: Date.now(), message, severity });
  }, []);

  const value = useMemo(
    () => ({
      notifySuccess: (message: string) => notify(message, "success"),
      notifyError: (message: string) => notify(message, "error"),
    }),
    [notify],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        key={notification?.key}
        open={!!notification}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {notification ? (
          <Alert
            severity={notification.severity}
            variant="filled"
            onClose={() => setNotification(null)}
          >
            {notification.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotify must be used within a NotificationProvider");
  }
  return context;
}
