// @/src/components/Table/index.jsx
import React, { useState } from "react";
import { Table as TableDaisy } from "react-daisyui";

import useTable from "@/hooks/useTable";
import TableFooter from "./TableFooter";

const Table = ({ data, columns, rowsPerPage }) => {
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(data, page, rowsPerPage);
  // TODO add search
  // TODO add sort
  return (
    <>
      <div className="overflow-x-auto">
        <TableDaisy className="w-full shadow">
          <TableDaisy.Head className="bg-primary">
            {columns.map((column, index) => (
              <span key={index}>{column}</span>
            ))}
          </TableDaisy.Head>
          <TableDaisy.Body>
            {slice.map((el, index) => (
              <TableDaisy.Row hover key={index}>
                {columns.map((column, index) => (
                  <span key={index}>{el[column]}</span>
                ))}
              </TableDaisy.Row>
            ))}
          </TableDaisy.Body>
        </TableDaisy>
        {/* BUG verificar error de tfoot */}
        <TableFooter
          range={range}
          slice={slice}
          setPage={setPage}
          page={page}
        />
      </div>
    </>
  );
};

export default Table;
