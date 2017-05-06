# Udacity Project 5: Neighborhood Map

This map shows the museums at New York City's Museum Mile.
Information about each museum includes address, hours, website.
There are also excerpt and link to Wikipedia article.

## Local Deployment Instruction
1. Download or clone this repository.
2. Open index.html in your favorite web browser.

## Features
- Filter the list of muesums using the search bar
- Open small info window by clicking on either the museum list or marker
- Open modal with more information by clicking the `More Details` button
- Error Handling:
  - If Google Map API failed to load, the modal will open with message
  - If Wikipedia API failed, the app will not include Wiki resourses.

## Resources
- [JQuery](http://jquery.com/)
- [Knockout.js](http://knockoutjs.com/)
- [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/)
- [WikiMedia API](https://www.mediawiki.org/wiki/API:Main_page)
- [InfoWindow Binding using Template](http://jsfiddle.net/SittingFox/nr8tr5oo/)
