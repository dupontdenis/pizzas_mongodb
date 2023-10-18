const { MongoClient } = require("mongodb");
require("dotenv").config();

async function run() {
  const uri = process.env.MONGODB_URI;

  // The MongoClient is the object that references the connection to our
  // datastore (Atlas, for example)
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  // The connect() method does not attempt a connection; instead it instructs
  // the driver to connect using the settings provided when a connection
  // is required.
  await client.connect();

  // Provide the name of the database and collection you want to use.
  // If the database and/or collection do not exist, the driver and Atlas
  // will create them automatically when you first write data.
  const dbName = "PIZZASJS";
  const collectionName = "PIZZAS";

  // Create references to the database and collection in order to run
  // operations on them.
  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  /*
   *  *** INSERT DOCUMENTS ***
   *
   * You can insert individual documents using collection.insert().
   * In this example, we're going to create four documents and then
   * insert them all in one call with collection.insertMany().
   */

  const pizzas = [
    {
      name: "queen",
      toppings: ["chicken", "mushroom", "tomato", "cheese"],
      price: 10,
    },

    { name: "cheese", toppings: ["cheese", "tomato"], price: 4 },

    {
      name: "oriental",
      toppings: ["tomato", "sausage", "mushroom", "pepper"],
      price: 12,
    },

    { name: "royal", toppings: ["tomato", "garlic"], price: 5 },
  ];

  // try {
  //   const insertManyResult = await collection.insertMany(pizzas);
  //   console.log(
  //     `${insertManyResult.insertedCount} documents successfully inserted.\n`
  //   );
  // } catch (err) {
  //   console.error(
  //     `Something went wrong trying to insert the new documents: ${err}\n`
  //   );
  // }

  /*
   * *** FIND DOCUMENTS ***
   *
   * Now that we have data in Atlas, we can read it. To retrieve all of
   * the data in a collection, we call Find() with an empty filter.
   * The Builders class is very helpful when building complex
   * filters, and is used here to show its most basic use.
   */

  const findQuery = { price: { $lt: 10 } };
  console.log(`********************** price: { $lt: 10 }`);
  try {
    const cursor = await collection.find(findQuery).sort({ name: 1 });
    await cursor.forEach((pizza) => {
      console.log(
        `${pizza.name} has ${pizza.toppings.length} toppings and costs ${pizza.price}$ to make.\n`
      );
    });
  } catch (err) {
    console.error(
      `Something went wrong trying to find the documents: ${err}\n`
    );
  }

  /*
   * *** FIND DOCUMENTS ***
   *
   */
  const findToppins = { toppings: { $in: ["cheese", "pepper"] } };
  console.log(`********************** toppings: { $in: ["cheese", "pepper"] `);
  try {
    const cursor = await collection.find(findToppins).sort({ name: 1 });
    await cursor.forEach((pizza) => {
      console.log(`${pizza.name} has "cheese" or "pepper" toppings \n`);
    });
  } catch (err) {
    console.error(
      `Something went wrong trying to find the documents: ${err}\n`
    );
  }

  // We can also find a single document. Let's find the first document
  // that has the string "cheese" in the toppings list.
  const findOneQuery = { toppings: "tomato", price: { $lt: 3 } };
  console.log(`********************** toppings: "tomato", price: { $lt: 3 } `);
  try {
    const findOneResult = await collection.findOne(findOneQuery);
    if (findOneResult === null) {
      console.log(
        "Couldn't find any pizzas that contain 'tomato' as an ingredient and price less than 3$.\n"
      );
    } else {
      console.log(
        `Found a pizza with 'tomato' as an ingredient and price less than 3$:\n${JSON.stringify(
          findOneResult
        )}\n`
      );
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }

  // Make sure to call close() on your client to perform cleanup operations
  await client.close();
}
run().catch(console.dir);
