
# This is documentation over the queries made to/from the MySQL database.

## Files where MySQL queries occur (Ordered by CRUD)
**INSERT INTO
* functions/api.js
* functions/challenge.js
* funtions/database.js
**SELECT...FROM 
* functions/api.js
* functions/challenge.js
* functions/database.js
* functions/gallery.js
* functions/index.js
**JOIN
* functions/404.js
* functions/gallery.js
* functions/index.js
**UPDATE
* functions/api.js
* functions/database.js
**DELETE FROM
* functions/api.js
* functions/database.js

## Queries organized by tables with the exception of SELECT and JOIN

## JOIN queries
* In 404.js, the function getRandomImages needs to return 'n' random rows from the images table along with the username corresponding to the userid entry of each row.
* In gallery.js, the functions get___Images needs to return 'n' rows from the images table along with the username corresponding to the userid of each row and then structure it further.
	* 'Recent' orders by the rows in descending order by modifiedAt entry and then returns a specific portion of the rows depending on the page (page-number) and count parameters.
	* 'Top' orders by the rows in ascending order by the rating and then returns then returns a specific portion of the rows depending on the page (page-number and count parameters. 
	* 'Featured' retrieves the rows where featured entry is set to 1.
	* 'Random' returns an array of 'n' random rows.
* In index.js, the query is identical to the getFeatureImages function in gallery.js 

## images table
* 

## workspaces table
* Queries to the workspaces table only occur in two files: api.js and database.js
* In database.wsExists, we make a SELECT query for rows where the workspace name and userid matches the checkstring and userid parameter.
* In api.js we have the following functions:
	*   
