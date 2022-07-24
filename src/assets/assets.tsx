import globe from "./globe-png-31489.png";
import table from "./table.png";

export function Globe(props: { size: string })
{
    return (
        <img style={{width: props.size, height: props.size}} src={globe} alt={"earth"}/>
    );
}

export function Table(props: { size: string })
{
    return (
        <img style={{width: props.size, height: props.size}} src={table} alt={"table"}/>
    );
}
