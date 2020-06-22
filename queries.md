
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

## Queries organized by tables with the exception of the gallery and challenges feature. 

## gallery feature 
* In 404.js, the function getRandomImages needs to return 'n' random rows from the images table along with the username corresponding to the userid entry of each row.
* In gallery.js, the functions get___Images needs to return 'n' rows from the images table along with the username corresponding to the userid of each row and then structure it further.
	* 'Recent' orders by the rows in descending order by modifiedAt entry and then returns a specific portion of the rows depending on the page (page-number) and count parameters.
	* 'Top' orders by the rows in ascending order by the rating and then returns then returns a specific portion of the rows depending on the page (page-number and count parameters. 
	* 'Featured' retrieves the rows where featured entry is set to 1.
	* 'Random' returns an array of 'n' random rows.
* In index.js, the query is identical to the getFeatureImages function in gallery.js 

## challenges feature
* This relies soley on the challenges and challengecategories tables.
* We only need to look at two files: api.js and challenge.js.

## images table (incomplete)
* Queries to the images tables only occur in the api.js, database.js, and the singel-image.js files.
* When we save an image, we do SELECT queries, we can handlers.saveimage and check if the user already owns an image by the same title: we throw an error or update the code entry for the row that already exists via an UPDATE query. 
* When we view an images page, we call the buildPage function from the single-image.js file, which calls the database.imageInfo we retrieve the corresponding row from the image table.
* Most image queries can be found under the Image section of database.js

## comments table
* To load and save comments the SELECT and INSERT INTO queries are found in the Image Comments sectino of database.js
* To delete comments, we do not delete from the row from the table but rather change the active entry to 0.
* The rest of the comment queries can be found in the Coomment Moderation section of database.js
 
## workspaces table
* Queries to the workspaces table only occur in two files: api.js and database.js
* In database.wsExists, we make a SELECT query for rows where the workspace name and userid matches the checkstring and userid parameter.
* In api.js we have the following functions:
	* in handlers.listws, we perform a SELECT query and return the name entry of each row where the userid matches the loggedin user's id (if unclear consult the code).
	* in handlers.savews, we perform a SELECT query to retrieve the workspaces belonging to the logged-in user to ensure that the  name they want to save by does not already exist in the rows corresponding to their userid and respond according to whether or not they intended their current workspace to be a replacement or to be a new workspace that they owned: throw an error or perform an UPDATE query. Here we also perform an INSERT query. 
	* with handlers.deletews, we perform a DELETE FROM query to remove one of the user's workspaces by name

## users table
* Queries to the users table....

## albums & albumContents

## ratings
