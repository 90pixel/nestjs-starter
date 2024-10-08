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
- [x] AutoMapper

## Installation

The project is using the current lts version node.js 20.10.0 and nestjs 10.3.0.
First of all, if you have nvm, let's make sure you are using version 20.10.0

```bash
  nvm install 20.17.0
  nvm use 20.17.0
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

`return new ResponseDto(response);` // returns 'ok' message and statusCode:200

`return new ResponseDto(response, 'Access token retrieved');` // returns custom message and statusCode:200

`return new ResponseDto(null, 'Access token cannot retrieved', HttpStatus.BAD_REQUEST);` // returns custom message and
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

### Validations

More info: https://github.com/typestack/class-validator

### Typeorm Lazy Loading

It is not efficient to constantly call up data that is not always needed (Eager loading). In such cases lazy loading can
be used

More info: https://orkhan.gitbook.io/typeorm/docs/eager-and-lazy-relations#lazy-relations

### Auto Mapper

Auto mapper can be used to map the response object. You can use it in the following way.
For example your entity is Users and you want to return MeResponseDto object.

```typescript
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Index({ unique: true })
  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Index()
  @Column({ type: 'enum', enum: Role, default: [Role.User] })
  role: Role;

  @CreateDateColumn()
  created_at: Date;

  @Index()
  @Column()
  salt: string;

  @UpdateDateColumn()
  updated_at: Date;

  //one to many session
  @OneToMany(() => SessionToken, (sessionToken) => sessionToken.user, {
    cascade: true,
  })
  session_tokens: SessionToken[];

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  toJSON() {
    return { ...this, password: undefined };
  }
}
```

```typescript
export class MeResponseDto {
  @Expose()
  id: number;
  @Expose()
  username: string;
  @Expose()
  role: string;
  @Expose()
  test: string;

  @Expose()
  @Type(() => SessionResponseDto)
  session_tokens: SessionResponseDto[];
}
```

```typescript
await this.utilsService.autoMapper(getUser, MeResponseDto);
```

Your response will contains only id, username, role, test and sessionTokens. We use class-validator and class-transformer for this. Because typescript cannot reflect the type of the dto props. So we use class-transformer for resolve this problem.
We must use @Expose() decorator for the properties that we want to return.
If property is pointing to another dto, we must use @Type(() => ...) decorator. Otherwise it will return the object.

### Pagination class

Pagination works can sometimes be confused. Added pagination class for convenience. You can take a look at the comment
lines in the example below.

```typescript
  async paginateAll(): Promise<PaginatorResponse> {
    return await this.utilsService.getPaginationMapper(
      Users, // Entity of the which you want to paginate
      { page: 1, limit: 10 },
      {
        order: { 'users.createdAt': 'DESC' }, // Order by should be in this format
        where: { id: MoreThan(0) }, // typeorm where conditions
        relations: ['session_tokens'], // typeorm relations
      },
      MeResponseDto, // If you want to map the response object, you can use this. should be mapper format like above
      true, // count all records
    );
  }
```

### Testing

If you want use test modules checkout nestjs/testing and use spec.ts files.
https://docs.nestjs.com/fundamentals/testing
