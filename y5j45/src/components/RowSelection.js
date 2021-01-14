import React, { useMemo, useState, useEffect } from "react";
import { useTable, useRowSelect } from "react-table";
import { COLUMNS } from "./columns";
import "./table.css";
import { Checkbox } from "./Checkbox";

export const RowSelection = () => {
  const columns = useMemo(() => COLUMNS, []);
  const [data, setData] = useState([]);
  const [row,setrow]=useState([])
  

const getfetcheddata = (urlextn, reqvalue) =>{
  console.log("👉👉👉",urlextn)
  fetch(
    "https://cors-anywhere.herokuapp.com/https://sahmed93846.api-us1.com/" + urlextn,
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
      console.log(response.reqvalue);

      })
    .catch((err) => {
      console.error(err);
    });

}

  const getData = (fordataurl) =>{
    Object.keys(fordataurl).map((key)=>{
      const ids = fordataurl.id;
      if (key === "firstName"){
        console.log("1️⃣",fordataurl.firstName);
      }
      if (key === "lastName"){
        console.log("🌜",fordataurl.lastName);
      }
      if (key === "id"){
        console.log("🆔",fordataurl.id);
      }
      if (key === "links"){
        console.log(Object.keys(fordataurl[key]))
        Object.keys(fordataurl[key]).map((linkkey)=>{
          if (linkkey==="contactTags"){
            console.log(fordataurl[key].contactTags)
          }

          if (linkkey==="deals"){
            console.log(fordataurl[key].deals)
            const ext = "api/3/deals/" + ids
            getfetcheddata(ext,"value")
          }
          if (linkkey==="geoIps"){
            console.log(fordataurl[key].geoIps)
          }
        })


      }

    })


  }
 

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

        console.log("🔥🔥🔥", typeof(response.contacts));
        Object.values(response.contacts).map((linkname)=>{
            // console.log(linkname)
            getData(linkname)


        })
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  console.log("👌👌👌👌👌",row)
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
