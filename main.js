const { Subject, BehaviorSubject } = rxjs

let accounts
populateAccountsData()

// Declare observables
const selectedAccount = new BehaviorSubject(accounts[0].name)
const txsObservable = new Subject();

// Generate content
generateAccountSwitchButtons()
doSubscritions()




// Function declarations 

function generateAccountSwitchButtons() {
    const buttonsCont = document.querySelector('#accounts-container')
    accounts.forEach(acc => {
        const accButton = document.createElement('button')
        accButton.className = 'bg-neutral-800 px-8 py-6 rounded-md hover:bg-neutral-700 hover:drop-shadow-[0_35px_35px_rgba(100,100,100,0.2)] transition-all'
        accButton.innerText = acc.name
        accButton.onclick = () => {
            selectedAccount.next(acc.name)
        }
        buttonsCont.appendChild(accButton)
    })
}

function doSubscritions() {

    txsObservable.subscribe((tx) => {
        console.log(tx)
        const txTablesContainer = document.querySelector('#tx-container')

        // Check if has to rebuild the whole list or just add a new entry
        if (!Array.isArray(tx)) {
            const txRow = createRowForTx(tx)

            let dateGroupTable = txTablesContainer.querySelector(`[date-group="${tx.date}"] > table`)
            if (!dateGroupTable) {
                const { group, table } = createDateGroup(tx.date)
                dateGroupTable = table
                txTablesContainer.appendChild(group)
            }

            dateGroupTable.appendChild(txRow)
            return
        }

        // Clear all the elements before rendering new list
        txTablesContainer.replaceChildren()

        // Group objects by date
        const dateGroups = tx.reduce((x, y) => {
            (x[y.date] = x[y.date] || []).push(y);
            return x;
        }, {});

        // Iterate all the dates and tx inside dates
        for (date in dateGroups) {
            const { group, table } = createDateGroup(date)
            dateGroups[date].forEach(t => {
                const txRow = createRowForTx(t)
                table.appendChild(txRow)
            })
            txTablesContainer.appendChild(group)
        }

    });

    selectedAccount.subscribe(accName => {
        const accData = accounts.find(acc => acc.name === accName)
        console.log(accData)
        txsObservable.next(accData.txs)
    })
}

// Helper Functions

function createDateGroup(date) {

    const group = document.createElement('div')
    group.className = 'bg-neutral-800 border border-neutral-700 p-5 mb-1 first:rounded-t-md last:rounded-b-md';
    group.innerHTML = `<label class="inline-block mb-4 font-semibold">${date}</label>`
    group.setAttribute('date-group', date)

    const table = document.createElement('table')
    table.className = 'flex flex-col-reverse gap-1'
    group.appendChild(table)

    return { group, table }
}

function createRowForTx(tx) {
    const txRow = document.createElement('tr')
    txRow.className = 'flex px-2 py-4 bg-neutral-900 rounded-md text-neutral-400 border border-neutral-900 hover:text-white hover:border-neutral-700 transition-all'
    txRow.innerHTML =
        `
            <td class="flex-1">${tx.category}</td>
            <td class="flex-1">${tx.note}</td>
            <td class="flex-1">${tx.value}</td>
        `
    return txRow
}

function addNewTx() {
    const newTx = {
        category: 'Pasive Income',
        value: 400000,
        date: 'Sep 7, 2023',
        note: 'Bank Investment returns',
        type: 'ingress',
    }
    const currentAcc = accounts.find(acc => acc.name === selectedAccount.getValue())
    currentAcc.txs.push(newTx)
    txsObservable.next(newTx)
}

function populateAccountsData() {
    accounts = [
        {
            name: "First Account",
            txs: [
                {
                    category: 'Pasive Income',
                    value: 400000,
                    date: 'Sep 7, 2023',
                    note: 'Bank Investment returns',
                    type: 'ingress',
                },
                {
                    category: 'Loans',
                    value: 250000,
                    date: 'Sep 7, 2023',
                    note: 'Loan payment',
                    type: 'egress',
                },
                {
                    category: 'Other Income',
                    value: 100000000,
                    date: 'Sep 6, 2023',
                    note: 'I won the lotery!',
                    type: 'ingress',
                }
            ]
        },
        {
            name: "Second Account",
            txs: [
                {
                    category: 'Health',
                    value: 140000,
                    date: 'Jul 14, 2023',
                    note: 'Went to the doc',
                    type: 'egress',
                },
                {
                    category: 'Loans',
                    value: 25000000,
                    date: 'Jul 10, 2023',
                    note: 'Got a load to open Bakery',
                    type: 'ingress',
                },
            ]
        }
    ]
}