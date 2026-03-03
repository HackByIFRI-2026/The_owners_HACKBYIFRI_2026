const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Kplɔ́n nǔ API',
            version: '1.0.0',
            description:
                "Documentation complète de l'API RESTful de la plateforme éducative Kplɔ́n nǔ. Cette API gère l'authentification, les salles de classes, les cours, les soumissions, et le Bot IA Mɛsi.",
        },
        servers: [
            {
                url: 'http://localhost:5000/api/v1',
                description: 'Serveur de développement local',
            },
            {
                url: 'https://votre-domaine.onrender.com/api/v1',
                description: 'Serveur de production',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Entrez votre token JWT ici. Exemple: Bearer <token>',
                },
            },
        },
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
