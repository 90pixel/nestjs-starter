# Nestjs Starter

It can take time to create a new nestjs project and make all settings and install the packages. That's why I made this
starter kit.

## Features

- [x] Authentication
- [x] Role based authorization
- [x] Refresh token operations
- [x] Session verify and token management from database
- [x] Logout function for killing session
- [x] CurrentUser decorator
- [x] Mysql connection (another driver can be used easily)
- [x] Auto load & sync entities
- [x] Eslint
- [x] Swagger (persistAuthorization)
- [x] Env settings (local and dev)
- [x] Debug settings
- [x] Validation setted up and contains sample codes
- [x] Response Format
- [x] Access token, username are indexed for quick access
- [x] Pagination

## Installation

The project is using the current lts version node.js 18.14.2 and nestjs 9.3.9.
First of all, if you have nvm, let's make sure you are using version 18.14.2

```bash 
  nvm install 18.14.2
  nvm use 18.14.2
```

To install all packages

```bash 
  npm install
```

To upgrade all packages to current versions

```bash 
  npm update
  npm i -g npm-check-updates && ncu -u && npm i
```

## Usages & Examples

### Authorization

To enable bearer token sending with Swagger, you must put the following tag at the beginning of the controller

```
@ApiBearerAuth()
```

Using the Roles decorator, you can specify the user roles that can access those controls.

```
@Roles(Role.Admin, Role.User)
  @Get('me')
  async getProfile(@Req() req) {
    const response = await this.usersService.findMeById(req.user.id);
    return new ResponseDto(response);
  }
```

All remaining functions are public. You don't need to use @public decorator.

### Response Format

You can return responseDto when returning data in the controller to have a uniform response format

```typescript
const response = await this.authService.getAccessToken(refreshToken);
return new ResponseDto(response, 'Access token retrieved');
```

``return new ResponseDto(response);`` // returns 'ok' message and statusCode:200

``return new ResponseDto(response, 'Access token retrieved');`` // returns custom message and statusCode:200

``return new ResponseDto(null, 'Access token cannot retrieved', HttpStatus.BAD_REQUEST);`` // returns custom message and
statusCode:400

Response Example:

```
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0cmluZyIsInN1YiI6MSwiY3JlYXRlZEF0IjoiMjAyMi0xMS0xMFQxMDo1MDo1MS41MzBaIiwiaWF0IjoxNjY4MTU1MTQ0LCJleHAiOjE2NjgyNDUxNDR9.Xf6AKBTgx6NPXtP7WsqvUJMYdvpUZ_9zZvTTfZpxJyA",
    "refreshToken": "c1cb305691112804f045af444fc39a41876bfec25aa544d4cb1ab4e94b05693f743d9c2548afc9c92a8e555777c6bbc50a97fe3bf8fab30eac581e8c42031b0f",
    "expiresAt": "2022-11-12T09:25:44.918Z",
    "expiresRefreshAt": "2022-12-11T08:25:44.918Z"
  },
  "message": "Login informations are retrived",
  "statusCode": 200
}
```

### Mapping response object

Sometimes you may not need to return all objects of a data (Ex. password). In such a case, create a response object and
use '?' for allow null.

```typescript
const result: User = await this.usersRepository.findOne({ where: { id: id } });
return new MeResponseDto(result);
```

```typescript
export class MeResponseDto {
  constructor(payload: any) {
    this.id = payload?.id;
    this.username = payload?.username;
    this.role = payload?.role;
  }

  id: number;
  username: string;
  role: string;
}
```

### Validations

More info: https://github.com/typestack/class-validator

### Typeorm Lazy Loading

It is not efficient to constantly call up data that is not always needed (Eager loading). In such cases lazy loading can
be used

More info: https://orkhan.gitbook.io/typeorm/docs/eager-and-lazy-relations#lazy-relations

### Pagination class

Pagination works can sometimes be confused. Added pagination class for convenience. You can take a look at the comment
lines in the example below.

```
async paginateAll() {
    //create pagination object
    const pagination = new PagePaginator();
    //
    return await pagination.paginate(
        //identify your table to use
      this.usersRepository.createQueryBuilder(),
      {
        //default is 1
        page: 1,
        //default is 10
        take: 3,
        //true for asc, false for desc, default is id desc
        orderBy: { id: false },
        //you can use typeorm where clause
        where: { id: MoreThan(0) },
        //add relations if you want take them too
        relations: ['sessionTokens'],
      },
    );
  }
```

  