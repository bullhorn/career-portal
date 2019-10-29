Bullhorn Career Portal V3+ brings additional options to augment the information presented on your jobs. 

## Job Chips

![release page](assets/media/jobChips.png)

You are able to modify the "chips" that appear on your jobs. These chips are intended to show short scannable information snippets on your jobs. The information can include but is not limited to: salary amount, dates, job category, job types, and more. 

To modify what is displayed on the chips, you must change the `jobInfoChips` configuration setting.  This can be a string field name, or a object of field name and type, an example is provided below.

``` 
"jobInfoChips": [
  "employmentType",
  {
    "type": "mediumDate",
    "field": "dateLastPublished"
  }
],
```

This example provides the field of employmentType, which will render as the plain text value, and dateLastPublished which will render as a string date instead of an epoch string.   If the field isn't enabled by default, you may need to contact Bullhorn Support to expose it in the public API.

The available field types can be seen in the table below.

|Type|Description|
|-|-|
|string (default)|displays a field's contents|
|mediumDate| parses date into a human readable format ex (Jun 15, 2015)|
|dateTime| parses date and time into a human readable format ex (Jun 15, 2015, 9:03:01 AM)|
|USD|Renders money in US dollar format|
|GBP|Renders money in Pound sterling format|
|EUR|Renders money in Euro format|

## How it works.

On the job details page and on the job list, we address the different formats using [Angular Pipes](https://angular.io/guide/pipes).  If you would like to see additional rendering formats, please submit an issue or a pull request
