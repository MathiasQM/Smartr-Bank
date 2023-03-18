interface Account {
  owner: string;
  username?: string;
  movements: number[];
  interestRate: number;
  pin: number;
  balance?: number;
}

// Data
const account1: Account = {
  owner: 'Mathias Quist Michaelsen',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2: Account = {
  owner: 'John Doe',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3: Account = {
  owner: 'Malte Krog',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4: Account = {
  owner: 'Christian Thrige',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts: Account[] = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector<HTMLParagraphElement>('.welcome')!;
const labelDate = document.querySelector<HTMLDivElement | HTMLSpanElement>(
  '.date'
)!;
const labelBalance =
  document.querySelector<HTMLParagraphElement>('.balance__value')!;
const labelSumIn = document.querySelector<HTMLParagraphElement>(
  '.summary__value--in'
)!;
const labelSumOut = document.querySelector<HTMLParagraphElement>(
  '.summary__value--out'
)!;
const labelSumInterest = document.querySelector<HTMLParagraphElement>(
  '.summary__value--interest'
)!;

const containerApp = document.querySelector<HTMLElement>('.app')!;
const containerMovements =
  document.querySelector<HTMLDivElement>('.movements')!;

const btnLogin = document.querySelector<HTMLButtonElement>('.login__btn')!;
const btnTransfer = document.querySelector<HTMLButtonElement>(
  '.form__btn--transfer'
)!;
const btnLoan = document.querySelector<HTMLButtonElement>('.form__btn--loan')!;
const btnClose =
  document.querySelector<HTMLButtonElement>('.form__btn--close')!;
const btnSort = document.querySelector<HTMLButtonElement>('.btn--sort')!;

const inputLoginUsername = document.querySelector<HTMLInputElement>(
  '.login__input--user'
)!;
const inputLoginPin =
  document.querySelector<HTMLInputElement>('.login__input--pin')!;
const inputTransferTo =
  document.querySelector<HTMLInputElement>('.form__input--to')!;
const inputTransferAmount = document.querySelector<HTMLInputElement>(
  '.form__input--amount'
)!;
const inputLoanAmount = document.querySelector<HTMLInputElement>(
  '.form__input--loan-amount'
)!;
const inputCloseUsername =
  document.querySelector<HTMLInputElement>('.form__input--user')!;
const inputClosePin =
  document.querySelector<HTMLInputElement>('.form__input--pin')!;

const displayMovements = function (movements: number[], sort = false): void {
  containerMovements.innerHTML = '';

  // Sort
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row" style="  padding: 2.25rem 4rem;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #eee;">
        <div class="movements__type movements__type--${type}" style="  font-size: 1.1rem;
        text-transform: uppercase;
        font-weight: 500;
        color: #fff;
        padding: 0.1rem 1rem;
        border-radius: 10rem;
        margin-right: 2rem;">${i + 1} ${type}</div>
        <div class="movements__value" style="  font-size: 1.7rem;
        margin-left: auto;">${mov} €</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculate Account balance

const calcDisplayBalance = function (currentAccount: Account): void {
  currentAccount.balance = currentAccount.movements.reduce(
    (acc, mov) => acc + mov,
    0
  );
  labelBalance.textContent = `${currentAccount.balance} €`;
};

// Calculate Summary

const calcDisplaySummary = function (currentAccount: Account): void {
  const incomes = currentAccount.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} €`;

  const outcome = currentAccount.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)} €`;

  const interest = currentAccount.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * currentAccount.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${Math.abs(interest)} €`;
};

// Create usernames from accounts
function computeUserName(accs: Account[]): void {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => {
        return name[0];
      })
      .join('');
  });
}

computeUserName(accounts);

const updateUi = function (account: Account): void {
  // display movements
  displayMovements(account.movements);
  // display balance
  calcDisplayBalance(account);
  // display summary
  calcDisplaySummary(account);
};

// Event handler
let currentAccount: Account | undefined;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Dispaly UI and Welcome message!
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    containerApp.style.opacity = '1';

    updateUi(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount);
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount?.balance! >= amount &&
    receiverAccount?.username !== currentAccount?.username
  ) {
    inputTransferAmount.style.color = inputTransferTo.style.color = 'black';
    currentAccount?.movements.push(-amount);
    receiverAccount?.movements.push(amount);
    updateUi(currentAccount!);
    inputTransferAmount.value = inputTransferTo.value = '';
  } else {
    inputTransferAmount.style.color = inputTransferTo.style.color = 'red';
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount?.movements.some(mov => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    updateUi(currentAccount);
    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const accountToClose = inputCloseUsername.value;
  const accountToClosePin = Number(inputClosePin.value);
  if (
    accountToClose === currentAccount?.username &&
    accountToClosePin === currentAccount.pin
  ) {
    const accountIndex = accounts.findIndex(
      acc => acc.username === currentAccount?.username
    );
    console.log(accountIndex);
    accounts.splice(accountIndex, 1);
    containerApp.style.opacity = '0';
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount?.movements!, !sorted);
  sorted = !sorted;
});

// const movements: number[] = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Sort
// ascending
// movements.sort((a, b) => a - b);
// console.log(movements);
// descending
// movements.sort((a, b) => b - a);
// console.log(movements);

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const euroToUsd = 1.1;

// const movementsUsd: number[] = movements.map((mov): number => mov * euroToUsd);

// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );

// Filter for deposits & withdrawals
// const deposits: number[] = movements.filter(mov => mov > 0);
// const withdrawal: number[] = movements.filter(mov => mov < 0);
