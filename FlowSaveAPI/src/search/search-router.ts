import {Router, Request, Response, NextFunction} from "express";

export class SearchRouter {
    router = Router();

    private index = [
        {
            'term': 'Mon compte bancaire',
            'link': '/account',
        },
        {
            'term': 'Mes comptes',
            'link': '/accounts',
        },
        {
            'term': 'Mes budgets',
            'link': '/budget',
        },
        {
            'term': 'Mes transactions',
            'link': '/account/transactions',
        },
        {
            'term': 'Mes paramètres',
            'link': '/settings',
        }, {
            'term': 'Mes paramètres du compte',
            'link': '/account/settings',
        }, {
            'term': 'Mes paramètres de sécurité',
            'link': '/settings/security',
        },
        {
            'term': 'Mon tableau de bord',
            'link': '/dashboard',
        },
    ];

    constructor() {
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const search = (req.query.q as string || '').toLowerCase();

                if (search !== '') {
                    const filteredResults = this.index.filter(item => item.term.toLowerCase().includes(search));

                    if (filteredResults.length > 0) {
                        res.json(filteredResults);
                    } else {
                        // Aucun résultat trouvé
                        res.status(404).json({message: "Aucun résultat trouvé."});
                    }
                } else {
                    // Aucune valeur de recherche fournie, renvoie l'ensemble complet
                    res.json(this.index);
                }
            } catch (error) {
                next(error);
            }
        });
    }


}
