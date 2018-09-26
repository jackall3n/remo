import * as e from "express"
import {Controller} from "../llama";
import {Get} from "../llama/get";
import { WunderlistService } from "../services/wunderlist.service";

@Controller()
export class ListsController {
    wunderlist_service = new WunderlistService();

    @Get({path: '/'})
    async lists(request: e.Request, response: e.Response) {
        try {
            const lists = this.wunderlist_service.lists();

            response.send(`<script>console.log(${JSON.stringify(lists)})</script>`);
        }
        catch (error) {
            response.send('error')
        }
    }

    @Get({path: '/tasks'})
    async tasks(request: e.Request, response: e.Response) {
        try {
            const lists = this.wunderlist_service.lists() as any;
            const task_requests = lists.map((list : any) => new Promise(async result => {
                const tasks = this.wunderlist_service.tasks(list.id);

                result({
                    list,
                    tasks
                })
            }));

            const tasks = Promise.all(task_requests);

            response.send(`<script>console.log(${JSON.stringify(tasks)})</script>`);
        }
        catch (error) {
            response.send('error')
        }
    }
}