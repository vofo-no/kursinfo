import ReactPaginate from "react-paginate";

import styles from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  gotoPage: (arg0: number) => void;
  pageIndex: number;
}

function Pagination({
  pageCount,
  gotoPage,
  pageIndex,
}: PaginationProps): JSX.Element {
  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={3}
      marginPagesDisplayed={2}
      onPageChange={({ selected }) => gotoPage(selected)}
      forcePage={pageIndex}
      nextLabel="🡪"
      previousLabel="🡨"
      ariaLabelBuilder={(pageIndex, selected) =>
        `${selected ? "Gjeldende side, g" : "G"}å til side ${pageIndex}`
      }
      nextAriaLabel="Neste side"
      previousAriaLabel="Forrige side"
      containerClassName={styles.container}
      activeClassName={styles.active}
    />
  );
}

export default Pagination;
