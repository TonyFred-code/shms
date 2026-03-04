import { RouterProvider } from "react-router-dom";
import AuthProvider from "./context/authProvider.jsx";
import DataProvider from "./context/dataProvider.jsx";
import router from "./routes/route.jsx";

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <RouterProvider router={router} />
      </DataProvider>
    </AuthProvider>
  );
}
