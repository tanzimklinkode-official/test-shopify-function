import { createContext, useEffect, useState } from "react";
export const ShopContext = createContext();
const ShopProvider = ({ children }) => {
const [shop, setShop] = useState(null);
const [host, setHost] = useState(null);
useEffect(() => {
const params = new URLSearchParams(window.location.search);
const shopParam = params.get("shop");
const hostParam = params.get("host");
if (shopParam && hostParam) {
localStorage.setItem("shop", shopParam);
localStorage.setItem("host", hostParam);
setShop(shopParam);
setHost(hostParam);
} else {
// Fallback from localStorage if params not available
const storedShop = localStorage.getItem("shop");
const storedHost = localStorage.getItem("host");
if (storedShop && storedHost) {
setShop(storedShop);
setHost(storedHost);
}
}
}, []);
const shopInfo = {
shop,
host
};
return (
    <ShopContext.Provider value={shopInfo}>{children}</ShopContext.Provider>
);
};
export default ShopProvider;
