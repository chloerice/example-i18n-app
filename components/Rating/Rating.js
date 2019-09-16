import { Icon } from "@shopify/polaris";
import { StarFilledMinor, StarOutlineMinor } from "@shopify/polaris-icons";

import styles from "./Rating.scss";

export default function Rating(props) {
  const { value } = props;
  const ratings = Array.from({ length: 5 }, (element, index) => {
    const icon = index < Math.floor(value) ? StarFilledMinor : StarOutlineMinor;

    return (
      <span key={`rating-${index}`}>
        <Icon source={icon} color="yellow" />
      </span>
    );
  });

  return <span className={styles.Rating}>{ratings}</span>;
}
