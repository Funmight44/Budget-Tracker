let form = document.querySelector(".add");
let incomeList = document.querySelector("ul.income-list");
let expensesList = document.querySelector("ul.expenditure-list"); 

let message = document.querySelector(".message");

let balance = document.querySelector("#balance");
let income = document.querySelector("#income");
let expenses = document.querySelector("#expenses");



//if local storage is not empty we are to push the new transaction into the empty array so that they will not disappear when you refresh the page 
let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")): [];


//creating a function for updating statistics 

function updateStatistics(){
    let updateIncome = transactions.filter((transaction) => transaction.amount > 0)
                                    .reduce((total, transaction) => {
                                        return total += transaction.amount
                                    }, 0);

    let updateExpenses = transactions.filter(function(transaction){
        return transaction.amount < 0
    }) 
    .reduce((total, transaction) => {
        return total += Math.abs(transaction.amount) //math.abs isused to remove the minus sign from the value
    }, 0);

    updateBalance = updateIncome - updateExpenses;

    balance.textContent = updateBalance;
    income.textContent = updateIncome;
    expenses.textContent = updateExpenses;
}

updateStatistics();


//create a function for generating template

function generateTemplate(id, source, amount, time){
    return `<li data-id="${id}">
                    <p><Span>${source}</Span> 
                        <span class="time">${time}</span> 
                    </p>
                    #<span>${Math.abs(amount)}</span>
                    <svg class="delete"><use xlink: href ="image/symbol-defs.svg#icon-bin"></use></svg>
                </li>`;
}


function addTransactionDom(id, source, amount, time){
        if(amount > 0){
        incomeList.innerHTML += generateTemplate(id, source, amount, time); //invoking the function ;
        }
        else {
        expensesList.innerHTML += generateTemplate(id, source, amount, time); //invoking the function ;
        }

}


//converting the below to function 

function addTransaction(source, amount){
    let time = new Date(); //store the time in a variable

    let transaction = {
        id: Math.floor(Math.random()*10000), //this is going to generate a random number from 1-10 amd math.floor is going to round it down
        source: source,
        amount: amount,
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`///setting the date and time 
    };

    transactions.push(transaction);
    //store it into the local storage
    localStorage.setItem("transactions", JSON.stringify(transactions));
    addTransactionDom(transaction.id, source, amount, transaction.time);
}




form.addEventListener("submit", function(event){
    event.preventDefault();

    //controlling the users input to prevent empty transaction
    if(form.source.value.trim() === "" || form.amount.value === ""){
        alert("please enter your transaction");
        // message.textContent = "please enter your transaction";
    }

    addTransaction(form.source.value.trim(), Number(form.amount.value));
    updateStatistics();
    form.reset();

   
    
    // let time = new Date(); //store the time in a variable

    // let transaction = {
       //     id: Math.floor(Math.random()*10000), //this is going to generate a random number from 1-10 amd math.floor is going to round it down
    //     source: form.source.value,
    //     amount: form.amount.value,
    //     time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`///setting the daye and time 
    // };

    // transactions.push(transaction);
    // //store it into the local storage
    // localStorage.setItem("transactions", JSON.stringify(transactions));

});

//getting items after refreshing the page  
function getTransaction(){
    transactions.forEach(function(transaction){
        if(transaction.amount > 0){
            incomeList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        } else{
            expensesList.innerHTML += generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        }
    });
}

getTransaction();


// creating a function to delete items from the local storage
function deleteItems(id){
    transactions = transactions.filter((transaction)=> {  //filtering the item that match not match the transaction id
        return transaction.id !== id;
    });
    localStorage.setItem("transactions", JSON.stringify(transactions)); //overwrite the local storage
}

//deleting items from the page 

incomeList.addEventListener("click", function(event){
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();       //this will delete the items from the page
        deleteItems(Number(event.target.parentElement.dataset.id)); //this function is used to delete the items from the local storage
        updateStatistics();
    }
});



expensesList.addEventListener("click", function(event){
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        deleteItems (Number(event.target.parentElement.dataset.id));
        updateStatistics();
    }
});



function initial(){
    getTransaction();
    updateStatistics();
}

initial();







 




