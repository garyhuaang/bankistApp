'use strict';

// BANKIST APP

// Data
const account1 = {
    user: 'js',
    first_name: 'Jonas',
    last_name: 'Schmedtmann',
    movements: [200, 455.23, -305.50, 25000, -642.21, -133.90, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    user: 'jd',
    first_name: 'Joseph',
    last_name: 'Daniels',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    user: 'stw',
    first_name: 'Stalin',
    last_name: 'Winston',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    user: 'ss',
    first_name: 'Stephen',
    last_name: 'Storky',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

let accounts = [account1, account2, account3, account4];


// DOM Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//////////////////// FUNCTIONS /////////////////////////////
//////////////////// FUNCTIONS /////////////////////////////
// Updates UI
const updateUI = (user) => {
    displayMovements(user); // display transactions of user
    labelWelcome.innerHTML = `Welcome ${user.first_name}!`
    updateBalance(user); // updates and displays user's banking information
}

// Inserts commas as seperators for thousands
const numberWithCommas = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Diplay deposit and withdrawls and respective amounts
const displayMovements = (user) => {
    const movements = user.movements;
    containerMovements.innerHTML = ''; // empty html to be filled in

    movements.forEach((move, i) => {
        const type = move > 0 ? 'deposit' : 'withdrawal';
        const depositHTML = `<div class="movements__value">$ ${numberWithCommas(move.toFixed(2))}</div>`
        const withdrawalHTML = `<div class="movements__value">-$ ${numberWithCommas(Math.abs(move).toFixed(2))}</div>`

        const html =
            `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        ${type === 'deposit' ? depositHTML : withdrawalHTML}
      </div>
    `;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });

    containerApp.style.opacity = '100';
};

// Display loan movements AND updates balance
const displayLoan = (user, loan) => {
    user.movements.push(loan);

    const html =
        `
    <div class="movements__row">
      <div class="movements__type movements__type--deposit">${user.movements.length} loan</div>
      <div class="movements__value">$ ${numberWithCommas(loan.toFixed(2))}</div>
    </div>
  `
    containerMovements.insertAdjacentHTML('afterbegin', html);

    updateBalance(user, loan);
}

// Display transfer movements AND updates balance
const displayTrans = (from, to, amount) => {
    if (amount > from.balance) return alert('Not enough 💵');

    amount *= -1;

    from.movements.push(amount);

    const html =
        `
    <div class="movements__row">
      <div class="movements__type movements__type--withdrawal">${from.movements.length} tranfer</div>
      <div class="movements__value">-$ ${numberWithCommas(Math.abs(amount.toFixed(2)))}</div>
    </div>
  `

    containerMovements.insertAdjacentHTML('afterbegin', html);

    // we are passing in a neg amount, not pos
    updateBalance(from, 0, amount);
}

// Update + display user's total balance
const updateBalance = (user, loan = 0, trans = 0) => {
    // trans already negative, so will deduct from loan if it exists
    let balance = loan + trans;
    let sumIn = 0;
    let sumOut = 0;
    const movements = user.movements;

    // calculating balance for user
    movements.forEach((move) => {
        balance += move;
        move > 0 ? sumIn += move : sumOut += move;
    });

    const interest = balance * user.interestRate / 100;

    // output values to html
    labelBalance.textContent = `$ ${numberWithCommas(balance.toFixed(2))}`;
    labelSumIn.textContent = `$ ${numberWithCommas(sumIn.toFixed(2))}`;
    labelSumOut.textContent = `$ ${numberWithCommas(Math.abs(sumOut).toFixed(2))}`
    labelSumInterest.textContent = `$ ${numberWithCommas(interest.toFixed(2))}`

    // update or push new key value pairs into object
    user.balance = balance.toFixed(2);
    user.sumIn = sumIn.toFixed(2);
    user.sumOut = sumOut.toFixed(2);
    user.sumInterest = interest.toFixed(2);
};

// Verifies user credentials, returns the account object or null
const verifyUser = (user, pw) => {
    console.log(`user: ${user}, pw: ${pw}`);
    for (const account of accounts) {
        if (account.user === user && account.pin === Number(pw)) return account;
    }
    alert('No account found, please verify credentials 🥸')
    return null;
};

// Remove user 
const removeUser = (user) => {
    const newAccounts = accounts.filter((acc) => acc.user !== user.user);

    accounts = newAccounts;
};


//////////////////// EVENT LISTENERS ///////////////////////
//////////////////// EVENT LISTENERS ///////////////////////
let activeUser = {};

btnLogin.addEventListener('click', (e) => {
    e.preventDefault();

    const user = verifyUser(inputLoginUsername.value, inputLoginPin.value);
    activeUser = user;

    if (activeUser != null) updateUI(user);

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
});

btnClose.addEventListener('click', (e) => {
    e.preventDefault();

    const user = verifyUser(inputCloseUsername.value, inputClosePin.value);

    if (activeUser === user) containerApp.style.opacity = 0
    removeUser(user);

    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
});

btnLoan.addEventListener('click', (e) => {
    e.preventDefault();

    const loan = Number(inputLoanAmount.value);

    if (loan > 0) displayLoan(activeUser, loan);
    else alert('Invalid loan amount 😔');

    inputLoanAmount.value = '';
    inputLoanAmount.blur();
});

btnTransfer.addEventListener('click', (e) => {
    e.preventDefault();

    const amount = Number(inputTransferAmount.value);
    console.log(amount);

    if (amount > 0) displayTrans(activeUser, inputTransferTo, amount);
    else alert('Invalid transfer amount 😔');

    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();
});