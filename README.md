# platform-core

Mobile-Age plarform-core is developed using the following tools:

  - [MySQL](https://www.mysql.com/)
  - [AngularJS](https://angularjs.org/)
  - [Express](http://expressjs.com/)
  - [Node.js](https://nodejs.org/en/)

As a CSS framework is using [Bootstrap](http://getbootstrap.com/) and as a template language [Jade](http://jade-lang.com/).


## General guidelines

### Setup

  1. Install [nvm](https://github.com/creationix/nvm) so that playing with node versions is easier
  2. Install node 5.8.0 through nvm
    - `nvm install 5.8.0`
  3. Do `npm install` in order to install node packages.
  4. Do `bower install` in order to install client dependencies.
  5. Run the application with `npm-start`.
  6. Make sure that you have a running MySQL server.
      To install MySQL, run the command `sudo apt-get install mysql-server` in your terminal prompt.

### Directory Structure

  - bin: binaries
  - config: configuration files.
  - public: public directory.
  - routes: contains API routes and routes for rendering the jade templates.
  - models: contains a series of functions used by routes.
  - views: jade template files.


### Configuration

  Under /config directory the following files have to be placed.

    - `general_config.js` - This file has to export the following variables:
        appsVM: The url from which the applications module is reachable (e.g. exports.appsVM = `http://localhost:1111`)
        repoVM: The url from which the applications-repository module is reachable (e.g. `exports.repoVM = http://localhost:1112`)
        ports_lower_limit: The lower limit of port numbers to be exposed by the applications module. (e.g. `exports.ports_lower_limit = 6900`)
        ports_upper_limit: The upper limit of port numbers to be exposed by the applications module. (e.g. `exports.ports_upper_limit = 7000`)

    - `db-credentials.js` - This file has to export the following variables:
        host: The IP Address of the MySQL database (e.g. `exports.host = 172.17.0.2`)
        user: The username used to establish connection into the MySQL database (e.g. `exports.user = root`)
        password: The password of the user used to establish connection into the MySQL database (e.g. `exports.password = my-secret-password`)
        db: The database to be used. If you use the schema provided, please set `exports.db = oscpsep_functional_db`.
