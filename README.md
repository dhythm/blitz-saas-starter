# blitz-saas-starter

## How to create the environment
```sh
npx blitz new blitz-saas-starter
cd blitz-saas-starter

docker-compose run -p 5432:5432 -d postgres
blitz prisma generate
blitz prisma migrate dev
blitz db seed

# https://github.com/blitz-js/blitz/issues/3805
blitz install chakra-ui
```
## Getting Started
```sh
blitz dev

https://blitzjs.com/docs/cli-generate
blitz g [type] [model]
```
