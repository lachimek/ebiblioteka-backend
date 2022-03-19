import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { faker } from "@faker-js/faker";
import { generate } from "isbn-util";
import { Author } from "./entity/Author";
import { Book } from "./entity/Book";
import { Genre } from "./entity/Genre";
import { Language } from "./entity/Language";
import { Publisher } from "./entity/Publisher";
import { User } from "./entity/User";
import { encryptionUtils } from "./api/utils/encryptionUtils";

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
    console.log(" --- Generowanie użytkowników");
    const hashed1234 = await encryptionUtils.cryptPassword("12341234");
    const user = new User();
    user.login = "kntp123";
    user.password = hashed1234;
    user.firstName = "Kamil";
    user.lastName = "Powski";

    const user2 = new User();
    user2.login = "test123";
    user2.password = hashed1234;
    user2.firstName = "Konrad";
    user2.lastName = "Testowy";

    return [user, user2];
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
    console.log(books);

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

        const userRepo = connection.getRepository(User);
        await userRepo.save(await genTwoUsers());

        const bookRepo = connection.getRepository(Book);
        bookRepo.save(await genRandomBooks(connection, 15));
    })
    .catch((error) => console.log(error));
