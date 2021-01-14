# Active Campaign

Create an app that fetches a list of contacts and
displays them in a table according to our style guide
## Installation

Use the package manager [node](https://nodejs.org/en/) to install foobar.

```bash
git clone https://github.com/palashjain2801/Code_Challenge
cd Code_Challenge
npm install
npm start
```

## UN-Restriction

```text
I am using cors-anywhere, which enables API to perform cross-origin requests to anywhere.
> By default code is using URL (https://cors-anywhere.herokuapp.com/). This blocks API calls for 60 min after 60 fetch requests.
> I have also provided an alternative method in code (No Restriction with API Call). 
  - install : npm install cors-anywhere
  - GoTO : cd cors-anywhere 
  - Run : npm start
  - Goto:  Code_challange -> src -> RowSelector.js and modify   const proxy = proxyServers[2];

```
## Code Available and Details 
CodeSanbox :  https://codesandbox.io/s/coding-challenge-m0rw5

NOTE: Code might not run in sandbox due to Blocked API Call due to too many request send to https://cors-anywhere.herokuapp.com/. Kindly run code in local machine.

## Tech Used


* [ReactJS]
* [node.js]



## Images of Output:
#### This Display fetched data from Active Campaign API into Tabular format
* Empty cell indicates , No Data available in API

![Table](https://github.com/palashjain2801/Code_Challenge/blob/main/Images/1.PNG)

#### This Display how checked row data is fetched and displayed at bottom of screen
* Only one Row selected therefore data of only one row will be displayed.

![Table](https://github.com/palashjain2801/Code_Challenge/blob/main/Images/2.PNG)
