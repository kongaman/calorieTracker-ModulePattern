//Storsge Controller
const StorageCtrl = (function() {

    //Public Methods
    return {
        storeItem: function(item) {
            let items;
            //Check if any items in localStorage
            if (localStorage.getItem('items') === null ) {
                items = [];
                //Push new item
                items.push(item);
                //Set localStorage
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                //Get what is already in localStorage
                items = JSON.parse(localStorage.getItem('items'));
                //Push new item
                items.push(item);
                // Set localStorage
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function() {
            let items;
            if (localStorage.getItem('items') === null ) {
                let items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items')); 
            }
            return items;
        }
    }
})();


//--------------------------- Item Controller -----------------------------

const ItemCtrl = (function() {
   // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / State
    const data = {
        //Old version without localStorage 
        // items: [
        //     // { id: 0, name: 'Steak Dinner', calories: 1200},
        //     // { id: 1, name: 'Cookie', calories: 400},
        //     // { id: 2, name: 'Eggs', calories: 300}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem : null,
        totalCalories: 0
    }

    //Public Methods
    return {
        getItems: function() {
            return data.items;
        },
        //Add Item to DataStructure, NOT to UI
        addItem: function(name, calories) {
            let ID;
            //Create id
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            //Calories to number
            calories = parseInt(calories);
            //Create new item
            newItem = new Item(ID, name, calories);
            //Add to items array
            data.items.push(newItem);
            //return for const newItem in AppCtrl.itemAddSubmit
            return newItem;

        },
        getItemById: function(id) {
            let found = null;
            data.items.forEach(function(item) {
                if (item.id === id) {
                    found = item;
                }
            });
            //Return for const itemToEdit = ....
            return found;
        },
        updateItem: function(name, calories) {
           calories = parseInt(calories);
           let found = null;
           //Loop through items and set name and cal of matching item(id) to new values
           data.items.forEach(function(item) {
               if (item.id === data.currentItem.id) {
                   item.name = name;
                   item.calories = calories;
                   found = item;
               }
           });
           //Return for AppCtrl const updatedItem = ...
           return found;
        },
        deleteItem: function(id) {
            //Get ids
            const ids = data.items.map(function(item) {
                return item.id;
            });
            //Get index
            const index = ids.indexOf(id);
            // Remove item
            data.items.splice(index, 1);

        },
        clearAllItems: function() {
            data.items = [];
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getTotalCalories: function() {
            let total = 0;
            //Loop throgh items add up cal
            data.items.forEach(function(item) {
               total += item.calories; 
            });
            data.totalCalories = total;
            //Return for AppCtrl const totalCalories =...
            return data.totalCalories;
        },
        logData: function(){
            return data;
        }
    }

})();



//--------------------------------- UI Controller ----------------------------------
const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    };

    //Public Methods
    return {
        populateItemList: function(items){
            let html = "";
            items.forEach(item => {
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong>
                    <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil-alt"></i>
                    </a>
                </li>
                `;
            });
            //Insert listitems
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            //show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //Create li element, add class, id, html
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `
                <strong>${item.name}: </strong>
                <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil-alt"></i>
                </a>
            `;
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

        },
        updateListItem: function(updatedItem) {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //Turn Nodelist into array
            listItems = Array.from(listItems);
            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                if (itemID === `item-${updatedItem.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                        <strong>${updatedItem.name}: </strong>
                        <em>${updatedItem.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil-alt"></i>
                        </a>
                    `;
                }
            });
        },
        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //Turn Nodelist into Array
            listItems = Array.from(listItems);
            listItems.forEach(function(item) {
                item.remove();
            });
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function() {
            return UISelectors;
        }

    }
   
})();



//-------------------------- App Controller ------------------------------
const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl) {
    //Load Eventlisteners
    const loadEventlisteners = function() {
        //Get UI Selectors from UICtrl
        const UISelectors = UICtrl.getSelectors();

        //Add ItemEvent
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //Disable Submit on Enter-Key
        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 13 || e.which === 13) {
               e.preventDefault();
               return false; 
            }
        }) 

        //Edit-Icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //Backbutton event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        //Deletebutton event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //ClearItems event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    //Add item submit
    const itemAddSubmit = function(e) {
        // Get Form input from UICtrl
        const input = UICtrl.getItemInput();
        //Check for name and calorie input
        if(input.name !== '' && input.calories !== '') {
            //Add item to data structure
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //Add item to UI list
            UICtrl.addListItem(newItem);
            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add total cal to UI
            UICtrl.showTotalCalories(totalCalories);
            //Store in localStorage
            StorageCtrl.storeItem(newItem); 
            //Clear input fields
            UICtrl.clearInput();          
        }
        e.preventDefault();
    }
    //click edit item
    const itemEditClick = function(e) {
        if(e.target.classList.contains('edit-item')){
           //Get list item id
           const listId = e.target.parentNode.parentNode.id;
           //Break into array
           const listIdArr = listId.split('-');
           console.log(listIdArr[1]);
           //Get actual id as number
           const id = parseInt(listIdArr[1]);
           //Get matching item-object
           const itemToEdit = ItemCtrl.getItemById(id);
           //Set found itemToEdit to data.currentItem
           ItemCtrl.setCurrentItem(itemToEdit);
           //Add item to form
           UICtrl.addItemToForm();
        }
        e.preventDefault();
    }
    // Update button event
    const itemUpdateSubmit = function(e) {
        //Get item input
        input = UICtrl.getItemInput();
        //Update Item in data sctructure
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        //Update item in UI
        UICtrl.updateListItem(updatedItem);
        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add total cal to UI
        UICtrl.showTotalCalories(totalCalories);
        //Clear edit State
        UICtrl.clearEditState();
        
        e.preventDefault();
    }
    //Delete Button event
    const itemDeleteSubmit = function(e) {

        //Get current item
        const currentItem = ItemCtrl.getCurrentItem();
        //Delete from datastructure
        ItemCtrl.deleteItem(currentItem.id);
        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);
        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add total cal to UI
        UICtrl.showTotalCalories(totalCalories);
        //Clear edit State
        UICtrl.clearEditState();

        e.preventDefault();
    }
    //Clear All Event
    const clearAllItemsClick = function(e) {
        //Delete all Items from datastructure
        ItemCtrl.clearAllItems();
        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add total cal to UI
        UICtrl.showTotalCalories(totalCalories);
        //Delere all Items from UI
        UICtrl.removeItems();
        //Hide <ul> Element
        UICtrl.hideList();
        
        e.preventDefault();
    }
    

    //Public Methods
    return {
        init: function(){
            //Clear edit state
            UICtrl.clearEditState();
            console.log('Initializing App');
            //Fetch Items from datastructure
            const items = ItemCtrl.getItems();

            //Check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
               //Populate list with items
                UICtrl.populateItemList(items); 
            }
            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add total cal to UI
            UICtrl.showTotalCalories(totalCalories);

            

            //Load Eventlisteners
            loadEventlisteners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

//Initialize App
AppCtrl.init();