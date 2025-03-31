## Installation Instructions

### Deploy Frontend Files
- Copy the contents of `Angular/dist/ln-dpt/browser` into your CSP folder (e.g., `C:\InterSystems\HealthShareDemo\CSP\user\LeadNorth`).

### Import Classes
- Import the class definitions by loading the file `IRIS/LEADNorth.xml` into your InterSystems IRIS instance.

### Configure Web Applications

#### CSP/ZEN Web Application(see https://github.com/LEADNorthLLC/CCDProfiler/blob/main/IRIS/APIWebService.png)
- **Name:** `/csp/LeadNorth`
- **Description:** `LEAD North CCD Profiling Tool`
- **Settings to configure:**
  - **Enable Application:** Checked
  - **Inbound Web Services:** Enabled
  - Under **Security Settings**, select your desired authentication methods
  - Under **CSP Files Physical Path**, specify the path to your installed `index.html` file (from step 1)

#### REST Web Application(see https://github.com/LEADNorthLLC/CCDProfiler/blob/main/IRIS/WebService.png)
- **Name:** `/csp/LeadNorth/api`
- **Description:** `LEAD North CCD Profiling Tool APIs`
- **Dispatch class:** `LEADNorth.REST.Handler`


## Road Map

### Publishing
#### Before Intersystems READY 2025, LEAD North plans to publish the profiling tool to the Open Exchange
#### LEAD North will also publish the profiler to the ZPM/IPM registry following this procedure - https://community.intersystems.com/post/zpm-simple-implementation-cookbook

### Current To-Do's
- **Replace favicon**
- **Refactor code to follow best practices**
- **Implement security measures**
- **Publish documentation**
- **Add to ZPM registry**

### Future Features
#### Confirmed Additions:
- **Security Features**
- **Import/Export Options:** The idea is to allow users to modify the sections that are profiled and/or exported, providing a more dynamic approach to data profiling.
#### Proposed Additions:
- **Option to de-identify data:** The proposal is to add an option that allows users to import and export data, omitting fields that may contain PHI. With this, we must consider that it cannot be a 100% guarantee and users must ensure they are doing their due diligence.
- **Ability to add on to what is profiled:** This would allow users to add a property to one of the 20 sections or create a new section from the frontend. In order to add a property, users would enter the property name, data type, and Xpath and it would update the relevant classes. Alternatively, users could create new objects altogether for profiling.
- **Data metrics:** Provide visibility into the size of the data on disk.
- **SDA Mappings:** Provide the mappings of the xpaths to SDA
