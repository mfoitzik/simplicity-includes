# simplicity-includes README

Simplicity Includes lets you take advantage of design time includes when building static web sites in Visual Studio Code. No build tools or build step is required.

A typical use for Simplicity Includes would be to have header / nav bar and footer code defined in include files so you only need to make changes in one file and all files will be updated.

## Instrunctions

This extension works on all HTML files (files ending in .html) in your project. Special include files need to have their file names begin with 'sinclude_'. For example:
sinclude_header.html
sinclude_footer.html

In the HTML files in which you want to include the contents of the include file you need to place special comment codes in the spot of the file where the include needs to be. The markers consist of the filename wrapped by an HTML comment for the start of the area and the filename preceeded by a forward slash wrapped by an HTML comment to indicate the end of the include area.

For example:
```
<!--sinclude_header.html-->
<!--/sinclude_header.html-->
```