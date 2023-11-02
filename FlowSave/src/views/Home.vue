<script lang = "ts" setup>

</script>
<template>
    <div class="header-home">
        <img src="../assets/png/logo-no-background.png" alt="Logo de FlowSave">
    </div>
    <div class="header-image">

        <div class="buttons-cta">
            <button class="button1" @click="$router.push('/start')">
                Commencer
            </button>
            <button class="button2" @click="$router.push('/login')">
                Se connecter
            </button>
        </div>
    </div>
    <div class="content">
        <n-card title="Qu'est-ce que FlowSave ?" hoverable>
            <p>FlowSave est une application de gestion financière qui vous permet de suivre vos dépenses, de créer
                des
                budgets, d'analyser vos transactions bancaires, et de mieux gérer votre argent.</p>
        </n-card>
        <n-card title="Comment puis-je utiliser FlowSave pour gérer mon budget ?" hoverable>
            <p>FlowSave est conçu pour vous aider à gérer votre budget sans avoir à connecter vos comptes bancaires.
                Vous pouvez saisir manuellement vos revenus et dépenses pour avoir une vue d'ensemble de vos finances.
            </p>
        </n-card>
        <n-card title="FlowSave propose-t-il des fonctionnalités de suivi des dépenses ?" hoverable>
            <p>Oui, vous pouvez enregistrer vos dépenses dans FlowSave en spécifiant la catégorie, le montant et la
                date. L'application vous permettra de suivre vos dépenses au fil du temps.</p>
        </n-card>
        <n-card title="Puis-je créer des budgets personnalisés avec FlowSave ?" hoverable>
            <p>Absolument, FlowSave vous permet de créer des budgets personnalisés en définissant des catégories de
                dépenses et des limites pour chacune. Vous pouvez suivre votre progression et ajuster vos budgets au
                besoin.</p>
        </n-card>
        <n-card title="Est-ce que FlowSave offre des outils d'analyse financière ?" hoverable>
            <p>Oui, FlowSave vous propose des outils d'analyse financière pour vous aider à comprendre vos habitudes de
                dépenses et à planifier vos finances. Vous pouvez générer des rapports et des graphiques pour une
                meilleure visualisation.</p>
        </n-card>
    </div>
    <n-carousel effect="card" prev-slide-style="transform: translateX(-150%) translateZ(-800px);"
        next-slide-style="transform: translateX(50%) translateZ(-800px);" style="height: 540px" :show-dots="false">
        <n-carousel-item :style="{ width: '60%' }">
            <img class="carousel-img" src="../assets/png/flowsave2.png">
        </n-carousel-item>
        <n-carousel-item :style="{ width: '60%' }">
            <img class="carousel-img" src="../assets/png/flowsave3.png">
        </n-carousel-item>
        <n-carousel-item :style="{ width: '60%' }">
            <img class="carousel-img" src="../assets/png/flowsave4.png">
        </n-carousel-item>

    </n-carousel>


    <div class="pricing">
        <n-h1 prefix="bar" align-text type="warning">
            <n-text type="warning">
                FlowSave est disponible en trois versions :
            </n-text>
        </n-h1>
        <h2>
        </h2>
        <n-space vertical>
            <n-table striped>
                <thead>
                    <tr>
                        <th>Version</th>
                        <th>Gratuite</th>
                        <th>Premium</th>
                        <th>Business</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <b>Prix</b>
                        </td>
                        <td>
                            <b>Gratuit</b>
                        </td>
                        <td>
                            <b>4,99€/mois</b>
                        </td>
                        <td>
                            <b>9,99€/mois</b>
                        </td>
                    </tr>
                    <tr>
                        <td>Suivi des dépenses manuelles</td>
                        <td>✅</td>
                        <td>✅</td>
                        <td>✅</td>
                    </tr>
                    <tr>
                        <td>Création de budgets de base</td>
                        <td>✅</td>
                        <td>✅</td>
                        <td>✅</td>
                    </tr>
                    <tr>
                        <td>Importation de relevés bancaires (manuellement)</td>
                        <td>❌</td>
                        <td>✅</td>
                        <td>✅</td>
                    </tr>
                    <tr>
                        <td>Rapports de budget avancés</td>
                        <td>❌</td>
                        <td>✅</td>
                        <td>✅</td>
                    </tr>
                    <tr>
                        <td>Personnalisation des catégories de dépenses</td>
                        <td>❌</td>
                        <td>✅</td>
                        <td>✅</td>
                    </tr>
                    <tr>
                        <td>Exportation de données</td>
                        <td>❌</td>
                        <td>✅</td>
                        <td>✅</td>
                    </tr>
                    <tr>
                        <td>Gestion de plusieurs profils (par exemple, personnel et professionnel)</td>
                        <td>❌</td>
                        <td>❌</td>
                        <td>✅</td>
                    </tr>
                    <tr>
                        <td>Suivi des revenus et des dépenses pour les petites entreprises</td>
                        <td>❌</td>
                        <td>❌</td>
                        <td>✅</td>
                    </tr>
                    <tr>
                        <td>Facturation et gestion des paiements</td>
                        <td>❌</td>
                        <td>❌</td>
                        <td>✅</td>
                    </tr>
                    <tr>
                        <td>Support client prioritaire</td>
                        <td>❌</td>
                        <td>❌</td>
                        <td>✅</td>
                    </tr>

                </tbody>
            </n-table>
        </n-space>
    </div>

    <div class="starting">

        <h1>
            Commencez dès aujourd'hui !
        </h1>
        <button>
            Commencer
        </button>

    </div>
    <div class="footer">
        <n-space align="center" justify="center">
            <n-text type="secondary">© FlowSave 2021</n-text>
            <n-text type="secondary">À propos</n-text>
            <n-text type="secondary">Conditions d'utilisation</n-text>
            <n-text type="secondary">Politique de confidentialité</n-text>
        </n-space>
    </div>
</template>

<style>
@media screen and (min-width: 900px) {

    .buttons-cta {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 2%;

    }

    .buttons-cta .button1 {
        width: 200px;
        height: 60px;
        background-color: #FFC107;
        border: none;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 1.2em;
        font-weight: bold;
        cursor: pointer;
        color: #FFF;
        transition: all 0.2s ease-in-out;
        border-radius: 4px;
    }

    .buttons-cta .button2 {
        width: 200px;
        height: 60px;
        background-color: rgb(255, 248, 248);
        border: #FFC107 solid 2px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 1.2em;
        font-weight: bold;
        cursor: pointer;
        color: #FFA000;
        transition: all 0.2s ease-in-out;
        border-radius: 4px;
    }

    .buttons-cta .button1:hover {
        background-color: #FFA000;
        transform: scale(1.4) translateX(50px);
    }

    .buttons-cta .button2:hover {
        transform: scale(1.4) translateX(-50px);
    }

    .header-home {
        display: flex;
        flex-direction: row;
        align-items: end;
        justify-content: center;
        padding: 2%;
        gap: 2%;

    }



    .header-home img {
        width: 200px;
    }

    .header-home h1 {
        font-size: 3em;
        line-height: 0.1;
    }

    .header-image {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 2%;
        background-image: url("../assets/png/flowsave-header.png");
        background-size: cover;
        height: 50vh;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding: 2%;
    }


    .carousel-img {
        margin: 0 auto;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }


    .pricing {
        display: flex;
        flex-direction: column;
        gap: 10%;
        padding: 2%;
    }

    .starting {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10%;
        padding: 2%;
    }

    .starting button {
        width: 200px;
        height: 50px;
        background-color: #FFC107;
        border: none;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 1.2em;
        font-weight: bold;
        cursor: pointer;
        color: #FFF;
        animation: gling 4s infinite;
        transition: all 0.2s ease-in-out;
        border-radius: 4px;


    }

    @keyframes gling {
        0% {
            transform: scale(1);
        }

        20% {
            transform: scale(1.2);
        }

        40% {
            transform: scale(1);
        }

        60% {
            transform: scale(1.2);
        }

        80% {
            transform: scale(1);
        }

        100% {
            transform: scale(1.2);
        }

    }

    .starting button:hover {
        background-color: #FFA000;
        transform: scale(1.4);

    }



    .footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 2%;
        padding: 2%;
    }

}

@media screen and (min-width:400px) AND (max-width:900px) {

    .buttons-cta {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 2%;

    }

    .buttons-cta .button1 {
        width: 200px;
        height: 60px;
        background-color: #FFC107;
        border: none;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 1.2em;
        font-weight: bold;
        cursor: pointer;
        color: #FFF;
        transition: all 0.2s ease-in-out;
        border-radius: 4px;
    }

    .buttons-cta .button2 {
        width: 200px;
        height: 60px;
        background-color: rgb(255, 248, 248);
        border: #FFC107 solid 2px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 1.2em;
        font-weight: bold;
        cursor: pointer;
        color: #FFA000;
        transition: all 0.2s ease-in-out;
        border-radius: 4px;
    }

    .buttons-cta .button1:hover {
        background-color: #FFA000;
        transform: scale(1.4) translateX(50px);
    }

    .buttons-cta .button2:hover {
        transform: scale(1.4) translateX(-50px);
    }

    .header-home {
        display: flex;
        flex-direction: row;
        align-items: end;
        justify-content: center;
        padding: 2%;
        gap: 2%;

    }

    .header-home img {
        width: 200px;
    }

    .header-home h1 {
        font-size: 3em;
        line-height: 0.1;
    }

    .header-image {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 2%;
        background-image: url("../assets/png/flowsave-header.png");
        background-size: cover;
        height: 20vh;
    }

    .n-carousel {
        display: none;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding: 2%;
    }

    .pricing {
        padding: 4%;
    }

    .starting {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10%;
        padding: 2%;
        margin-bottom: 100px;
    }

    .starting button {
        width: 200px;
        height: 50px;
        background-color: #FFC107;
        border: none;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 1.2em;
        font-weight: bold;
        cursor: pointer;
        color: #FFF;
        animation: gling 4s infinite;
        transition: all 0.2s ease-in-out;
        border-radius: 4px;


    }

    @keyframes gling {
        0% {
            transform: scale(1);
        }

        20% {
            transform: scale(1.2);
        }

        40% {
            transform: scale(1);
        }

        60% {
            transform: scale(1.2);
        }

        80% {
            transform: scale(1);
        }

        100% {
            transform: scale(1.2);
        }

    }

    .starting button:hover {
        background-color: #FFA000;
        transform: scale(1.4);

    }



    .footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 2%;
        padding: 2%;
    }
}

@media screen and (max-width:400px) {
    .header-home {
        display: flex;
        flex-direction: row;
        align-items: end;
        justify-content: center;
        padding: 2%;
        gap: 2%;

    }

    .header-home img {
        width: 200px;
    }

    .header-home h1 {
        font-size: 3em;
        line-height: 0.1;
    }

    .header-image {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 2%;
        background-image: url("../assets/png/flowsave-header.png");
        background-size: cover;
        height: 20vh;
    }

    .n-carousel {
        display: none;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding: 2%;
    }

    .pricing {
        padding: 4%;
    }

    .pricing .n-space {
        overflow-x: scroll;
    }

    .starting {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10%;
        padding: 2%;
        margin-bottom: 100px;
        text-align: center;
    }


    .starting button {
        width: 200px;
        height: 50px;
        background-color: #FFC107;
        border: none;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 1.2em;
        font-weight: bold;
        cursor: pointer;
        color: #FFF;
        animation: gling 4s infinite;
        transition: all 0.2s ease-in-out;
        border-radius: 4px;
    }

    @keyframes gling {
        0% {
            transform: scale(1);
        }

        20% {
            transform: scale(1.2);
        }

        40% {
            transform: scale(1);
        }

        60% {
            transform: scale(1.2);
        }

        80% {
            transform: scale(1);
        }

        100% {
            transform: scale(1.2);
        }

    }

    .buttons-cta {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 2%;

    }

    .buttons-cta .button1 {
        width: 130px;
        height: 50px;
        background-color: #FFC107;
        border: none;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 1.2em;
        font-weight: bold;
        cursor: pointer;
        color: #FFF;
        transition: all 0.2s ease-in-out;
        border-radius: 4px;
    }

    .buttons-cta .button2 {
        width: 130px;
        height: 50px;
        background-color: rgb(255, 248, 248);
        border: #FFC107 solid 2px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 1.2em;
        font-weight: bold;
        cursor: pointer;
        color: #FFA000;
        transition: all 0.2s ease-in-out;
        border-radius: 4px;
    }
}
</style>