export const enum ROUTE {
    //auth routes
    LOGIN_USER = "/v1/auth/login",
    REGISTER_USER = "/v1/auth/register",
    REFRESH_TOKEN = "/v1/auth/refreshToken",

    //user | member routes
    GET_STUDENT_ALL = "/v1/user/member/all",
    GET_STUDENT_ONE = "/v1/user/member",

    //books routes
    ADD_BOOK = "/v1/book/add",
    GET_BOOK_ALL = "/v1/book/all",
    GET_BOOK_ONE = "/v1/book",
    DELETE_BOOK = "/v1/book/delete",

    //lang routes
    ADD_LANG = "/v1/lang/add",
    GET_LANG_ONE = "/v1/lang",
    GET_LANG_ALL = "/v1/lang/all",

    //author routes
    ADD_AUTHOR = "/v1/author/add",
    GET_AUTHOR_ONE = "/v1/author",
    GET_AUTHOR_ALL = "/v1/author/all",

    //publisher routes
    ADD_PUBLISHER = "/v1/publisher/add",
    GET_PUBLISHER_ONE = "/v1/publisher",
    GET_PUBLISHER_ALL = "/v1/publisher/all",

    //genre routes
    ADD_GENRE = "/v1/genre/add",
    GET_GENRE_ONE = "/v1/genre",
    GET_GENRE_ALL = "/v1/genre/all",

    //group routes
    ADD_GROUP = "/v1/group/add",
    GET_GROUP_ONE = "/v1/group",
    GET_GROUP_ALL = "/v1/group/all",

    //issue routes
    ADD_ISSUE = "/v1/issue/add",
    GET_ISSUE_ONE = "/v1/issue",
    GET_ISSUE_ALL = "/v1/issue/all",
    GET_ISSUE_OVERDUES = "/v1/issue/overdues",

    //stats routes
    GET_BOOKS_PAGE_STATS = "/v1/stats/books",
    GET_MEMBERS_PAGE_STATS = "/v1/stats/members",
}

export const enum ERROR {
    USER_NOT_FOUND = "User not found",
    USER_NOT_ADDED = "Error when adding user",
    GETTING_STUDENT_ALL = "Error when getting all students",
    INVALID_REFRESH_TOKEN = "Invalid refresh token",
    INVALID_TOKEN = "Invalid token",
    ACCESS_DENIED = "Access denied",

    ADDING_BOOK = "Error when adding a book",
    GETTING_BOOK_ALL = "Error when getting all books",
    GETTING_BOOK_ONE = "Error when getting a book",
    FETCHED_DATA_NULL = "Some data was fetched as null",
    DELETING_BOOK = "Error when deleting a book",

    ADDING_LANGUAGE = "Error when adding language",
    LANG_NOT_FOUND = "Language not found",
    GETTING_LANG_ALL = "Error when getting all languages",

    ADDING_CONDITION = "Error when adding condition",
    CONDITION_NOT_FOUND = "Condition not found",
    GETTING_CONDITION_ALL = "Error when getting all conditions",

    ADDING_PUBLISHER = "Error when adding publisher",
    PUBLISHER_NOT_FOUND = "Publisher not found",
    GETTING_PUBLISHER_ALL = "Error when getting all publishers",

    ADDING_GENRE = "Error when adding genre",
    GENRE_NOT_FOUND = "Genre not found",
    GETTING_GENRE_ALL = "Error when getting all genres",

    ADDING_AUTHOR = "Error when adding author",
    AUTHOR_NOT_FOUND = "Author not found",
    GETTING_AUTHORS_ALL = "Error when getting all authors",

    ADDING_GROUP = "Error when adding group",
    GROUP_NOT_FOUND = "Group not found",
    GETTING_GROUPS_ALL = "Error when getting all groups",

    ADDING_ISSUE = "Error when adding issue",
    ISSUE_NOT_FOUND = "Issue not found",
    GETTING_ISSUE_ALL = "Error when getting all issues",

    GETTING_BOOKS_STATS = "Error when getting books stats",
    GETTING_MEMBERS_STATS = "Error when getting members stats",
}
