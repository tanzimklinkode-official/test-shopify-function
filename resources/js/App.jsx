import { RouterProvider } from "react-router-dom";
import router from "./router/Routes";
const App = () => {
    return <RouterProvider router={router} />;
};
export default App;