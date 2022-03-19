import "reflect-metadata";
import {createConnection} from "typeorm";
import { app } from "./api/app";

const port = 3001;

createConnection().then((connection) => {
    console.log(" --- Baza danych uruchomiona")
    app.listen(port, () => {
        console.log(" --- Api działa na porcie: " + port);
    });
}).catch(error => console.log(error));
