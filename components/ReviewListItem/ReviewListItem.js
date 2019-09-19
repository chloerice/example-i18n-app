import React from "react";
import {
  Avatar,
  Badge,
  ResourceItem,
  Stack,
  TextStyle
} from "@shopify/polaris";

import styles from "./ReviewListItem.css";
import { loadGetInitialProps } from "next/dist/next-server/lib/utils";

function ReviewListItem({
  id,
  title,
  date,
  product,
  customer,
  status,
  ...rest
}) {
  const badgeContent = status === "published" ? "Published" : "Unpublished";
  const badgeStatus = status === "published" ? "success" : "attention";
  const badge = <Badge status={badgeStatus}>{badgeContent}</Badge>;
  const media = (
    <Avatar initials={customer.initials} customer name={customer.name} />
  );

  return (
    <ResourceItem id={id} url={`/reviews/${id}`} media={media} {...rest}>
      <div className={styles.ReviewListItem}>
        <div className={styles.Content}>
          <TextStyle variation="strong">
            <p>{title}</p>
          </TextStyle>
          <TextStyle variation="subdued">
            by {customer.name} on {product.name}
          </TextStyle>
        </div>
        <div className={styles.Metadata}>
          <Stack spacing="tight">
            {badge}
            <TextStyle variation="subdued">{date}</TextStyle>
          </Stack>
        </div>
      </div>
    </ResourceItem>
  );
}

export default ReviewListItem;
