# tableGater

Welcome to the `tableGator` README. Here we will show you how to run this app as well as explain its purpose and usage. Lastly, we will detail future releases, hopes and dreams for this application.

## Purpose

This application largely mimics restaurant table management software like Resy and TableIsReady. `This version is intended to be hooked up to a restaurant's website` where guests can book at their convenience.

The focus is on organizing and automating some of this process from the restaurant's perspective. Empoyees have access to all the information to smoothly conduct a serving period.

## Getting started

1. Clone this repository (only this branch)

   ```bash
   git clone https://github.com/nummyrice/where-is-my-table
   ```

2. Install dependencies

      ```bash
      pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt
      ```

3. Create a **.env** file based on the example with proper settings for your
   development environment
4. Setup your PostgreSQL user, password and database and make sure it matches your **.env** file

5. Get into your pipenv, migrate your database, seed your database, and run your flask app

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

6. To run the React App in development, checkout the [README](./react-app/README.md) inside the `react-app` directory.

# Using the App
## Landing

1. With the app up and running you should see the landing page:

2. This application is designed with two distinct roles: guest and establishment. There is a demo button for each on the top nav bar.

3. Feel free to create your own guest using the drop down menu to the top right.

4. Browse available tables, adjust the date, book a table.

## Establishment

1. Access the employee view with "Demo Restaurant"

2. Table availabilty is listed. Select a cell to book the table

3. view and edit your reservation by hovering your mouse over it

4. Adjust the date using the date bar

5. Book a reservation for a future date using the left panel

6. Add a guest to the waitlist.


# What's cool?

1. Learning how to best determine bookable times was tricky. I eventually determined that it had to be done on the server.
```js
def get_availability(client_datetime):
```
* This algorithm does some fancy date generation and compares it to reservations from the database, `all with just one provided date`.

* I'm excited to expand this algorithm into one or more classes that will allow for more customization as well as reduce processing time.

2. The data was then modeled on the frontend.

```
const resScheduleModel = hourColumns.map
```
* This algorithm takes a modeled hourly table and assigns data generated from the server to each

* this is the model for schedule data throughout the app
