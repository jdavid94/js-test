const { clients, accounts, banks } = require('./dataBase.json');
// 0 Arreglo con los ids de clientes
function listClientsIds() {
    return clients.map((client) => client.id);
};

// 1 Arreglo con los ids de clientes ordenados por rut
function listClientsIdsSortByTaxNumber() {
    //Parseamos a Int para poder hacer la operacion.
    let clientList = clients.sort((prev, next) => parseInt(prev['taxNumber']) - parseInt(next['taxNumber']));
    return clientList.map((client) => client.id);
};

// 2 Arreglo con los nombres de cliente ordenados de mayor a menor por la suma TOTAL de los saldos de cada cliente en los bancos que participa.
function sortClientsTotalBalances() {
    let resultsList = clients.map((client) => {
        // Sumamos los balances de cada cliente
        let clientBalance = accounts.reduce((acc, account) => {
            if (account.clientId === client.id) {
                acc += account.balance;
            }
            return acc;
        }, 0);
        // Generamos el Resultado
        let finalResult = {
            id: client.id,
            name: client.name,
            totalBalance: clientBalance
        };
        return finalResult;
    });
    // Ordenamos de Mayor a Menor segun el Balance
    let orderList = resultsList.sort((prev, next) => next.totalBalance - prev.totalBalance);
    //Mostramos solo los nombres
    return orderList.map((client) => client.name);
};


// 3 Objeto en que las claves sean los nombres de los bancos y los valores un arreglo con los ruts de sus clientes ordenados alfabeticamente por nombre.
function banksClientsTaxNumbers() {
    const taxNumberByClientId = clients.reduce(
        (a, { id, taxNumber }) => Object.assign(a, {
            [id]: taxNumber
        }), {}
    );
    const banksByBankId = banks.reduce(
        (a, { id, name }) => Object.assign(a, {
            [id]: name
        }), {}
    );
    const taxNumbersByBank = accounts.reduce((resp, { clientId, bankId }) => {
        const bankName = banksByBankId[bankId];
        const taxNumber = taxNumberByClientId[clientId];
        if (!resp[bankName]) resp[bankName] = new Set();
        resp[bankName].add(taxNumber);
        return resp;
    }, {});
    const results = Object.entries(taxNumbersByBank)
        .map(([bank, clientsSet]) => ({
            bank,
            clients: [...clientsSet]
        }));
    return results;
}


// 4 Arreglo ordenado decrecientemente con los saldos de clientes que tengan más de 25.000 en el Banco SANTANDER
function richClientsBalances() {
    //Aislamos el Banco a Utilizar.
    let idSantander = banks.find(x => x.name == 'SANTANDER').id;
    // Constante del monto minumo a comparar.
    const minimunBalance = 25000;
    let richBalances = accounts.filter(account => account.bankId == idSantander &&
        account.balance > minimunBalance).map(account => account.balance).sort((prev, next) => next - prev);
    return richBalances;
}

// 5 Arreglo con ids de bancos ordenados crecientemente por la cantidad TOTAL de dinero que administran.
function banksRankingByTotalBalance() {
    let banksRanking = banks.map((bank) => ({
        id: bank.id,
        total: accounts
            .filter(account => account.bankId === bank.id)
            .reduce((a, b) => a + b.balance, 0)
    })).sort((prev, next) => prev.total - next.total).map(totals => totals.id);
    return banksRanking;
}

// 6 Objeto en que las claves sean los nombres de los bancos y los valores el número de clientes que solo tengan cuentas en ese banco.
function banksFidelity() {

}

// 7 Objeto en que las claves sean los nombres de los bancos y los valores el id de su cliente con menos dinero.
function banksPoorClients() {

}

// 8 Agregar nuevo cliente con datos ficticios a "clientes" y agregar una cuenta en el BANCO ESTADO con un saldo de 9000 para este nuevo empleado. 
// Luego devolver el lugar que ocupa este cliente en el ranking de la pregunta 2.
// No modificar arreglos originales para no alterar las respuestas anteriores al correr la solución
function newClientRanking() {
    const nClient = clients.slice(0, clients.length);
    const nAccount = accounts.slice(0, accounts.length);
    let newSalary = 9000;
    //Generamos Nuevo cliente
    let newDataClient = {
            id: Math.max(...nClient.map(a => a.id)) + 1,
            taxNumber: '0123456',
            name: 'TEST CLIENTE'
        }
        //Generamos nuevos Datos de Cuenta
    let newDataAccount = {
        clientId: newDataClient.id,
        bankId: 3,
        balance: newSalary
    }
    nClient.push(newDataClient);
    nAccount.push(newDataAccount);
    //LLamamos a la funcion 02
    let index = sortClientsTotalBalances(nAccount, nClient).findIndex(a => a === newDataClient.name) + 1;
    return (`El lugar que ocupa ${newDataClient.name} en el ranking es del lugar ${index}`)
}


// Impresión de soluciones. No modificar.
console.log('Pregunta 0');
console.log(listClientsIds());
console.log('Pregunta 1');
console.log(listClientsIdsSortByTaxNumber());
console.log('Pregunta 2');
console.log(sortClientsTotalBalances());
console.log('Pregunta 3');
console.log(banksClientsTaxNumbers());
console.log('Pregunta 4');
console.log(richClientsBalances());
console.log('Pregunta 5');
console.log(banksRankingByTotalBalance());
console.log('Pregunta 6');
console.log(banksFidelity());
console.log('Pregunta 7');
console.log(banksPoorClients());
console.log('Pregunta 8');
console.log(newClientRanking());