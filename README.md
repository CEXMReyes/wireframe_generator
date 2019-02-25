# Wireframe Generator 3.x - 4.x

A collection of scripts to generate 3.x - 4.x wireframing files. A proper UI will come eventually

## Getting Started

### Prerequisites

Make sure to install all packages in the package.json.


Make sure a folder named **output** exists in the root directory, this is where the generated files will be stored.

### Installing

Clone repo, then run npm install.

## Using the Scripts

### sort-spec.js

Run **node sort-spec.js** [formName, customFlag]

Script will run both **generate-fields.js** and **generate-form.js** from a single field spec. You can specify the form/entity name and denote whether you are generating a case tab, a custom child doc, or specifying the filter field.

**Example:**
  * **node sort-spec.js case-overview**
  * **node sort-spec.js case-resolution tab**
  * **node sort-spec.js party-details**
  * **node sort-spec.js interview-details custom**
  * **node sort-spec.js case-overview filter department**

**Generates:**
  * **wireframe for case with case overview form**
  * **wireframe for case with case resolution form and tab**
  * **wireframe for party with party details form**
  * **wireframe for interview child doc with views, model, and form**
  * **wireframe for case with case overview form with filter field set to department (Escalations, Notifications, ACL, etc.)**

Using the scripts below, can generate all files for a wireframe based on a formatted field spec. Paste in field spec in **spec.txt**. Columns are separated by TABS, similar to when pasting from an Excel file into a text editor. The **&#35;** character can be used to mark the start of a section or denote a picklist which is dependant on another field. Format is as follows:

Field Name | Type | Validation | Display Rules | TypeOptions (Picklists, Radios)
--- | --- | --- | --- | --- 
Department | Dropdown | *
Case Type | Dropdown | * | | &#35; Department
Sub Case Type | Dropdown | | | &#35; Department, Case Type
Initial Contact Date | Date Picker | *
Incident Date | Date Picker | *
Incident Location | Dropdown
Reporting Channel | Multipick | * | | Email, Phone, Web Form, In Person, Social Media, Other
Urgency | Dropdown | * | | Low, Medium, High
&#35;&#35;&#35; Title IX Information
Primary Basis of Discrimination | Dropdown | | Department = Title IX | Age, Citizen Status, Disability, Gender, Gender Identity, National Origin, Pregnancy, Race, Religion, Sex, Sexual Orientation, Veteran status, Ethnicity, Medical History, Other
Secondary Basis of Discrimination | Dropdown | | Department = Title IX | Age, Citizen Status, Disability, Gender, Gender Identity, National Origin, Pregnancy, Race, Religion, Sex, Sexual Orientation, Veteran status, Ethnicity, Medical History, Other
Clery Report Filed? | Radio Button | | Department = Title IX	Yes, No
&#35;&#35;


### generate-fields.js

Run **node generate-fields.js** [optionalName, customFlag]

Script will default to creating a case entity. In order to specify otherwise, use arguments:

**Example:**
  * **node generate-fields.js party**
  * **node generate-fields.js interview custom**

**Generates:**
  * **index.js**
  * **options.picklist.js**
  * **Any picklist.json**

Supports creation of child docs and custom child docs. Creating custom child docs will generate the appropriate related files.

Paste input in the **fields.txt**. Columns are separated by TABS, similar to when pasting from an Excel file into a text editor. Format is as follows:

Field Name | Type | TypeOptions (Picklists, Radios)
--- | --- | ---
Counsel Name | Text Box
Assistance Program | Radio Button | Yes, No
Date Amber Alert Filed | Date Picker
Alcohol Involved | Radio Button | Yes, No, Unknown
Drugs Involved | Radio Button | Yes, No, Unknown
Union Involved | Dropdown | Union A, Union B, Union C
Grievance Type | Dropdown | Contract, Overtime, Workplace Conditions, Discrimination, Conflict, Other
Other Grievance Type | Text Box


### generate-forms.js

Run **node generate-form.js** [optionalName]

Script will default to creating a case-capture form. In order to specify otherwise, use arguments:

**Example:**
  * **node generate-form.js case-overview**
  * **node generate-form.js party-details**

**Generates:**
  * **form.js**
  * **rules.js**
  * **validation.js**

Supports creation of sections, using **###** as a flag dentote the start of the section and **##** to denote the end.

Paste input in the **form.txt** file. Columns are separated by TABS, similar to when pasting from an Excel file into a text editor. Format is as follows:

Field Name | Validation | Display Rules
--- | --- | ---
Counsel Name | Legal Involved = Yes | Legal Involved = Yes
Assistance Program | Case Type = Alcohol/Drugs OR Substance Abuse | Case Type = Alcohol/Drugs OR Substance Abuse
Date Amber Alert Filed | Amber Alert Filed = Yes | Amber Alert Filed = Yes
Alcohol Involved | Case Type = Assault | Case Type = Assault
Drugs Involved | Case Type = Assault | Case Type = Assault
Union Involved | Sub Case Type = Union | Case Type = Grievance &#124;&#124; Sub Case Type = Union
Grievance Type |  | Case Type = Grievance &#124;&#124; Sub Case Type = Union
Other Grievance Type  | Grievance Type = Other | Grievance Type = Other


### generate-picklist.js

Run **node generate-picklist.js**

**Generates:**
  * **parentLists.json**
  * **childLists.json**

The script works recursively, so it should be able to handle a string of ancestry parents.

Paste input in the **picklist.txt** file. Columns are separated by TABS, similar to when pasting from an Excel file into a text editor. Format is as follows:

Department | Case Type | Sub Case Type
--- | --- | ---
Complaints | Admissions
Complaints | Cafeteria | Food Quality, Cleanliness, Staff, Allergies, Religious Accomodation, Selection, Temperature, Wait Time
Complaints | Campus Programs
Complaints | Financial Aid
Complaints | Parking Administration
Complaints | Student Life | Accomodation, Extra Curricular, Athletics, Campus Store, Bullying, Discrimination
Employee Relations | Grievance
Employee Relations | Attendance | Late Arrivals, Unscheduled Absense
Employee Relations | Compensation
Employee Relations | Discrimination | Age, Citizen Status, Disability, Gender, Gender Identity, National Origin, Pregnancy, Race, Religion, Sex, Sexual Orientation, Veteran status, Ethnicity, Medical History, Other


### clear-files.js

Run **node clear-files.js**

This script will delete all files in the **output** folder.
