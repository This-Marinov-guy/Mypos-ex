Mypos-ex project (REACT + SYMFONY 6)
==============================

Installation:
-------------

Install NVM and from it install NodeJs version 20.10.*
NodeJs -v Latest - https://nodejs.org/en/download/

OpenSSL -v Latest - https://www.openssl.org/

NPM 10.2.3

PHP 8.2.12

Composer Install Version 2.6.6 - https://getcomposer.org/download

*Optional install symfony CLI - https://symfony.com/download

Step 1: Install and update composer
------------------------------

Go to api folder from root directory

```cli
cd api
```
```cli
php composer.phar self-update
```
or if you have composer installed globally use this command
```cli
composer self-update
```

Step 2: Install composer dependencies
-------------------------------------
```cli
php composer.phar install
```
or if you have composer installed globally use this command

```cli
composer install
```

Step 3: Generate JWT Token
---------------------------------

```cli
generate jwt token - php bin/console lexik:jwt:generate-keypair
```

or 

```cli
generate jwt token - php bin/console lexik:jwt:generate-keypair --overwritecd 
```

Step 4: Install npm dependencies
---------------------------------

Go to ui folder from root directory

```cli
cd ui
```

```cli
npm install
```

Step 5: Start the program
---------------------------------
Open ui folder from root directory

```cli
npm start
```

Open api folder from root directory

```cli
symfony server:start
```

OR if you do not have symfony CLI

```cli
php bin/console server:run
```

