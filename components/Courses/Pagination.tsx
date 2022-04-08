import ReactPaginate from "react-paginate";

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
      containerClassName="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
      pageLinkClassName="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
      activeLinkClassName="z-10 bg-crimson-50 hover:bg-crimson-50 border-crimson-500 text-crimson-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
      nextLinkClassName="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
      previousLinkClassName="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
      breakLinkClassName="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
      disabledLinkClassName="text-gray-400 hover:bg-white hover:text-gray-400 cursor-default"
    />
  );
}

export default Pagination;
