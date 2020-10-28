
import { RouteDecorator } from '..';
import { httpMethodDecorator } from './utils';

export const Get = (path: string): MethodDecorator => {
    // `target` equals our class, `propertyKey` equals our decorated method name
    return httpMethodDecorator('get', { path });
};

export const Post = (path: string): MethodDecorator => {
    // `target` equals our class, `propertyKey` equals our decorated method name
    return (target, propertyKey: string): void => {
        // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
        // To prevent any further validation simply set it to an empty array here.
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }

        // Get the routes stored so far, extend it by the new route and re-set the metadata.
        const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDecorator>;

        routes.push({
            requestMethod: 'post',
            path,
            methodName: propertyKey
        });
        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};

export const Middleware = (middleware: any): MethodDecorator => {

    // `target` equals our class, `propertyKey` equals our decorated method name
    return (target, propertyKey: string): void => {
        // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
        // To prevent any further validation simply set it to an empty array here.
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }

        // Get the routes stored so far, extend it by the new route and re-set the metadata.
        let routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDecorator>;

        routes = routes.map((route: any) => {
            // add middleware on existing method name in `routes`
            if (route.methodName == propertyKey)
                return {
                    requestMethod: route.requestMethod,
                    path: route.path,
                    methodName: route.methodName,
                    middleware: middleware
                }
            return route;
        });

        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};