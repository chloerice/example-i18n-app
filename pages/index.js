import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-server-micro";
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

import { ReviewListItem } from "../components";
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
  const { networkStatus, loading, data } = useQuery(ReviewsQuery, {
    notifyOnNetworkStatusChange: true
  });

  if (loading || networkStatus === 1) {
    return (
      <Page
        title="Product reviews"
        secondaryActions={[
          { icon: SettingsMinor, content: "Settings", url: "/settings" }
        ]}
      >
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText />
            <SkeletonBodyText />
          </TextContainer>
        </Card>
      </Page>
    );
  }

  const { reviews } = data;

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
    <Page
      title="Product reviews"
      secondaryActions={[
        { icon: SettingsMinor, content: "Settings", url: "/settings" }
      ]}
    >
      {emptyStateContent}
      {reviewsIndex}
    </Page>
  );
}

export default withApollo(ReviewList);
