import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import Link from "next/Link";

function CustomLink({ children, url, ...rest }) {
  return (
    <Link href={url}>
      <a {...rest}>{children}</a>
    </Link>
  );
}

export default function App({ children }) {
  return (
    <AppProvider i18n={enTranslations} linkComponent={CustomLink}>
      {children}
    </AppProvider>
  );
}
