const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');
const { expect } = require('chai');

describe(`ShoppingList service Object`, () => {
  let db;
  const shoppingList = [
    {
      id: 1,
      name: 'pancakes',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: false,
      price: (5.5).toFixed(2),
      category: 'Breakfast'
    },
    {
      id: 2,
      name: 'chicken bowl',
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      price: (3.0).toFixed(2),
      checked: false,
      category: 'Lunch'
    },
    {
      id: 3,
      name: 'beef bowl',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      price: (4.0).toFixed(2),
      checked: false,
      category: 'Main'
    }
  ];
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => {
    return db('shopping_list').truncate();
  });

  afterEach(() => {
    return db('shopping_list').truncate();
  });

  after(() => db.destroy());

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db.into('shopping_list').insert(shoppingList);
    });
    it(`getAllItems() resolves all items`, () => {
      return ShoppingListService.getAllItems(db).then((actual) => {
        return expect(actual).to.eql(shoppingList);
      });
    });
    it(`getById() return item with specific id`, () => {
      const itemId = 2;
      const expected = shoppingList.find((item) => item.id === itemId);
      return ShoppingListService.getById(db, itemId).then((actual) => {
        return expect(actual).to.eql(expected);
      });
    });
    it(`updateItem() return the updated item`, () => {
      const itemId = 1;
      const updateItems = {
        name: 'waffle',
        checked: true
      };
      const itemToUpdate = shoppingList.find((item) => item.id === itemId);

      return ShoppingListService.updateItem(db, itemId, updateItems)
        .then(() => ShoppingListService.getById(db, itemId))
        .then((actual) => {
          return expect(actual).to.eql({
            id: itemId,
            ...itemToUpdate,
            ...updateItems
          });
        });
    });

    it(`deleteItem() should not return deleted item`, () => {
      const itemId = 3;
      const expected = shoppingList.filter((item) => item.id !== itemId);

      return ShoppingListService.deleteItem(db, itemId)
        .then(() => ShoppingListService.getAllItems(db))
        .then((actual) => {
          return expect(actual).to.eql(expected);
        });
    });
  });
  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllItems() resolves all items`, () => {
      return ShoppingListService.getAllItems(db).then((actual) => {
        return expect(actual).to.eql([]);
      });
    });
    it(`insertItem() get new Item `, () => {
      const newItem = {
        id: 1,
        name: 'pancakes',
        date_added: new Date('2029-01-22T16:28:32.615Z'),
        checked: true,
        price: (5.5).toFixed(2),
        category: 'Breakfast'
      };
      return ShoppingListService.insertItem(db, newItem).then((actual) => {
        return expect(actual).to.eql(newItem);
      });
    });
  });
});
