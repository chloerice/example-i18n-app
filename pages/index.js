import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { SettingsMinor } from "@shopify/polaris-icons";
import {
  Page,
  EmptyState,
  Card,
  ResourceList,
  SkeletonBodyText,
  SkeletonDisplayText,
  TextContainer
} from "@shopify/polaris";

import { ReviewListItem, App } from "../components";
import { withApollo } from "../apollo/client";

const ReviewsQuery = gql`
  query ReviewsQuery {
    reviews {
      id
      title
      status
      date
      customer {
        name
      }
      product {
        name
      }
    }
  }
`;

function ReviewList() {
  const {
    networkStatus,
    loading,
    data: { reviews }
  } = useQuery(ReviewsQuery, { notifyOnNetworkStatusChange: true });

  const loadingStateContent =
    networkStatus === 1 ? (
      <Card sectioned>
        <TextContainer>
          <SkeletonDisplayText size="small" />
          <SkeletonBodyText />
          <SkeletonBodyText />
        </TextContainer>
      </Card>
    ) : null;

  const emptyStateContent =
    !loading && reviews && reviews.length === 0 ? (
      <EmptyState
        heading="You haven't received any reviews yet"
        action={{ content: "Configure settings", url: "/settings" }}
        image="/review-empty-state.svg"
      >
        <p>Once you have received reviews they will display on this page.</p>
      </EmptyState>
    ) : null;

  const reviewsIndex =
    reviews && reviews.length > 0 ? (
      <Card>
        <ResourceList
          showHeader
          items={reviews}
          resourceName={{ singular: "review", plural: "reviews" }}
          renderItem={(review, id, index) => <ReviewListItem {...review} />}
        />
      </Card>
    ) : null;

  return (
    <App>
      <Page
        title="Product reviews"
        secondaryActions={[
          { icon: SettingsMinor, content: "Settings", url: "/settings" }
        ]}
      >
        {loadingStateContent}
        {emptyStateContent}
        {reviewsIndex}
      </Page>
    </App>
  );
}

export default withApollo(ReviewList);
