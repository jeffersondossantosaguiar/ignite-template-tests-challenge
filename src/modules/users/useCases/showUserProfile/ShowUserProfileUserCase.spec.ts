import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let showUserProfileUserCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Show user profile", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUserCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it("should be able show a user profile", async () => {
    const user = {
      name: "John Doe",
      email: "john@example.com",
      password: "123456"
    };

    const userCreated = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const userProfile = await showUserProfileUserCase.execute(userCreated.id!);

    expect(userProfile).toHaveProperty("email", "john@example.com");
  });
});
