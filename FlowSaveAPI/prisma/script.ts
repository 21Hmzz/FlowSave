import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const updateBalance = async (accountId: number) => {
    const transactions = await prisma.transaction.findMany({
        where: {
            accountId: accountId
        }
    });
    let balance = 0;
    transactions.forEach((transaction) => {
        if (transaction.type === "expense") {
            balance -= transaction.amount;
        } else if (transaction.type === "income") {
            balance += transaction.amount;
        }
    });
    await prisma.account.update({
        where: {
            id: accountId
        },
        data: {
            balance: balance
        }
    });
}
async function main() {
    let additionalTransactions = [
        { amount: 60.0, type: "expense", name: "Achat de gadgets", accountId: 1, comments: "Nouveaux gadgets", categoryId: 6 },
        { amount: 35.0, type: "expense", name: "Courses alimentaires", accountId: 1, comments: "Achats pour la semaine", categoryId: 1 },
        { amount: 90.0, type: "expense", name: "Frais médicaux", accountId: 1, comments: "Consultation médicale", categoryId: 4 },
        { amount: 120.0, type: "expense", name: "Frais de scolarité", accountId: 1, comments: "Paiement des frais de scolarité", categoryId: 7 },
        { amount: 15.0, type: "expense", name: "Café", accountId: 1, comments: "Café avec des amis", categoryId: 2 },
        { amount: 70.0, type: "expense", name: "Articles de voyage", accountId: 1, comments: "Achats pour le voyage", categoryId: 5 },
        { amount: 25.0, type: "expense", name: "Frais bancaires", accountId: 1, comments: "Frais de transaction", categoryId: 10 },
        { amount: 50.0, type: "expense", name: "Frais d'assurance", accountId: 1, comments: "Assurance automobile", categoryId: 9 },
        { amount: 80.0, type: "income", name: "Salaire", accountId: 1, comments: "Paiement mensuel", categoryId: 11 },
        { amount: 40.0, type: "income", name: "Remboursement", accountId: 1, comments: "Remboursement d'emprunt", categoryId: 12 },
    ];

// Insérez les transactions supplémentaires dans la base de données
    for (let transaction of additionalTransactions) {
        await prisma.transaction.create({
            data: transaction,
        });
        await updateBalance(transaction.accountId);
    }


}



main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })