import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Authenticate an user", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  });

  it("should be possible for the user authenticate himself", async () => {
    const user = {
      name: "John Doe",
      email: "john@example.com",
      password: "123456"
    };

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const token = await authenticateUserUseCase.execute(user);

    expect(token).toHaveProperty("token");
  });

  it("should not be possible authenticate with wrong email", async () => {

    expect(async () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        password: "123456"
      };

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      await authenticateUserUseCase.execute({ email: "wrong@email", password: "123456" });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be possible authenticate with wrong password", async () => {

    expect(async () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        password: "123456"
      };

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      await authenticateUserUseCase.execute({ email: "john@example.com", password: "wrongPassword" });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
