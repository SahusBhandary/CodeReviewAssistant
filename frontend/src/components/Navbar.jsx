import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="flex justify-between px-15 py-2 border-b border-gray-500">
            <div>
                <Link href="/">Home</Link>
            </div>
            <div>
                <Link href="/repos">Repos</Link>
            </div>
            <div>
                <Link href="/login">Login</Link>
            </div>
        </nav>
    )
}

export default Navbar;