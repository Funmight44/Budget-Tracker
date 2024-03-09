let form = document.querySelector(".add");
let incomeList = document.querySelector("ul.income-list");
let expenditure = document.querySelector("ul.expenditure-list");

let balance = document.querySelector("#balance");
let income = document.querySelector("#income");
let expenses = document.querySelector("#expenses");

let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")): []; 



//to retained the items on the list after refreshing the page 
function getItems(){
    transactions.forEach(transaction =>{
        if(transaction.amount > 0){
            incomeList.innerHTML += transTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        }else{
            expenditure.innerHTML += transTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        }
    });
}

getItems();



//calculating the income, expenses, balance and update the result
function updateStat(){
    let updateIncome = transactions.filter((transaction) =>{
        return transaction.amount > 0
    }) .reduce((total, transaction) =>{
        return total += transaction.amount
    }, 0);

    let updateExpenses = transactions.filter((transaction) => {
        return transaction.amount < 0
    }) .reduce((total, transaction)=>{
        return total += Math.abs(transaction.amount)
    }, 0);

    updateBalance = updateIncome - updateExpenses;
    balance.textContent = updateBalance;
    income.textContent = updateIncome;
    expenses.textContent = updateExpenses;
}

updateStat();




form.addEventListener("submit", function(event){
    event.preventDefault();
    if(form.source.value.trim() == '' || form.amount.value.trim() === ''){
        alert("please enter your transaction");
    }
    addTransaction(form.source.value.trim(), Number(form.amount.value.trim())); //convert amount value to number not string
    updateStat();
    form.reset();  //to reset input field 
});

//adding transactions

function addTransaction(source, amount){
    let time = new Date;
    let transaction = {
        id: Math.floor(Math.random()*10000),
        source: source,
        amount : amount,
        time: `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`
    };

    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

   addTransactionDom(transaction.id, source, amount, transaction.time);
}


function transTemplate(id, source, amount, time){
    return `<li data-id="${id}">
                    <p><Span>${source}</Span> 
                        <span class="time">${time}</span> 
                    </p>
                    #<span>${Math.abs(amount)}</span>
                    <svg class="delete"><use xlink: href ="image/symbol-defs.svg#icon-bin"></use></svg>
             </li>`
}

function addTransactionDom(id, source, amount, time){
    if(amount > 0){
        incomeList.innerHTML += transTemplate(id, source, amount, time);
    } else{
        expenditure.innerHTML += transTemplate(id, source, amount, time);
    }  
}


// creating a function to delete items from the local storage

function deleteTransLocalStorage(id){
    transactions = transactions.filter((transaction) => {
        return transaction.id !== id;
    });

    localStorage.setItem("transactions", JSON.stringify(transactions));
}


//delecting transactions (from the page)

incomeList.addEventListener("click", function(event){
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        deleteTransLocalStorage(Number(event.target.parentElement.dataset.id));
        updateStat();
    }
});

expenditure.addEventListener("click", function(event){
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        deleteTransLocalStorage(Number(event.target.parentElement.dataset.id));
        updateStat();
    }
});















