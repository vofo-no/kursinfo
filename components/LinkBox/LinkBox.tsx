import { Box } from "@vofo-no/design";
import Link from "next/link";
import { FC } from "react";

import styles from "./LinkBox.module.css";

interface PropTypes {
  url: string;
  title: string;
}

export const LinkBox: FC<PropTypes> = ({ url, title }) => (
  <Box key={url} variant="light" boxShadow="small">
    <Link href={url}>
      <a className={styles.gridItem}>
        <span>{title}</span>
      </a>
    </Link>
  </Box>
);
