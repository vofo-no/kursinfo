import Container from "components/Containers/Container";
import WhiteBox from "components/Containers/WhiteBox";
import PageHeading from "components/PageHeading";

export function StudieforbundLoading() {
  return (
    <>
      <WhiteBox noPadding>
        <div
          className="overflow-x-auto print:overflow-x-visible relative animate-pulse"
          role="status"
        >
          <Container>
            <PageHeading>
              <div className="h-10 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-2.5"></div>
            </PageHeading>
            <div className="flex flex-row gap-2 my-3">
              <div className="h-7 w-[72px] bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
              <div className="h-7 w-[200px] bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
              <div className="h-7 w-[120px] bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>

            <span className="sr-only">Laster...</span>
          </Container>
        </div>
      </WhiteBox>
      <div className="text-right ml-auto mt-2 mr-2 text-xs">
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      </div>
    </>
  );
}
