import { POSTSessionToken, DELETESessionToken } from "./User/session-token";
import { GETUserProfile } from "./User/user-profile";
import { GETUserMarginSegments } from "./User/user-margins-segment";

export const router = (server: any) => {
    server.post('/session/token', POSTSessionToken);
    server.post('/user/profile', GETUserProfile);
    server.post('user/margins/:segment', GETUserMarginSegments);
    server.delete('/session/token', DELETESessionToken);

}