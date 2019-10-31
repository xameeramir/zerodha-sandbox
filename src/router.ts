import { POSTSessionToken, DELETESessionToken } from "./User/session-token";

export const router = (server: any) => {
    server.post('/session/token', POSTSessionToken);

    server.delete('/session/token', DELETESessionToken);
}