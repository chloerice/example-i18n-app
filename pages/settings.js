import React, { useCallback, useState } from "react";
import { gql } from "apollo-server-micro";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Card,
  Page,
  Layout,
  Form,
  ChoiceList,
  Checkbox,
  TextField,
  FormLayout,
  SkeletonBodyText,
  SkeletonDisplayText,
  TextContainer
} from "@shopify/polaris";

import { withApollo } from "../apollo/client";

const SettingsQuery = gql`
  query SettingsQuery {
    settings {
      autoPublish
      emailNotifications
      email
    }
  }
`;

const UpdateSettings = gql`
  mutation updateSettings(
    $autoPublish: Boolean
    $emailNotifications: Boolean
    $email: String
  ) {
    updateSettings(
      autoPublish: $autoPublish
      emailNotifications: $emailNotifications
      email: $email
    ) {
      autoPublish
      emailNotifications
      email
    }
  }
`;

function Settings() {
  const { data, loading, networkStatus } = useQuery(SettingsQuery, {
    notifyOnNetworkStatusChange: true
  });

  if (loading || networkStatus === 1) {
    return (
      <Form onSubmit={handleFormSubmit}>
        <Page
          title="Settings"
          breadcrumbs={[{ content: "Product reviews", url: "/" }]}
          primaryAction={{
            content: "Save",
            submit: true,
            disabled: emailError
          }}
        >
          <Layout>
            <Layout.AnnotatedSection
              title="Auto publish"
              description="Automatically check new reviews for spam and then publish them."
            >
              <Card sectioned>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText />
                </TextContainer>
              </Card>
            </Layout.AnnotatedSection>
            <Layout.AnnotatedSection
              title="Email settings"
              description="Choose if you want to receive email notifications for each review."
            >
              <Card sectioned>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText />
                </TextContainer>
              </Card>
            </Layout.AnnotatedSection>
          </Layout>
        </Page>
      </Form>
    );
  }

  const { settings } = data;
  const [updateSettings] = useMutation(UpdateSettings);
  const [autoPublish = settings.autoPublish, setAutoPublish] = useState(false);
  const [email = settings.email, setEmail] = useState("");
  const [
    emailNotifications = settings.emailNotifications,
    setEmailNotifications
  ] = useState(false);

  const [emailError, setEmailError] = useState(false);

  const handleAutoPublishChange = useCallback(value => {
    setAutoPublish(value[0] === "enabled");
  });

  const handleEmailNotificationChange = useCallback(receiveNotifications => {
    const emailError =
      receiveNotifications && email === ""
        ? "Enter an email to get review notifications."
        : undefined;

    // If the merchant elects to receive email notifications by checking the checkbox, but hasn't input an email address in the text field, we let them know they need to add their email by rendering an error message
    setEmailNotifications(receiveNotifications);
    setEmailError(emailError);
  });

  const handleEmailChange = useCallback(value => {
    // We handle the error state of the email text field at the same time that we handle the field's onChange event, just in case the merchant removes their email but forgets to uncheck the email notification checkbox.
    const emailError =
      emailNotifications && value === ""
        ? "Enter an email to get review notifications."
        : false;

    setEmail(value);
    setEmailError(emailError);
  });

  const handleFormSubmit = useCallback(() => {
    // We prevent form submission when there is an error in the email field.
    if (emailError) {
      return;
    }

    // Otherwise, we use GraphQL to update the merchant's app settings.
    updateSettings({
      variables: {
        autoPublish,
        emailNotifications,
        email
      }
    });
  });

  // While the data loads during our GraphQL request, we render skeleton content to signify to the merchant that page data is on its way.

  const autoPublishSelected = autoPublish ? ["enabled"] : ["disabled"];

  const settingsFormContent = !loading ? (
    <Layout>
      {/* Annotated sections are useful in settings pages to give more context about what the merchant will change with each setting. */}
      <Layout.AnnotatedSection
        title="Auto publish"
        description="Automatically check new reviews for spam and then publish them."
      >
        <Card sectioned>
          {/* Choice lists display a list of checkboxes or radio buttons to gather choice input. See the style guide to learn more https://polaris.shopify.com/components/forms/choice-list */}
          <ChoiceList
            title="Auto publish"
            choices={[
              {
                label: "Enabled",
                value: "enabled",
                helpText:
                  "New reviews are checked for spam and then automatically published."
              },
              {
                label: "Disabled",
                value: "disabled",
                helpText: "You must manually approve and publish new reviews."
              }
            ]}
            selected={autoPublishSelected}
            onChange={handleAutoPublishChange}
          />
        </Card>
      </Layout.AnnotatedSection>
      <Layout.AnnotatedSection
        title="Email settings"
        description="Choose if you want to receive email notifications for each review."
      >
        <Card sectioned>
          <FormLayout>
            <TextField
              value={email}
              label="Email"
              type="email"
              error={emailError}
              onChange={handleEmailChange}
            />
            <Checkbox
              checked={emailNotifications}
              label="Send me an email when a review is submitted."
              onChange={handleEmailNotificationChange}
            />
          </FormLayout>
        </Card>
      </Layout.AnnotatedSection>
    </Layout>
  ) : null;

  // We wrap our page component in a form component that handles form submission for the whole page. We could also handle submittal with the onClick event of the save button. Either approach works fine.
  return (
    <Form onSubmit={handleFormSubmit}>
      <Page
        title="Settings"
        breadcrumbs={[{ content: "Product reviews", url: "/" }]}
        primaryAction={{
          content: "Save",
          submit: true,
          disabled: emailError
        }}
      >
        {settingsFormContent}
      </Page>
    </Form>
  );
}

export default withApollo(Settings);
