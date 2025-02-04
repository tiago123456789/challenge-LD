## Technolgies

- Nodejs
- Typescript
- Dynamodb
- Api gateway
- Lambda function
- Serverless framework
- Jest(unit tests)
- Github actions(pipeline ci)

## Instructions

- Clone repository
- Setup aws-cli and create profile named **default**
- Execute command **npm install** to install all modules project needs
- Create **serverless.env.yml** file based **serverless.env.example.yml** file.
- Execute command **npm run deploy-to-create-resource:production** use this command to deploy your application first time in prodution environment.
- Execute command **npm run deploy-to-create-resource:staging** use this command to deploy your application first time in staging environment.
- Execute command **npm run deploy:production** use this command when is your second time to deploy your application in production environment.
- Execute command **npm run deploy:staging** use this command when is your second time to deploy your application in staging environment.
- Execute command **npm run start:dev** to run lambda function locally. PS: when you start the application the plugin **serverless-dynamodb** will create the dynamodb table locally for you.
- Execute command **npm run test** to run unit tests the api.

## Extra

- Import **Insomnia_2025-01-25.json** file with routes in Insominia to test.
- The **serverless.env.yml** file structure:

```
dev:
  table: 'table_name_here'
staging:
  table: 'table_name_here'
production:
  table: 'table_name_here'

```

- The project structure:

```
--- configs -> The project's configs
--- entities -> The code responsible to represent the Dynamodb table
--- functions -> The lambda function code
--- repositories -> The code reponsible to execution actions like: queries, save and delete data.
--- services -> the business logic of application here.
--- types    -> The types I using on application.
--- utils    -> The code used to support the other layers.
--- tests    -> The tests code
```

- I blocked send code to branchs: staging and master, so that way you can protected against send code no ready to staging or production(branch master), you need open PULL REQUEST.
- I setup the Github actinos CI(run the tests) pipeline to run when open PR, so to merge
  the PR all the tests needs to pass and someone needs to review the PR.

