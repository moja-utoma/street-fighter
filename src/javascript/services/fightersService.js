import callApi from '../helpers/apiHelper';

class FighterService {
    #endpointGetAll = 'fighters.json';

    #endpointGetOne = 'details/fighter';

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpointGetAll);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    async getFighterDetails(id) {
        try {
            const fighterDetails = await callApi(`${this.#endpointGetOne}/${id}.json`);
            return fighterDetails;
        } catch (error) {
            throw error;
        }
    }
}

const fighterService = new FighterService();

export default fighterService;
