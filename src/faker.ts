import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { faker } from "@faker-js/faker";
import { generate } from "isbn-util";
import { Author } from "./entity/Author";
import { Book } from "./entity/Book";
import { Genre } from "./entity/Genre";
import { Language } from "./entity/Language";
import { Publisher } from "./entity/Publisher";
import { User, UserRole } from "./entity/User";
import { encryptionUtils } from "./api/utils/encryptionUtils";
import { UserDetails } from "./entity/UserDetails";
import { Group } from "./entity/Group";

function getMultipleRandom(arr, max) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, Math.floor(Math.random() * max) + 1);
}

function genRandomAuthors(count: Number): Author[] {
    console.log(` --- Generowanie ${count} autorów`);
    let authors: Author[] = [];
    for (let index = 0; index < count; index++) {
        const author = new Author();
        author.name = faker.name.findName();
        authors.push(author);
    }
    return authors;
}

function genRandomPublishers(count: Number): Publisher[] {
    console.log(` --- Generowanie ${count} wydawnictw`);
    let publishers: Publisher[] = [];
    for (let index = 0; index < count; index++) {
        const publisher = new Publisher();
        publisher.name = `${faker.name.findName()} "${faker.lorem.words(3)}"`;
        publishers.push(publisher);
    }
    return publishers;
}

function genLangs(): Language[] {
    console.log(" --- Generowanie języków");
    const languages = ["polski", "angielski", "niemiecki", "hiszpański", "portugalski", "koreański", "chiński"];
    let langs: Language[] = [];
    for (let index = 0; index < languages.length; index++) {
        const lang = new Language();
        lang.language = languages[index];
        langs.push(lang);
    }
    return langs;
}

function genGenres(): Genre[] {
    console.log(" --- Generowanie gatunków");
    const genres = ["fantasy", "horror", "klasyka", "kryminał", "sensacja", "thriller", "programowanie", "edukacja"];
    let genresToDB: Genre[] = [];
    for (let index = 0; index < genres.length; index++) {
        const genre = new Genre();
        genre.name = genres[index];
        genresToDB.push(genre);
    }
    return genresToDB;
}

async function genTwoUsers() {
    console.log(" --- Generowanie Admina i Pracownika");
    const hashed1234 = await encryptionUtils.cryptPassword("12341234");
    const user = new User();
    const userDetails = new UserDetails();
    user.login = "kntp123";
    user.password = hashed1234;
    user.role = UserRole.ADMIN;

    userDetails.firstName = "Kamil";
    userDetails.lastName = "Powski";
    userDetails.email = "kpowski@gmail.com";
    userDetails.phone = "803501683";
    userDetails.city = "Gorlice";
    userDetails.postalCode = "38-300";
    userDetails.streetAddress = "Fioletowa, 194";
    userDetails.group = null;

    user.userDetails = userDetails;

    const user2 = new User();
    const userDetails2 = new UserDetails();
    user2.login = "test123";
    user2.password = hashed1234;
    user2.role = UserRole.WORKER;

    userDetails2.firstName = "Michal";
    userDetails2.lastName = "Pracownik";
    userDetails2.email = "mpracownik@gmail.com";
    userDetails2.phone = "152174186";
    userDetails2.city = "Kraków";
    userDetails2.postalCode = "30-063";
    userDetails2.streetAddress = "Krakowska, 15";
    userDetails2.group = null;

    user2.userDetails = userDetails2;

    return [user, user2];
}

function generateGroups() {
    console.log(` --- Generowanie grup 1-8[a,b,c]`);
    const groupLetters = ["a", "b", "c"];
    let groups: Group[] = [];

    for (let index = 0; index < 8; index++) {
        groupLetters.forEach((letter) => {
            const userGroup = new Group();
            userGroup.name = `${index + 1}${letter}`;
            groups.push(userGroup);
        });
    }
    return groups;
}

async function generateStudents(connection: Connection, count: Number) {
    console.log(` --- Generowanie ${count} uczniów`);
    const hashed1234 = await encryptionUtils.cryptPassword("12341234");
    const groups: Group[] = await connection.getRepository(Group).find();
    let students: User[] = [];
    for (let index = 0; index < count; index++) {
        const user = new User();
        const userDetails = new UserDetails();
        const userGroup = new Group();
        user.login = `uczen${index}wsb`;
        user.password = hashed1234;
        user.role = UserRole.STUDENT;

        userDetails.firstName = faker.name.firstName();
        userDetails.lastName = faker.name.lastName();
        userDetails.email = faker.internet.email();
        userDetails.phone = faker.phone.phoneNumber("#########");
        userDetails.city = faker.address.city();
        userDetails.postalCode = faker.address.zipCode("##-###");
        userDetails.streetAddress = faker.address.streetAddress(true);
        userDetails.group = groups[Math.floor(Math.random() * groups.length)];

        user.userDetails = userDetails;
        students.push(user);
    }
    return students;
}

async function genRandomBooks(connection: Connection, count: Number) {
    console.log(` --- Generowanie ${count} książek`);

    const authors: Author[] = await connection.getRepository(Author).find();
    const languages: Language[] = await connection.getRepository(Language).find();
    const publishers: Publisher[] = await connection.getRepository(Publisher).find();
    const genres: Genre[] = await connection.getRepository(Genre).find();
    let books: Book[] = [];
    for (let index = 0; index < count; index++) {
        const book = new Book();
        book.title = faker.lorem.words();
        book.isbn = generate("13");
        book.publicationDate = faker.date.recent(1000);
        book.author = authors[Math.floor(Math.random() * authors.length)];
        book.language = languages[Math.floor(Math.random() * languages.length)];
        book.publisher = publishers[Math.floor(Math.random() * publishers.length)];
        book.genres = getMultipleRandom(genres, 3);
        book.description = faker.lorem.words(7);
        console.log(book);
        books.push(book);
    }

    return books;
}

//npm run typeorm:cli -- migration:generate -n migration1
//npm run typeorm:cli -- migration:run
createConnection()
    .then(async (connection: Connection) => {
        console.log(" --- Baza danych uruchomiona");

        const authorRepo = connection.getRepository(Author);
        await authorRepo.save(genRandomAuthors(20));

        const genreRepo = connection.getRepository(Genre);
        await genreRepo.save(genGenres());

        const langRepo = connection.getRepository(Language);
        await langRepo.save(genLangs());

        const publisherRepo = connection.getRepository(Publisher);
        await publisherRepo.save(genRandomPublishers(20));

        const groupsRepo = connection.getRepository(Group);
        await groupsRepo.save(generateGroups());

        const userRepo = connection.getRepository(User);
        await userRepo.save(await genTwoUsers());
        await userRepo.save(await generateStudents(connection, 25));

        const bookRepo = connection.getRepository(Book);
        bookRepo.save(await genRandomBooks(connection, 15));
    })
    .catch((error) => console.log(error));
