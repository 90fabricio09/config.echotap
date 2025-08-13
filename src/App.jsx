import { Outlet } from "react-router-dom";
import { NotificationProvider } from "./contexts/NotificationContext";

const App = () => {
    return (
        <NotificationProvider>
            <Outlet />
        </NotificationProvider>
    );
};

export default App;