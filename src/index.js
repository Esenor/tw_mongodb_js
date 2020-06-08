const mongoClient = require('mongodb').MongoClient

/**
 * Connect to mongoDB instance and return a Promise
 * @param {string} uri
 * @param {string} user
 * @param {string} password
 */
const connectMongoDB = async (uri, user, password) => new Promise((resolve, reject) => {
  mongoClient.connect(uri, {
    auth: {
      user,
      password
    }
  }, (error, clientConnection) => {
    if (error) {
      reject(error)
    } else {
      resolve(clientConnection)
    }
  })
})

/**
 * Select the database used
 * @param {object} clientConnection
 * @param {string} databaseName
 */
const connectDatabase = (clientConnection, databaseName) => clientConnection.db(databaseName)

/**
 * Select the collection used
 * @param {object} databaseConnection
 * @param {string} collectionName 
 */
const connectCollection = (databaseConnection, collectionName) => databaseConnection.collection(collectionName)

/**
 * Insert a document inside the given collection connection and return a Promise
 * @param {object} collectionConnection
 * @param {object} document
 */
const insertCollection = async (collectionConnection, document) => new Promise((resolve, reject) => {
  collectionConnection.insert(document, (error, response) => {
    if (error) {
      reject(error)
    } else {
      resolve(response)
    }
  })
})

/**
 * Find documents with a query inside the given collection connection and return a Promise
 * @param {object} collectionConnection
 * @param {object} query
 */
const findCollection = async (collectionConnection, query = {}) => new Promise((resolve, reject) => {
  collectionConnection.find(query).toArray((error, response) => {
    if (error) {
      reject(error)
    } else {
      resolve(response)
    }
  })
})

/**
 * Disconnect the mongoDBClient and return a promise
 * @param {object} clientConnection
 */
const disconnectMongoDB = async (clientConnection) => new Promise((resolve, reject) => {
  clientConnection.close((error) => {
    if (error) {
      reject(error)
    } else {
      resolve(true)
    }
  })
})

/**
 * MongoDB Example start function
 */
const app = async () => {
  const uri = 'mongodb://localhost:27017'
  const user = 'demo'
  const password = 'D3m0'
  const dbName = 'efc'
  const collectionName = 'articles'
  const document = {
    label: 'Article A',
    slug: 'article-a',
    description: 'The first article',
    text: '<div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tristique eros quam, et porttitor dui fringilla eu. Aenean eget dapibus magna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque ornare vulputate blandit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum in quam finibus, suscipit felis a, imperdiet risus. Proin quis tellus vel nisl vehicula rhoncus ac at tortor. Donec imperdiet vestibulum dolor, vitae porta velit mattis quis. Mauris libero augue, placerat et diam pharetra, ornare auctor lectus.</p><p>Praesent metus turpis, dignissim eget sollicitudin non, ullamcorper in nunc. Nunc et aliquet mi. Cras convallis pulvinar suscipit. Praesent tristique, massa vel fringilla consectetur, mauris massa pellentesque nibh, ac maximus sem velit convallis felis. Nunc nisl ligula, faucibus et nunc in, porttitor rutrum sem. Proin condimentum lacus sed posuere imperdiet. Duis tempus ut libero id pulvinar.</p><p>Praesent lorem dolor, ornare a sollicitudin at, porttitor at lacus. Ut ultricies orci a odio ullamcorper egestas sed nec ex. Proin venenatis semper eleifend. Nullam congue mi ante, eleifend porta ante consequat et. Etiam felis diam, interdum id malesuada congue, porta ut felis. Integer porttitor at urna vel gravida. Praesent lobortis egestas vehicula. Donec sit amet pulvinar elit, eget tempor nisi. In hac habitasse platea dictumst. In auctor hendrerit vulputate. Aenean eu ornare quam, ut semper massa. Sed ac cursus augue. Sed pulvinar ante a mi sagittis, non finibus eros tempus. Maecenas condimentum lorem a orci maximus porttitor. Aenean congue luctus metus, a vulputate enim ornare id. Donec malesuada tincidunt blandit.</p><p>Sed et enim sit amet nulla lobortis aliquam eu sed elit. In ac enim at odio accumsan aliquam sed sodales massa. Aliquam bibendum et ipsum eleifend molestie. Nullam viverra gravida orci. In nec nisl in lorem bibendum pulvinar. Nulla viverra ac mi id pharetra. Etiam tortor odio, bibendum a efficitur et, rutrum et tortor. Nunc condimentum elementum risus eget luctus. Mauris blandit nec arcu ac dignissim. Vestibulum blandit ligula quis dolor vulputate condimentum. Curabitur lacinia odio sed commodo scelerisque. Mauris a ex velit.</p><p>Pellentesque quis leo quis lectus ultrices aliquam vitae quis augue. Mauris semper convallis tellus, at iaculis enim rhoncus eget. Ut elementum ante a justo vestibulum malesuada. Nulla magna arcu, aliquet at semper at, lobortis in mi. Proin pharetra leo ac nunc elementum, a congue est pharetra. Donec eget velit sed magna faucibus viverra at vel lacus. Nunc nulla risus, tincidunt vitae facilisis ut, molestie quis felis. Cras pharetra tellus dui, sed finibus eros rhoncus non. Quisque dapibus porttitor lectus, id hendrerit velit. In erat leo, faucibus ut varius a, semper sed risus. Phasellus tristique iaculis luctus. Donec quis lacus vel leo lacinia eleifend sodales et nisi. Sed a semper libero.</p></div>',
    tags: ['text', 'article', 'node']
  }

  console.log('Connecting the MongoDB instance')
  const mongoDBClient = await connectMongoDB(uri, user, password)
  console.log('Connection to mongoDB established')
  console.log(`Connecting the ${dbName} database`)
  const databaseConnection = connectDatabase(mongoDBClient, dbName)
  console.log(`Connecting the ${collectionName} collection`)
  const collectionConnection = connectCollection(databaseConnection, collectionName)
  console.log('Write a document inside the collection')
  await insertCollection(collectionConnection, document)
  console.log('Find all documents inside the collection', await findCollection(collectionConnection))
  console.log('Disconnecting the MongoDB instance')
  await disconnectMongoDB(mongoDBClient)
  console.log('Disconnected')
}

app()