// Data
var account1 = {
  owner: 'Mathias Quist Michaelsen',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};
var account2 = {
  owner: 'John Doe',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};
var account3 = {
  owner: 'Malte Krog',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};
var account4 = {
  owner: 'Christian Thrige',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
var accounts = [account1, account2, account3, account4];
// Elements
var labelWelcome = document.querySelector('.welcome');
var labelDate = document.querySelector('.date');
var labelBalance = document.querySelector('.balance__value');
var labelSumIn = document.querySelector('.summary__value--in');
var labelSumOut = document.querySelector('.summary__value--out');
var labelSumInterest = document.querySelector('.summary__value--interest');
var containerApp = document.querySelector('.app');
var containerMovements = document.querySelector('.movements');
var btnLogin = document.querySelector('.login__btn');
var btnTransfer = document.querySelector('.form__btn--transfer');
var btnLoan = document.querySelector('.form__btn--loan');
var btnClose = document.querySelector('.form__btn--close');
var btnSort = document.querySelector('.btn--sort');
var inputLoginUsername = document.querySelector('.login__input--user');
var inputLoginPin = document.querySelector('.login__input--pin');
var inputTransferTo = document.querySelector('.form__input--to');
var inputTransferAmount = document.querySelector('.form__input--amount');
var inputLoanAmount = document.querySelector('.form__input--loan-amount');
var inputCloseUsername = document.querySelector('.form__input--user');
var inputClosePin = document.querySelector('.form__input--pin');
var displayMovements = function (movements, sort) {
  if (sort === void 0) {
    sort = false;
  }
  containerMovements.innerHTML = '';
  // Sort
  var movs = sort
    ? movements.slice().sort(function (a, b) {
        return a - b;
      })
    : movements;
  movs.forEach(function (mov, i) {
    var type = mov > 0 ? 'deposit' : 'withdrawal';
    var html =
      '\n      <div class="movements__row" style="  padding: 2.25rem 4rem;\n      display: flex;\n      align-items: center;\n      border-bottom: 1px solid #eee;">\n        <div class="movements__type movements__type--'
        .concat(
          type,
          '" style="  font-size: 1.1rem;\n        text-transform: uppercase;\n        font-weight: 500;\n        color: #fff;\n        padding: 0.1rem 1rem;\n        border-radius: 10rem;\n        margin-right: 2rem;">'
        )
        .concat(i + 1, ' ')
        .concat(
          type,
          '</div>\n        <div class="movements__value" style="  font-size: 1.7rem;\n        margin-left: auto;">'
        )
        .concat(mov, ' \u20AC</div>\n      </div>');
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// Calculate Account balance
var calcDisplayBalance = function (currentAccount) {
  currentAccount.balance = currentAccount.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = ''.concat(currentAccount.balance, ' \u20AC');
};
// Calculate Summary
var calcDisplaySummary = function (currentAccount) {
  var incomes = currentAccount.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = ''.concat(incomes, ' \u20AC');
  var outcome = currentAccount.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumOut.textContent = ''.concat(Math.abs(outcome), ' \u20AC');
  var interest = currentAccount.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (deposit) {
      return (deposit * currentAccount.interestRate) / 100;
    })
    .filter(function (int, i, arr) {
      return int >= 1;
    })
    .reduce(function (acc, int) {
      return acc + int;
    }, 0);
  labelSumInterest.textContent = ''.concat(Math.abs(interest), ' \u20AC');
};
// Create usernames from accounts
function computeUserName(accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
}
computeUserName(accounts);
var updateUi = function (account) {
  // display movements
  displayMovements(account.movements);
  // display balance
  calcDisplayBalance(account);
  // display summary
  calcDisplaySummary(account);
};
// Event handler
var currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  if (
    (currentAccount === null || currentAccount === void 0
      ? void 0
      : currentAccount.pin) === Number(inputLoginPin.value)
  ) {
    // Dispaly UI and Welcome message!
    labelWelcome.textContent = 'Welcome back '.concat(
      currentAccount.owner.split(' ')[0]
    );
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = '1';
    updateUi(currentAccount);
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  var amount = Number(inputTransferAmount.value);
  var receiverAccount = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  console.log(amount);
  if (
    amount > 0 &&
    receiverAccount &&
    (currentAccount === null || currentAccount === void 0
      ? void 0
      : currentAccount.balance) >= amount &&
    (receiverAccount === null || receiverAccount === void 0
      ? void 0
      : receiverAccount.username) !==
      (currentAccount === null || currentAccount === void 0
        ? void 0
        : currentAccount.username)
  ) {
    inputTransferAmount.style.color = inputTransferTo.style.color = 'black';
    currentAccount === null || currentAccount === void 0
      ? void 0
      : currentAccount.movements.push(-amount);
    receiverAccount === null || receiverAccount === void 0
      ? void 0
      : receiverAccount.movements.push(amount);
    updateUi(currentAccount);
    inputTransferAmount.value = inputTransferTo.value = '';
  } else {
    inputTransferAmount.style.color = inputTransferTo.style.color = 'red';
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  var amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    (currentAccount === null || currentAccount === void 0
      ? void 0
      : currentAccount.movements.some(function (mov) {
          return mov >= amount * 0.1;
        }))
  ) {
    currentAccount.movements.push(amount);
    updateUi(currentAccount);
    inputLoanAmount.value = '';
  }
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  var accountToClose = inputCloseUsername.value;
  var accountToClosePin = Number(inputClosePin.value);
  if (
    accountToClose ===
      (currentAccount === null || currentAccount === void 0
        ? void 0
        : currentAccount.username) &&
    accountToClosePin === currentAccount.pin
  ) {
    var accountIndex = accounts.findIndex(function (acc) {
      return (
        acc.username ===
        (currentAccount === null || currentAccount === void 0
          ? void 0
          : currentAccount.username)
      );
    });
    console.log(accountIndex);
    accounts.splice(accountIndex, 1);
    containerApp.style.opacity = '0';
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
var sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(
    currentAccount === null || currentAccount === void 0
      ? void 0
      : currentAccount.movements,
    !sorted
  );
  sorted = !sorted;
});

alert(
  'Welcome! Try logging in with: "mqm" & "1111" | "jd" & "2222" | "mk" & "3333" | "ct" & "4444"'
);
