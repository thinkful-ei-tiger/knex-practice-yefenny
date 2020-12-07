const ShoppingListService = {
  getAllItems(knex) {
    return knex.select('*').from('shopping_list');
  },
  insertItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into('shopping_list')
      .returning('*')
      .then((row) => {
        return row[0];
      });
  },
  getById(knex, id) {
    return knex.select('*').from('shopping_list').where('id', id).first();
  },
  updateItem(knex, itemId, updateItems) {
    return knex('shopping_list').where('id', itemId).update(updateItems);
  },
  deleteItem(knex, id) {
    return knex('shopping_list').where('id', id).delete();
  }
};

module.exports = ShoppingListService;
