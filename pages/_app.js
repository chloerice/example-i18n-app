import App from "next/app";
import Head from "next/head";
import Link from "next/link";
import Cookies from "js-cookie";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { Provider as AppBridgeProvider } from "@shopify/app-bridge-react";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import en from "@shopify/polaris/locales/en.json";

const client = new ApolloClient({
  fetchOptions: {
    credentials: "include"
  }
});

function CustomLink({ children, url, ...rest }) {
  return (
    <Link href={url}>
      <a {...rest}>{children}</a>
    </Link>
  );
}

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const config = {
      apiKey: API_KEY,
      shopOrigin: Cookies.get("shopOrigin"),
      forceRedirect: true
    };

    return (
      <React.Fragment>
        <Head>
          <title>Sample App</title>
          <meta charSet="utf-8" />
          <link
            rel="stylesheet"
            href="https://unpkg.com/@shopify/polaris@latest/styles.min.css"
          />
        </Head>
        <AppBridgeProvider config={config}>
          <PolarisProvider i18n={en} linkComponent={CustomLink}>
            <ApolloProvider client={client}>
              <Component {...pageProps} />
            </ApolloProvider>
          </PolarisProvider>
        </AppBridgeProvider>
      </React.Fragment>
    );
  }
}

export default MyApp;
