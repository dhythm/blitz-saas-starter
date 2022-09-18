# blitz-saas-starter

## How to create the environment
```sh
npx blitz new blitz-saas-starter
cd blitz-saas-starter

docker-compose run -p 5432:5432 -d postgres
blitz prisma generate
blitz prisma migrate dev
blitz db seed


```
## Getting Started
```sh

```
