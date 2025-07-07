import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Create from "../pages/Create";
import Edit from "../pages/Edit";
const router = createBrowserRouter([
{
path: '/',
element: <Home />
},
{
    path: '/rules/create',
element: <Create />
},
{
path: '/rules/edit/:id',
element: <Edit />
}
])
export default router;