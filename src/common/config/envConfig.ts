export const envConfig = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    postgre: process.env.POSTGRE,
    port: process.env.PORT || 3000,
});