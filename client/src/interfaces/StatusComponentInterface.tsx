import { ProfileInterface } from "./ProfileDataInterface";
import { Status } from "./types/Status";

export interface StatusComponent {
    status: Status;
    closeModal?: (close: boolean) => void;
    setData?: any;
}