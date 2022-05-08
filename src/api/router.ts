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
import { IssueRoute } from "./routes/issue";
import { StatsRoute } from "./routes/stats";

const router = express.Router();

//Auth routes
router.post(ROUTE.LOGIN_USER, AuthRoute.loginUser);
router.post(ROUTE.LOGIN_STUDENT, AuthRoute.loginStudent);
router.post(ROUTE.REGISTER_USER, authenticated(), AuthRoute.registerUser);
router.get(ROUTE.GET_STUDENT_ALL, authenticated(), AuthRoute.getStudentAll);
router.get(ROUTE.GET_STUDENT_ONE, authenticated(), AuthRoute.getStudentOne);
router.post(ROUTE.REFRESH_TOKEN, AuthRoute.refreshToken);
router.post(ROUTE.CHANGE_PASSWORD, authenticated(true), AuthRoute.changePassword);

//Book routes
router.post(ROUTE.ADD_BOOK, authenticated(), BooksRoute.addBook);
router.get(ROUTE.GET_BOOK_ALL, authenticated(true), BooksRoute.getBookAll);
router.get(ROUTE.GET_BOOK_ONE, authenticated(), BooksRoute.getBookOne);
router.delete(ROUTE.DELETE_BOOK, authenticated(), BooksRoute.deleteBook);

//Language routes
router.post(ROUTE.ADD_LANG, authenticated(), LanguageRoute.addLanguage);
router.get(ROUTE.GET_LANG_ONE, authenticated(), LanguageRoute.getLanguageOne);
router.get(ROUTE.GET_LANG_ALL, authenticated(), LanguageRoute.getLanguageAll);

//Author routes
router.post(ROUTE.ADD_AUTHOR, authenticated(), AuthorRoute.addAuthor);
router.get(ROUTE.GET_AUTHOR_ONE, authenticated(), AuthorRoute.getAuthorOne);
router.get(ROUTE.GET_AUTHOR_ALL, authenticated(), AuthorRoute.getAuthorAll);

//Publisher routes
router.post(ROUTE.ADD_PUBLISHER, authenticated(), PublisherRoute.addPublisher);
router.get(ROUTE.GET_PUBLISHER_ONE, authenticated(), PublisherRoute.getPublisherOne);
router.get(ROUTE.GET_PUBLISHER_ALL, authenticated(), PublisherRoute.getPublisherAll);

//Genre routes
router.post(ROUTE.ADD_GENRE, authenticated(), GenreRoute.addGenre);
router.get(ROUTE.GET_GENRE_ONE, authenticated(), GenreRoute.getGenreOne);
router.get(ROUTE.GET_GENRE_ALL, authenticated(true), GenreRoute.getGenreAll);

//Group routes
router.post(ROUTE.ADD_GROUP, authenticated(), GroupRoute.addGroup);
router.get(ROUTE.GET_GROUP_ONE, authenticated(), GroupRoute.getGroupOne);
router.get(ROUTE.GET_GROUP_ALL, authenticated(), GroupRoute.getGroupAll);

//Issue routes
router.post(ROUTE.ADD_ISSUE, authenticated(), IssueRoute.addIssue);
router.post(ROUTE.RETURN_ISSUE, authenticated(), IssueRoute.returnIssue);
router.get(ROUTE.GET_ISSUE_ONE, authenticated(), IssueRoute.getIssueOne);
router.get(ROUTE.GET_ISSUE_BY_USER_ID, authenticated(true), IssueRoute.getIssuesByUserId);
router.get(ROUTE.GET_ISSUE_ALL, authenticated(), IssueRoute.getIssueAll);
router.get(ROUTE.GET_ISSUE_OVERDUES, authenticated(), IssueRoute.getIssueOverdues);

//Stats routes
router.get(ROUTE.GET_BOOKS_PAGE_STATS, StatsRoute.getBooksPageStats);
router.get(ROUTE.GET_MEMBERS_PAGE_STATS, StatsRoute.getMembersPageStats);
router.get(ROUTE.GET_ISSUES_PAGE_STATS, StatsRoute.getIssuesPageStats);

export default router;
