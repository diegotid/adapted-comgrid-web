# Adapted touch-to-speech communication grid panel
Web touch-to-speech grid panel for adapted communication

## Setting-up
1. Clone the repo
2. Set up your [Google APIs](https://cloud.google.com/apis) API key at [user.js line 7](https://github.com/diegotid/adapted-comgrid-web/blob/629c2a6ac15b270025b8c13fe0b0541d50291b60/user.js#L7)
3. Create your programmable search engine at [Google PSE](https://programmablesearchengine.google.com/about/) with a list of the image websites your want the app to search images on
4. Set up your PSE ID at [user.js line 8](https://github.com/diegotid/adapted-comgrid-web/blob/629c2a6ac15b270025b8c13fe0b0541d50291b60/user.js#L8)
5. Set up your preferred voice at [user.js line 4](https://github.com/diegotid/adapted-comgrid-web/blob/629c2a6ac15b270025b8c13fe0b0541d50291b60/user.js#L4)
6. Set up a pre-processor for Sass and JS minifying ([CodeKit](https://codekitapp.com/) or similar) or edit *-min.js and *.scss internal links
7. Set up a webserver host with PHP module and repo's root as document root

## Third parties
Please note the following tools included from 3rd parties and their licenses:
* [ResponsiveVoice JS](http://responsivevoice.org/license)
* [hoverIntent jQuery](http://cherne.net/brian/resources/jquery.hoverIntent.html)
