import { createRoot } from 'react-dom/client'
import App from './App'
import enTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import { AppProvider } from "@shopify/polaris";
import ShopProvider from "./contexts/ShopContext";

const root = document.createElement('div')
document.body.appendChild(root)
createRoot(root).render(
    <AppProvider i18n={enTranslations}>
        <ShopProvider>
            <App />
        </ShopProvider>
    </AppProvider>
);
