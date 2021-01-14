import React, { useMemo, useState, useEffect } from "react";
import { useTable, useRowSelect } from "react-table";
import { COLUMNS } from "./columns";
import "./table.css";
import { Checkbox } from "./Checkbox";

export const RowSelection = () => {
  const columns = useMemo(() => COLUMNS, []);
  const [data, setData] = useState([]);
  const fetchDataFromLink = (link) => {
    //TODO fetch link, should be an Array
    //return array of string

    //https://cors-anywhere.herokuapp.com/https://sahmed93846.api-us1.com/api/3/contacts/193/contactTags
    fetch("https://cors-anywhere.herokuapp.com/" + link, {
      headers: {
        "Content-Type": "application/json",
        "Api-Token":
          "bcd062dedabcd0f1ac8a568cdcf58660c44d7e79b91763cc1a5d0c03d52c522d851fceb0"
      }
    })
      .then((res) => res.json())
      .then((response) => {
        console.log("🔥🔥🔥🔥", response);
        return response;
        //setData(response.contacts);
      })
      .catch((err) => {
        console.error(err);
      });
  };


  const preprocessData = (data) => {
    let processedData = [];
    console.log("processing data");
    data.forEach((element) => {
      console.log(element);
      processedData.push(preprocessRow(element));
    });
    return processedData;
  };
  const preprocessRow = (row) => {
    let newData = {};
    let keysToBeFetched = ["contactTags", "deals", "geoIps"];
    Object.keys(row).map((key) => {
      // console.log("🚀🚀🚀🚀", key);
      if (key === "links") {
        newData[key] = {};
        Object.keys(row[key]).map((linkName) => {
          //
          if (keysToBeFetched.includes(linkName)) {
            let dataFromLink = fetchDataFromLink(row[key][linkName]);
            console.log("Data From Link " + dataFromLink);
            newData[key][linkName] = dataFromLink;
          } else {
            newData[key][linkName] = row[key][linkName];
          }
        });
      } else {
        newData[key] = row[key];
      }
    });

    return newData;
  };



  

  useEffect(() => {
    fetch(
      "/api/3/contacts",
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Token":
            "bcd062dedabcd0f1ac8a568cdcf58660c44d7e79b91763cc1a5d0c03d52c522d851fceb0"
        }
      }
    )
      .then((res) => res.json())
      .then((response) => {
        console.log(response.contacts);
        // let newData = preprocessData(response.contacts);
        // console.log("Processed DATA:" + newData);
        setData(response.contacts);
        // console.log("🔥🔥🔥", data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows
  } = useTable(
    {
      columns,
      data
    },
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <Checkbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => <Checkbox {...row.getToggleRowSelectedProps()} />
        },
        ...columns
      ]);
    }
  );

  const firstPageRows = rows.slice(0, 10);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <pre>
        <code>
          {JSON.stringify(
            {
              selectedFlatRows: selectedFlatRows.map((row) => row.original)
            },
            null,
            2
          )}
        </code>
      </pre>
    </>
  );
};
