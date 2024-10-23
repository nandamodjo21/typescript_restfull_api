
import {ResponseError} from "../error/response_error";
import {startBot} from "../utils/star_sock";

const init = async (socket?:any) => {
    try {
        await startBot();
    }catch (e) {
        throw new ResponseError(404,`${e}`);
    }
}
export default init;