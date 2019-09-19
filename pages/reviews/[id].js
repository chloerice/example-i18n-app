import React from "react";
import { gql } from "apollo-server-micro";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import {
  Avatar,
  Badge,
  Card,
  EmptyState,
  TextStyle,
  Page,
  Layout,
  Stack,
  Thumbnail,
  SkeletonPage,
  SkeletonBodyText,
  SkeletonDisplayText,
  TextContainer
} from "@shopify/polaris";

import { withApollo } from "../../apollo/client";
import { Rating } from "../../components";

const ReviewQuery = gql`
  query ReviewQuery($id: Int!) {
    review(id: $id) {
      id
      rating
      title
      content
      status
      date
      customer {
        name
        email
      }
      product {
        name
        reviewCount
        averageRating
      }
    }
  }
`;

function ReviewDetails() {
  const router = useRouter();
  const { id } = router.query;

  const { networkStatus, loading, data } = useQuery(ReviewQuery, {
    variables: { id: parseInt(id, 10) },
    skip: !id,
    notifyOnNetworkStatusChange: true
  });

  if (loading || networkStatus === 1) {
    return (
      <SkeletonPage breadcrumbs={[{ content: "All reviews", url: "/" }]}>
        <Layout>
          <Layout.Section>
            <Card title="Review" sectioned>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText />
              </TextContainer>
            </Card>
          </Layout.Section>
          <Layout.Section secondary>
            <Card sectioned>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText />
              </TextContainer>
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    );
  }

  const { review } = data;

  if (!review) {
    return (
      <Page>
        <EmptyState
          heading="The page you're looking for couldn't be found"
          action={{ content: "Back to index", url: "/" }}
          image="https://uploads.codesandbox.io/uploads/user/1235c92d-7d36-443f-81d7-db0974fe238d/WrcV-404.svg"
        >
          <p>Check the web address and try again.</p>
        </EmptyState>
      </Page>
    );
  }

  const badge =
    review.status === "published" ? (
      <Badge status="success">Published</Badge>
    ) : (
      <Badge status="warning">Unpublished</Badge>
    );

  return (
    <Page
      title={review.title}
      breadcrumbs={[{ content: "All reviews", url: "/" }]}
    >
      <Layout>
        <Layout.Section>
          <Card title="Review" sectioned>
            <Stack vertical>
              <Stack alignment="center">
                <Avatar customer name={review.customer.name} />
                <Stack.Item fill>
                  <p>{review.customer.name}</p>
                </Stack.Item>
                {badge}
              </Stack>
              <Rating value={review.rating} />
              <p>{review.content}</p>
            </Stack>
          </Card>
        </Layout.Section>

        <Layout.Section secondary>
          <Card>
            <Card.Section>
              <Stack alignment="center" distribution="equalSpacing">
                <Stack alignment="center">
                  <Thumbnail
                    source="https://cdn.shopify.com/s/files/1/1602/3257/products/cream-glass_1296x.png?v=1543327648"
                    alt="Pomade paste"
                    size="medium"
                  />
                  <TextStyle variation="strong">
                    {review.product.name}
                  </TextStyle>
                </Stack>
                <Stack>
                  <Rating value={review.product.averageRating} />
                  <p>{review.product.reviewCount} reviews</p>
                </Stack>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default withApollo(ReviewDetails);
