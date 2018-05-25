//Storsge Controller



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
        items: [
            // { id: 0, name: 'Steak Dinner', calories: 1200},
            // { id: 1, name: 'Cookie', calories: 400},
            // { id: 2, name: 'Eggs', calories: 300}
        ],
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
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
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
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
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
const AppCtrl = (function(ItemCtrl, UICtrl) {
    //Load Eventlisteners
    const loadEventlisteners = function() {
        //Get UI Selectors from UICtrl
        const UISelectors = UICtrl.getSelectors();

        //Add ItemEvent
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //Edit-Icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
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
            //Clear input fields
            UICtrl.clearInput();          
        }
        e.preventDefault();
    }
    //update-Item submit
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

})(ItemCtrl, UICtrl);

//Initialize App
AppCtrl.init();