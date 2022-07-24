import globe from "./globe-png-31489.png";
import table from "./table.png";
import email from "./email_14410.png"
import send from "./send-svgrepo-com.svg"
import download from "./download-svgrepo-com.svg"

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

export function Email(props: { size: string })
{
    return (
        <img style={{width: props.size, height: props.size}} src={email} alt={"email"}/>
    )
}

export function Send(props: { size: string })
{
    return (
        <img style={{width: props.size, height: props.size}} src={send} alt={"send"}/>
    )
}

export function Download(props: { size: string })
{
    return (
        <img style={{width: props.size, height: props.size}} src={download} alt={"download"}/>
    )
}
