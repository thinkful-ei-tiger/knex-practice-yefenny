require('dotenv').config();
const knex = require('knex');
const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

function searchByname(searchTerm) {
  knexInstance
    .from('shopping_list')
    .select('*')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then((result) => {
      console.log(result);
    });
}

function paginateShoppingList(pageNumber) {
  const itemsPerPage = 6;
  const offset = itemsPerPage * (pageNumber - 1);

  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(itemsPerPage)
    .offset(offset)
    .then((result) => {
      console.log(result);
    });
}

function getByDaysAgo(daysAgo) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where(
      'dated_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .then((result) => {
      console.log(result);
    });
}

function costByCategory() {
  knexInstance('shopping_list')
    .select('category')
    .sum('price as total_price')
    .groupBy('category')
    .then((result) => {
      console.log(result);
    });
}

searchByname('beef');
paginateShoppingList(2);
getByDaysAgo(10);
costByCategory();
