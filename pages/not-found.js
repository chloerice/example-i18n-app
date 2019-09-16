import { AppProvider, EmptyState, Page } from "@shopify/polaris";
import { App } from "../components";

export default function NotFound() {
  return (
    <App>
      <Page>
        <EmptyState
          heading="The page you're looking for couldn't be found"
          action={{ content: "Back to index", url: "/" }}
          image="https://uploads.codesandbox.io/uploads/user/1235c92d-7d36-443f-81d7-db0974fe238d/WrcV-404.svg"
        >
          <p>Check the web address and try again.</p>
        </EmptyState>
      </Page>
    </App>
  );
}
