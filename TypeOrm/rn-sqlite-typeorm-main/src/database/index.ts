import { DataSource  } from "typeorm";
import { ProductEntity } from "./entities/ProductEntity";

const dataSource = new DataSource({
    database: 'database.db',
    entities: [ ProductEntity ],
    type: 'expo',
    driver: require('expo-sqlite'),
    synchronize: true,
});

export { dataSource }