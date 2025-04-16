import Link from 'next/link'
import { headers } from 'next/headers'

/** @自定义404组件 **/
export default async function NotFound() {
    const headersList = await headers()
    const domain = headersList.get('host')
    return (
        <div>
            <h2>Not Found:404 </h2>
            <p>Could not find requested resource</p>
            <p>
                View <Link href="/">all posts</Link>
            </p>
        </div>
    )
}