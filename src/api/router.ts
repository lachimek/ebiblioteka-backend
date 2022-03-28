import * as express from "express";
import { authenticated } from "./middleware/authenticated";
import { ROUTE } from "./constants/constants";
import { AuthRoute } from "./routes/auth";
import { BooksRoute } from "./routes/books";
import { LanguageRoute } from "./routes/language";
import { PublisherRoute } from "./routes/publisher";
import { GenreRoute } from "./routes/genre";
import { AuthorRoute } from "./routes/author";
import { GroupRoute } from "./routes/group";

const router = express.Router();

//Auth routes
router.post(ROUTE.LOGIN_USER, AuthRoute.loginUser);
router.post(ROUTE.REGISTER_USER, authenticated, AuthRoute.registerUser);
router.get(ROUTE.GET_STUDENT_ALL, authenticated, AuthRoute.getStudentAll);
router.post(ROUTE.REFRESH_TOKEN, AuthRoute.refreshToken);

//Book routes
router.post(ROUTE.ADD_BOOK, authenticated, BooksRoute.addBook);
router.get(ROUTE.GET_BOOK_ALL, authenticated, BooksRoute.getBookAll);
router.get(ROUTE.GET_BOOK_ONE, BooksRoute.getBookOne);
router.delete(ROUTE.DELETE_BOOK, authenticated, BooksRoute.deleteBook);

//Language routes
router.post(ROUTE.ADD_LANG, authenticated, LanguageRoute.addLanguage);
router.get(ROUTE.GET_LANG_ONE, authenticated, LanguageRoute.getLanguageOne);
router.get(ROUTE.GET_LANG_ALL, authenticated, LanguageRoute.getLanguageAll);

//Author routes
router.post(ROUTE.ADD_AUTHOR, authenticated, AuthorRoute.addAuthor);
router.get(ROUTE.GET_AUTHOR_ONE, authenticated, AuthorRoute.getAuthorOne);
router.get(ROUTE.GET_AUTHOR_ALL, authenticated, AuthorRoute.getAuthorAll);

//Publisher routes
router.post(ROUTE.ADD_PUBLISHER, authenticated, PublisherRoute.addPublisher);
router.get(ROUTE.GET_PUBLISHER_ONE, authenticated, PublisherRoute.getPublisherOne);
router.get(ROUTE.GET_PUBLISHER_ALL, authenticated, PublisherRoute.getPublisherAll);

//Genre routes
router.post(ROUTE.ADD_GENRE, authenticated, GenreRoute.addGenre);
router.get(ROUTE.GET_GENRE_ONE, authenticated, GenreRoute.getGenreOne);
router.get(ROUTE.GET_GENRE_ALL, authenticated, GenreRoute.getGenreAll);

//Group routes
router.post(ROUTE.ADD_GROUP, authenticated, GroupRoute.addGroup);
router.get(ROUTE.GET_GROUP_ONE, authenticated, GroupRoute.getGroupOne);
router.get(ROUTE.GET_GROUP_ALL, authenticated, GroupRoute.getGroupAll);

export default router;
