import * as e from "express"
import {Controller} from "../llama";
import {Get} from "../llama/get";
import {WunderlistService} from "../services/wunderlist.service";

@Controller()
export class TasksController {
    wunderlist_service = new WunderlistService();

    @Get({path: '/'})
    async tasks(request: e.Request, response: e.Response) {
        try {
            const lists = await this.wunderlist_service.lists.get();

            console.log(`Found ${lists.length} lists.`);

            const task_requests = lists.map(list => new Promise(async result => {
                const tasks = await this.wunderlist_service.tasks.get(list.id);

                console.log(`Found ${tasks.length} tasks for ${list.id}.`);

                result({
                    list,
                    tasks
                })
            }));

            try {
                const tasks = await Promise.all(task_requests);
                response.send(`<script>console.log(${JSON.stringify(tasks)})</script>`);
            }
            catch (error) {
                console.log(error);
            }
        }
        catch (error) {
            response.send('error')
        }
    }

    @Get({path: '/:id'})
    async task(request: e.Request, response: e.Response) {
        const {id} = request.params;
        try {
            const tasks = await this.wunderlist_service.tasks.getOne(id);

            response.send(`<script>console.log(${JSON.stringify(tasks)})</script>`);
        }
        catch (error) {
            response.send('error')
        }
    }
}