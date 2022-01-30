export default function Dump({data}) {
    return <pre>
        {JSON.stringify(data, null, 2)}
    </pre>
}