export const COLUMNS = [
  //contact name, contact tags, deals, total value with currency and location,
  {
    Header: "ID",
    accessor: "id"
  },
  {
    Header: "First Name",
    accessor: "firstName"
  },
  {
    Header: "Last Name",
    accessor: "lastName"
  },
  {
    Header: "Contact Tags",
    accessor: "links.contactTags"
  },
  {
    Header: "deals",
    accessor: "links.deals"
  },
  {
    Header: "total",
    accessor: "links.scoreValues"
  },
  {
    Header: "location",
    accessor: "links.geoIps"
  }
];
