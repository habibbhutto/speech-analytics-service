import Datafile from "../entities/datafile";
import dataSource from "../datasource";

const DatafileRepository = dataSource.getRepository(Datafile);

export default DatafileRepository;