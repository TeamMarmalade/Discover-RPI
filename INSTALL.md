# Setup the Database
1. Create a Mongo database in Mongo Atlas.
2. Create a "dorms" collection.
3. Import ```dorms.json``` (from the repository) into the "dorms" collection using the web interface.
4. Create a "reviews" collection.
5. Import ```reviews.json``` (from the repository) into the "reviews" collection using the web interface.

# Installing the App
1. Clone the repository (using ```git clone```)
2. ```cd``` into the repository and run ```npm i```.
3. ```cd``` into the root of the Angular directory (```frontend```) in the repository and run ```npm i```.

# Running the App
In the ```frontend``` directory of the repository in one terminal run: 
```
ng build --watch --output-path ../backend/dist/frontend
```

In the ```backend``` directory of the repository in another terminal run:
```
npm run start
```
