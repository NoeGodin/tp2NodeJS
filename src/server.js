    import Fastify from 'fastify'
    import handlebars from 'handlebars';
    import fastifyView from '@fastify/view';
    import { getData } from './api.js';

    const fastify = Fastify({
        logger: true
    })

    fastify.register(fastifyView, {
        engine: {
            handlebars,
        },
        includeViewExtension: true,
        templates: 'templates',
        options: {
            partials: {
                header: 'header.hbs',
                footer: 'footer.hbs'
            }
        }
    });

    // Declare a route
    fastify.get('/', async function handler (request, reply) {
        const characters = await getData("https://gateway.marvel.com:443/v1/public/characters");
        console.log(characters)
        return reply.view('index.hbs', { characters });
    })

    // Run the server!
    try {
        await fastify.listen({ port: 3000 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }