import React from "react";

type Props = {
  currentPage: number;
  pagesCount: number;
  setCurrentPage: Function;
};

const Pagination = (props: Props) => {
  let range = [];

  for (let i = 1; i <= props.pagesCount; i++) {
    range.push(i);
  }
  
  return (
    <nav className="my-10 flex justify-center">
      <ul className="flex gap-4">
        <li>
          <button
            disabled={props.currentPage <= 1}
            onClick={() => props.setCurrentPage(props.currentPage - 1)}
            className="btn-outlined"
          >
            Prev
          </button>
        </li>
        {range.map((page) => {
          return (
            <li key={page}>
              <button
                onClick={() => props.setCurrentPage(page)}
                className={
                  props.currentPage == page
                    ? "btn-outlined bg-blue-400 px-2 rounded-lg"
                    : "btn-outlined"
                }
              >
                {page}
              </button>
            </li>
          );
        })}
        <li>
          <button
            disabled={!props.pagesCount || props.currentPage >= props.pagesCount}
            onClick={() => props.setCurrentPage(props.currentPage + 1)}
            className="btn-outlined"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
