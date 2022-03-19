export interface IBookData {
    id: string;
    isbn: string;
    title: string;
    publicationDate: Date;
    language: string;
    publisher: string;
    author: string;
    genres: {
        ids: boolean;
        search: string[];
    };
    description: string;
}
