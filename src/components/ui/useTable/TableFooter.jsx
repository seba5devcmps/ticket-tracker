import React, { useEffect } from "react";
import { Button, Table } from "react-daisyui";

const TableFooter = ({ range, setPage, page, slice }) => {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);
  return (
    <div className="flex justify-center rounded-b-lg bg-base-200 py-2 shadow">
      {range.map((el, index) => (
        <Button
          type="button"
          key={index}
          color={page === el ? "primary" : "btn btn-active btn-ghost"}
          className="mx-1"
          onClick={() => setPage(el)}
        >
          {el}
        </Button>
      ))}
    </div>
  );
};

export default TableFooter;
