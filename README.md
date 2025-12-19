# WingetSearchWebSite

[WingetSearchWebSite](https://polargoose.github.io/WingetSearchWebSite/)

A website to search [winget](https://github.com/microsoft/winget-pkgs) packages.<br>
It is an alternative to:
* https://winget.run/
* https://winstall.app/

# Features
* Static website: no back end, everything is executed on the client side
* Fully hosted on GitHub Pages
* Up to date: the database is updated every 4 hours
* Autocomplete in the search box
* Straightforward interface, no bloat

# Implementation details
`create-winget-packages-sqlite-db` project is run during the build. It clones the [winget-pkgs](https://github.com/microsoft/winget-pkgs) repository and finds the YAML files for the latest versions of each package.
Then it creates an `sqlite3` `fts5` table to search by `PackageId` and `PackageName`.

When the website opens, it loads the whole `sqlite3` database into memory and uses it to provide autocomplete and search results.
