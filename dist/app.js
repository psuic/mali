import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import helmet from 'helmet';
import * as hpp from 'hpp';
import * as logger from 'morgan';
import errorMiddleware from './middlewares/error.middleware';
class App {
    constructor(routes) {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.env = process.env.NODE_ENV === 'production' ? true : false;
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeSwagger();
        this.initializeErrorHandling();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`🚀 App listening on the port ${this.port}`);
        });
    }
    getServer() {
        return this.app;
    }
    initializeMiddlewares() {
        if (this.env) {
            this.app.use(hpp());
            this.app.use(helmet());
            this.app.use(logger('combined'));
            this.app.use(cors({ origin: 'your.domain.com', credentials: true }));
        }
        else {
            this.app.use(logger('dev'));
            this.app.use(cors({ origin: true, credentials: true }));
        }
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
    }
    initializeRoutes(routes) {
        routes.forEach((route) => {
            this.app.use('/', route.router);
        });
    }
    initializeSwagger() {
        const swaggerJSDoc = require('swagger-jsdoc');
        const swaggerUi = require('swagger-ui-express');
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'REST API',
                    version: '1.0.0',
                    description: 'Example docs',
                },
            },
            apis: ['swagger.yaml'],
        };
        const specs = swaggerJSDoc(options);
        this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
    }
    initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}
export default App;
//# sourceMappingURL=app.js.map