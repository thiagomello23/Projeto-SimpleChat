import { Status } from "../interfaces/types/Status";

export default function statusColor(status: Status) {

    if(status == "Online") {
        return "#34D1BF";
    }

    if(status == "Ocupado") {
        return "#D1345B";
    }

    if(status == "Ausente") {
        return "#FEE440";
    }

}