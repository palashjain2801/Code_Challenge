import React, { useMemo, useState, useEffect } from "react";
import { useTable, useRowSelect } from "react-table";
import { COLUMNS } from "./columns";
import "./table.css";
import { Checkbox } from "./Checkbox";
import { resolvePlugin } from "@babel/core";
import { sync } from "glob";

export const RowSelection = () => {
  const columns = useMemo(() => COLUMNS, []);
  const [data, setData] = useState([]);
  const [prevState, setState] = React.useState([]);
  const [row, setrow] = useState([])
  const proxyServers = ["https://cors-anywhere.herokuapp.com/","https://crossorigin.me/","http://localhost:8080/"];
  const proxy = proxyServers[0];
  const getfetcheddata = (urlextn, reqvalue,callback) => {
    // console.log("👉👉👉", urlextn)
    let dataFromServer = "";
   fetch(
      proxy + "https://sahmed93846.api-us1.com/" + urlextn,
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Token":
            "bcd062dedabcd0f1ac8a568cdcf58660c44d7e79b91763cc1a5d0c03d52c522d851fceb0"
        }
      }
    )
      .then((response) => {
        if (!response.ok) {
          console.log("Error Fetching DataFrom Link: " + urlextn);
          // console.log(response);
        }else{
          return response.json()
        }
      })
      .then((json) => {
        if (json[reqvalue]) {
          // console.log(json[reqvalue]);

          dataFromServer = json[reqvalue];
          callback(dataFromServer);
        }

      })
      .catch((err) => {
        console.error(err);
      });


  }

  async function constructSingleRow (contactObject,callback) {
    let constructedRow = {};
    Object.keys(contactObject).map((key) => {
      const id = contactObject.id;
      constructedRow[key] = contactObject[key]
      if (key === "links") {
        Object.keys(contactObject[key]).map((linkLabel) => {
          if (linkLabel === "contactTags") {
            const ext = "api/3/contacts/" + id + "/contactTags"
            getfetcheddata(ext, "contactTags",setContactTag)
            function setContactTag(contactTags){
              let constructedTagString = ""
              if (contactTags && contactTags.length > 0) {
                contactTags.forEach((contactTag, index) => {
                  const ext = "api/3/contactTags/" + contactTag.id + "/tag";
                   getfetcheddata(ext, "tag",setTag)
                  function setTag(tag){
                    constructedTagString = constructedTagString + tag.tag;
                    if (index < contactTags.length - 1) { constructedTagString += "," }
                    constructedRow["contactTags"] = String(constructedTagString);

                  }
                  
                });
              }
            }
            
          }
          if (linkLabel === "deals") {
            // console.log(contactObject[key].deals)
            const ext = "api/3/contacts/" + id + "/deals"
            getfetcheddata(ext, "deals",setDeals)
            
            function setDeals(deals){
                
                let constructedDealString = ""
                if (deals && deals.length > 0) {
                  deals.forEach((deal, index) => {
                    constructedDealString = constructedDealString + deal.value + " " + deal.currency;
                    if (index < deals.length - 1)
                      constructedDealString += ",";
                  });
                }
                constructedRow["total"] = String(constructedDealString);
                constructedRow["deals"] = String(deals.length);
            }
            
          }
          if (linkLabel === "geoIps") {
            // console.log(contactObject[key].geoIps)
            const ext = "api/3/contacts/" + id + "/geoIps"
             getfetcheddata(ext, "geoIps",setGeoIp)
            function setGeoIp(geoIps){
              let constructedGeoString = ""
              if (geoIps && geoIps.length > 0) {
                constructedGeoString = ""
                geoIps.forEach(geoIp=>{
                  const ext = "api/3/geoIps/"+geoIp.id+"/geoAddress"
                  getfetcheddata(ext, "geoAddress",setGeoLocation)
                  function setGeoLocation(location){
                      constructedGeoString+=location.city+", "+location.state+", "+location.country+";"
                      constructedRow[linkLabel] = constructedGeoString;
                  }
                })
                
              }
              
            }
             
          }
        })

      }

    })
    // console.log("::::::::::::::::::::::constructedRow");
    // console.log(constructedRow);
    callback(constructedRow);
  }


  const getContactsList = () => {
    
  }
  let contactsList=[]

  useEffect(() => {
    fetch(
      "/api/3/contacts?limit=9",
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
        Object.values(response.contacts).map((rawContactRow) => {
          // contactsList.push(constructSingleRow(rawContactRow))
          constructSingleRow(rawContactRow,constructedSingleRow)
          function constructedSingleRow(singleRowData){
          contactsList.push(singleRowData)
          
          // console.log("Post SET DATA |||||||||||||||||||||||||||||||||||||")
          // console.log(data)
        }
        })

      })
      .catch((err) => {
        console.log("Failed list Contacts");
        console.error(err);
      });
      
      setTimeout(()=>{setData(contactsList)},10000)
      },[]);
  // console.log("👌👌👌👌👌", row)
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

  const firstPageRows = rows.slice(0, 100);

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
