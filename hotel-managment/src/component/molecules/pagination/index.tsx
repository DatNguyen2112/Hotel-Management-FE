import { Pagination } from "react-bootstrap";

export default function PaginationComponent({
  currentPage,
  totalPage,
  setCurrentPage,
}: {
  currentPage: number;
  totalPage: number;
  setCurrentPage: Function;
}) {
  const renderPagination = () => {
    if (currentPage > 0 && currentPage < 5) {
      return (
        <>
          {[...Array(5)].map((_, index) => (
            <Pagination.Item
              key={index}
              active={currentPage === index + 1 ? true : false}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Ellipsis />
          <Pagination.Item onClick={() => setCurrentPage(totalPage)}>
            {totalPage}
          </Pagination.Item>
        </>
      );
    } else if (currentPage > totalPage - 4 && currentPage <= totalPage) {
      return (
        <>
          <Pagination.Item onClick={() => setCurrentPage(1)}>
            {1}
          </Pagination.Item>
          <Pagination.Ellipsis />
          <Pagination.Item
            active={currentPage === totalPage - 4}
            onClick={() => setCurrentPage(totalPage - 4)}
          >
            {totalPage - 4}
          </Pagination.Item>
          <Pagination.Item
            active={currentPage === totalPage - 3}
            onClick={() => setCurrentPage(totalPage - 3)}
          >
            {totalPage - 3}
          </Pagination.Item>
          <Pagination.Item
            active={currentPage === totalPage - 2}
            onClick={() => setCurrentPage(totalPage - 2)}
          >
            {totalPage - 2}
          </Pagination.Item>
          <Pagination.Item
            active={currentPage === totalPage - 1}
            onClick={() => setCurrentPage(totalPage - 1)}
          >
            {totalPage - 1}
          </Pagination.Item>
          <Pagination.Item
            active={currentPage === totalPage}
            onClick={() => setCurrentPage(totalPage)}
          >
            {totalPage}
          </Pagination.Item>
        </>
      );
    } else if (currentPage >= 5 && currentPage <= totalPage - 4) {
      return (
        <>
          <Pagination.Item onClick={() => setCurrentPage(1)}>
            {1}
          </Pagination.Item>
          <Pagination.Ellipsis />
          <Pagination.Item onClick={() => setCurrentPage(currentPage - 2)}>
            {currentPage - 2}
          </Pagination.Item>
          <Pagination.Item onClick={() => setCurrentPage(currentPage - 1)}>
            {currentPage - 1}
          </Pagination.Item>
          <Pagination.Item active>{currentPage}</Pagination.Item>
          <Pagination.Item onClick={() => setCurrentPage(currentPage + 1)}>
            {currentPage + 1}
          </Pagination.Item>
          <Pagination.Item onClick={() => setCurrentPage(currentPage + 2)}>
            {currentPage + 2}
          </Pagination.Item>
          <Pagination.Ellipsis />
          <Pagination.Item onClick={() => setCurrentPage(totalPage)}>
            {totalPage}
          </Pagination.Item>
        </>
      );
    }
  };

  return (
    <Pagination style={{ margin: "20px auto", width: "fit-content" }}>
      {totalPage <= 10 ? (
        <>
          {[...Array(totalPage)].map((_, index) => (
            <Pagination.Item
              key={index}
              active={currentPage === index + 1 ? true : false}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </>
      ) : (
        <>
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          />

          {renderPagination()}

          <Pagination.Next
            disabled={currentPage === totalPage}
            onClick={() => setCurrentPage(currentPage + 1)}
          />
        </>
      )}
    </Pagination>
  );
}
