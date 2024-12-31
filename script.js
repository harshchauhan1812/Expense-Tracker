document.addEventListener("DOMContentLoaded", () => {
    const balance = document.getElementById("balance");
    const money_plus = document.getElementById("money-plus");
    const money_minus = document.getElementById("money-minus");
    const list = document.getElementById("list");
    const delete_btn = document.getElementById("delete-btn");
    const form = document.getElementById("form");
    const text = document.getElementById("text");
    const amount = document.getElementById("amount");
    const btn = document.getElementById("btn");
  
    
  
    const localStorageTransactions = JSON.parse(
      localStorage.getItem("transactions")
    );
    let transactions =
      localStorage.getItem("transactions") !== null
        ? localStorageTransactions
        : [];
  
    function addTransactionDOM(transaction) {
      const sign = transaction.amount < 0 ? "-" : "+";
  
      const item = document.createElement("li");
      item.classList.add(transaction.amount < 0 ? "minus" : "plus");
      // Math.abs ka mtlb hai k aghr number "-" b hai tb v wo "+" values hi return kryga
      item.innerHTML = `
          ${transaction.text}<span>${sign}${Math.abs(transaction.amount)}</span>
          <button class = "delete-btn" onclick = "removeTransaction(${
            transaction.id
          })">X</button>
          `;
  
      // list.innerHTML = "";
      list.appendChild(item);
    }
  
    // Event delegation for deleting transaction(isklye hmy onclick ki jagah oper data-id = use krn pryga..)
    // list.addEventListener('click', (e) => {
    //     if (e.target.classLisat.contains('delete-btn')) {
    //         const id = e.target.getAttribute('data-id');
    //         removeTransaction(id);
    //     }
    // });
  
    // remove Transaction
    // anonymous function
    removeTransaction = function (id) {
      transactions = transactions.filter((transaction) => transaction.id !== id);
      updateLocalStorage();
      displayTransactions();
    };
  
    function updateValues() {
      // Yeh line tumhare transactions array se sirf amounts nikal kar ek nayi array amounts bana rahi hai.
      const amounts = transactions.map((transaction) => transaction.amount);
      //  Yeh total amount ka sum nikaal raha hai.(single value mai yhi kam reduce ka)
      const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
      // + amount ko filter kr rha hai...
      const income = amounts
        .filter((item) => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
      // - amount ko filter kr rha hai...
      // * -1: Yeh multiplication ensure karta hai ke tumhara result number type mein ho. (Optional hai)
      // -1 sy multiply krny sy ye always +ve value e return kryga... lkin aghr m 1 sy multiply krti o tu iska mtlb hai wo string value ko hmesha integer m e convert kryga lkin ye optional h secure case m...
      const expense = (
        amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0) *
        -1
      ).toFixed(2);
      balance.innerHTML = `$${total}`;
      money_plus.innerHTML = `$${income}`;
      money_minus.innerHTML = `$${expense}`;
    }
  
    form.addEventListener("submit", addTransaction);
  
    function addTransaction(event) {
      // page ko refresh sy rokna
      event.preventDefault();
  
      if (text.value.trim() === "" || amount.value.trim() === "") {
        alert("Please enter text and amount");
        return;
      } else {
        const transaction = {
          id: generateID(),
          text: text.value,
          //amount: +amount.value convert string value into integer e.g; value = "10", change to 10...
          // amount: +amount.value,
          amount: parseFloat(amount.value),
        };
        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateLocalStorage(); // Update local storage after adding a transaction.
        updateValues();
        text.value = "";
        amount.value = "";
      }
    }
  
    // Generate by-default id:
    function generateID() {
      return Math.floor(Math.random() * 100000000);
    }
  
    // Update local-storage:
    function updateLocalStorage() {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  
    function displayTransactions() {
      list.innerHTML = ""; // Clear the list before adding items
      transactions.forEach(addTransactionDOM);
      updateValues();
    }
  
    // addTransactionDOM(transactions[0]);
    displayTransactions();
  });
  
  // Summary of map, reduce, filter usage:
  // map tumhare array ko transform karta hai (sari amounts ko ek naye array mein daalna).
  // filter tumhe specific values (positive or negative) choose karne mein help karta hai.
  // reduce tumhara kaam hai un filtered values ka sum nikaalna.