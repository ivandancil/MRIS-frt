import { createContext, useState, useContext } from "react";

interface Notification {
  id: string;
  message: string;
  role: string;
  requestId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, role: string, requestId?: string) => void;
  removeNotification: (requestId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, role: string, requestId?: string) => {
    setNotifications((prev) => [...prev, { id: Date.now().toString(), message, role, requestId }]);
  };

  const removeNotification = (requestId: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.requestId !== requestId));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationContext must be used within a NotificationProvider");
  }
  return context;
}
